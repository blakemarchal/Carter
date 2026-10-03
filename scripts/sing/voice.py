"""Makes Ara sing: each word she spoke is pitched onto the song's notes and held for their length.

Uses the WORLD vocoder (pyworld). Each spoken word is split into its pitch (f0), the shape of the
voice (spectral envelope) and breathiness (aperiodicity). The pitch is replaced with the melody,
the vowels are stretched to fill each note (consonants keep their natural length, landing just
before the beat as a singer's do), and the result is put back together as one continuous voice.
"""
import numpy as np
import pyworld as pw
import soundfile as sf

FS = 24000
FP = 5.0  # analysis frame period, ms
FFT = 1024
_SEC = FP / 1000.0
_FREQS = np.arange(FFT // 2 + 1) * FS / FFT
_BAND = (_FREQS > 150) & (_FREQS < 4500)


def _db(x):
    return 10 * np.log10(np.maximum(x, 1e-20))


class Word:
    """One spoken clip, analyzed and split into its syllables."""

    def __init__(self, path, n_syllables):
        x, fs = sf.read(path, dtype='float64')
        if x.ndim > 1:
            x = x.mean(axis=1)
        if fs != FS:
            raise ValueError(f'{path}: expected {FS} Hz, got {fs}')
        x = x / (np.abs(x).max() + 1e-9) * 0.5
        f0, t = pw.harvest(x, FS, f0_floor=70.0, f0_ceil=800.0, frame_period=FP)
        self.f0 = f0
        self.sp = pw.cheaptrick(x, f0, t, FS, fft_size=FFT)
        self.ap = pw.d4c(x, f0, t, FS, fft_size=FFT)
        n = len(f0)
        # Loudness per frame, from the waveform (reliable for finding silence).
        hop = int(FS * _SEC)
        win = hop * 2
        pad = np.pad(x, (win, win))
        rms = np.array([np.sqrt(np.mean(pad[i * hop + win - win // 2: i * hop + win + win // 2] ** 2)) for i in range(n)])
        self.loud = _db(rms ** 2)
        self.band = _db(self.sp[:, _BAND].sum(axis=1))
        # Where the word starts and stops (ignoring the quiet breath trailing after it).
        top = self.loud.max()
        start = int(np.argmax(self.loud > top - 38))
        end = len(self.loud) - int(np.argmax(self.loud[::-1] > top - 30))
        # Vowel-like frames: loud, with their energy low in the spectrum (hiss like s, sh, z, j is
        # high). Spoken words often end creaky (no clear pitch), so pitch isn't required.
        centroid = (self.sp * _FREQS).sum(axis=1) / self.sp.sum(axis=1)
        vowel = (self.loud > top - 30) & (centroid < 3000)
        vowel[:start] = vowel[end:] = False
        good = vowel & (f0 > 0)
        self.vowel_ap = np.median(self.ap[good if good.any() else vowel | (f0 > 0)], axis=0)
        e = np.where(vowel, self.loud, self.loud - 25)
        e = np.convolve(e, np.ones(5) / 5, mode='same')
        self.segments = self._split(e, vowel, start, end, n_syllables)

    @staticmethod
    def _split(e, vowel, start, end, k):
        """Finds each syllable's vowel, and gives the consonants between two vowels to the second
        (a singer puts them just before the next note)."""
        peaks = [i for i in range(start + 1, end - 1) if vowel[i] and e[i] >= e[i - 1] and e[i] >= e[i + 1]]
        peaks.sort(key=lambda i: -e[i])
        chosen = []
        for p in peaks:
            if all(abs(p - c) >= 14 for c in chosen):
                chosen.append(p)
            if len(chosen) == k:
                break
        chosen.sort()
        cores = []
        if len(chosen) == k:
            for j, p in enumerate(chosen):
                lo = cores[-1][1] if cores else start
                hi = chosen[j + 1] if j + 1 < k else end
                cs, ce = p, p + 1
                while cs > lo and vowel[cs - 1] and e[cs - 1] >= e[p] - 14:
                    cs -= 1
                while ce < hi and vowel[ce] and e[ce] >= e[p] - 14:
                    ce += 1
                if ce - cs < 4:
                    cs, ce = max(lo, p - 2), min(hi, p + 2)
                cores.append((cs, ce))
        else:  # couldn't find every vowel: share the word out evenly
            edges = np.linspace(start, end, k + 1).astype(int)
            cores = [(int(edges[j] + (edges[j + 1] - edges[j]) * 0.2), int(edges[j] + (edges[j + 1] - edges[j]) * 0.8)) for j in range(k)]
        segs = []
        for j, (cs, ce) in enumerate(cores):
            a = start if j == 0 else cores[j - 1][1]
            b = ce if j + 1 < k else end
            segs.append((a, cs, ce, b))
        return segs


def _stretch_index(n_src, n_out):
    """Where each output frame reads from a source of n_src frames: hold the middle of a vowel and
    keep its start and end (where it moves into and out of consonants) at natural speed."""
    if n_out <= 0:
        return np.zeros(0)
    if n_out <= n_src or n_src < 8:
        return np.linspace(0, n_src - 1, n_out)
    edge = max(2, int(n_src * 0.22))
    mid_out = n_out - 2 * edge
    head = np.arange(edge, dtype=float)
    middle = np.linspace(edge, n_src - 1 - edge, mid_out)
    tail = np.arange(n_src - edge, n_src, dtype=float)
    return np.concatenate([head, middle, tail])


def _take(arr, idx, log=False):
    lo = np.floor(idx).astype(int)
    hi = np.minimum(lo + 1, len(arr) - 1)
    w = (idx - lo)[:, None]
    if log:
        return np.exp(np.log(arr[lo]) * (1 - w) + np.log(arr[hi]) * w)
    return arr[lo] * (1 - w) + arr[hi] * w


def sing(events, total_sec, words, seed=1):
    """events: list of dict(word=<Word>, seg=<index>, notes=[(midi, start_sec, dur_sec)],
    joined=<next syllable follows with no gap>, breath=<take a breath after>, accent=<dB>).
    Returns mono audio at FS."""
    rng = np.random.default_rng(seed)
    n = int(total_sec / _SEC) + 2
    f0 = np.zeros(n)
    target = np.full(n, np.nan)  # sung pitch in semitones, where the voice is pitched
    sp = np.full((n, FFT // 2 + 1), 1e-16)
    ap = np.ones((n, FFT // 2 + 1))
    core_mask = np.zeros(n, bool)
    note_age = np.zeros(n)  # seconds since the current note began (for vibrato)
    phrase_start = np.zeros(n, bool)

    ref = np.median([np.percentile(w.band[s[1]:s[2]], 80) for w in words for s in w.segments])

    # Consonants keep their natural length, but very long ones are quickened (never cut short).
    plans = []
    for i, ev in enumerate(events):
        a, cs, ce, b = ev['word'].segments[ev['seg']]
        onset = min(cs - a, int(0.14 / _SEC))
        if i and events[i - 1]['joined']:  # don't let it eat more than a little of a short note before
            onset = min(onset, int(0.35 * events[i - 1]['notes'][-1][2] / _SEC))
        plans.append(dict(onset=onset, coda=min(b - ce, int(0.18 / _SEC))))

    for i, ev in enumerate(events):
        w = ev['word']
        p = plans[i]
        t0 = ev['notes'][0][1]
        t_end = ev['notes'][-1][1] + ev['notes'][-1][2]
        if ev['joined'] and i + 1 < len(events):
            stop = events[i + 1]['notes'][0][1] - plans[i + 1]['onset'] * _SEC
        else:
            stop = t_end - min(0.12 if ev['breath'] else 0.07, 0.25 * (t_end - t0))
        f_t0 = int(round(t0 / _SEC))
        f_stop = int(round(stop / _SEC))
        onset, coda = p['onset'], p['coda']
        room = f_stop - f_t0
        if room - coda < 6:  # short note: squeeze the consonants after the vowel
            coda = max(0, min(coda, room // 3))
        n_core = max(4, room - coda)
        a, cs, ce, b = w.segments[ev['seg']]
        idx = np.concatenate([
            np.linspace(a, cs, onset, endpoint=False),
            cs + _stretch_index(ce - cs, n_core),
            np.linspace(ce, b, coda, endpoint=False),
        ])
        dst0 = f_t0 - onset
        src_sp = _take(w.sp, idx, log=True)
        src_ap = _take(w.ap, idx)
        src_voiced = w.f0[np.round(idx).astype(int)] > 0
        # Level: every vowel sung at about the same loudness, with the song's accents.
        level = np.percentile(w.band[cs:ce], 80)
        gain_db = ref - level + ev.get('accent', 0.0)
        gain = 10 ** (gain_db / 10)
        is_core = np.zeros(len(idx), bool)
        is_core[onset: onset + n_core] = True
        frame_lv = w.band[np.round(idx).astype(int)]
        shape = np.ones(len(idx))
        # Hold the vowel at an even loudness (speech fades as a word ends; a sung note doesn't)...
        corr = np.clip(level - frame_lv[is_core], -4, 10)
        if len(corr) > 9:
            corr = np.convolve(np.pad(corr, 4, mode='edge'), np.ones(9) / 9, mode='valid')
        shape[is_core] *= 10 ** (corr / 10)
        # ...and keep consonants (a "b" or "t" pop) from being louder than the vowel.
        over = np.maximum(0, frame_lv + gain_db - (ref - 3)) * ~is_core
        shape *= 10 ** (-over / 10)
        # Steady breathiness in the vowel (spoken words often end creaky; singers don't).
        src_ap[is_core] = np.minimum(src_ap[is_core], w.vowel_ap)
        # A gentle swell on long notes, and a soft finish into a breath.
        hold = n_core * _SEC
        if hold > 0.5:
            u = np.linspace(0, 1, n_core)
            shape[onset: onset + n_core] *= 10 ** ((1.2 * np.sin(np.pi * u) - 0.6 * u) / 10)
        if not ev['joined']:
            fade = min(n_core, int(0.08 / _SEC))
            shape[onset + n_core - fade: onset + n_core] *= np.linspace(1, 0.55, fade)
        voiced = is_core | src_voiced
        # Pitch: each note's pitch from its start, the consonant before the vowel takes the first note.
        semis = np.full(len(idx), float(ev['notes'][0][0]))
        age = np.zeros(len(idx))
        for m, st, du in ev['notes']:
            fs_ = int(round(st / _SEC)) - dst0
            semis[max(fs_, onset):] = m
            age[max(fs_, 0):] = np.arange(len(idx) - max(fs_, 0)) * _SEC
        first = np.zeros(len(idx), bool)
        if i == 0 or not events[i - 1]['joined']:
            first[: onset + int(0.09 / _SEC)] = True
        dst = np.arange(dst0, dst0 + len(idx))
        ok = (dst >= 0) & (dst < n)
        dst = dst[ok]
        sp[dst] = (src_sp * gain * shape[:, None])[ok]
        ap[dst] = src_ap[ok]
        target[dst] = np.where(voiced, semis, np.nan)[ok]
        core_mask[dst] = is_core[ok]
        note_age[dst] = age[ok]
        phrase_start[dst] |= first[ok]

    # Smooth pitch moves between notes (a short glide, the way a voice slides), per voiced run.
    voiced = ~np.isnan(target)
    pitch = np.where(voiced, target, 0.0)
    runs = np.flatnonzero(np.diff(np.concatenate([[0], voiced.astype(int), [0]])))
    k = np.hanning(11)
    k /= k.sum()
    for s, e in zip(runs[::2], runs[1::2]):
        seg = pitch[s:e]
        if e - s > 11:
            padded = np.pad(seg, 5, mode='edge')
            pitch[s:e] = np.convolve(padded, k, mode='valid')
    # A small scoop up into the first note of each phrase.
    scoop = np.zeros(n)
    for s, e in zip(runs[::2], runs[1::2]):
        if phrase_start[s]:
            m = min(e - s, int(0.07 / _SEC))
            scoop[s: s + m] = -0.45 * np.linspace(1, 0, m) ** 2
    # Vibrato on held notes, growing in gently; and a tiny natural drift.
    tt = np.arange(n) * _SEC
    depth = np.clip((note_age - 0.28) / 0.35, 0, 1) * 0.22 * core_mask
    vib = depth * np.sin(2 * np.pi * 5.4 * tt + rng.uniform(0, 6.28))
    drift = np.convolve(rng.normal(0, 1, n), np.hanning(61) / np.hanning(61).sum(), mode='same') * 0.35
    semis = pitch + scoop + vib + drift * 0.25
    f0 = np.where(voiced, 440.0 * 2 ** ((semis - 69) / 12), 0.0)
    y = pw.synthesize(f0, np.ascontiguousarray(sp), np.ascontiguousarray(ap), FS, frame_period=FP)
    return y
