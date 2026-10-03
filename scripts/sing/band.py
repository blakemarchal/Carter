"""The backing band: a few simple synthesized instruments and a way of playing chords for each style."""
import functools

import numpy as np
from scipy import signal

from model import chord_notes, hz

SR = 44100


class Track:
    """A stereo buffer that notes are added into."""

    def __init__(self, seconds):
        self.buf = np.zeros((int(seconds * SR) + SR, 2))

    def add(self, mono, at, gain=1.0, pan=0.0):
        i = int(at * SR)
        if i >= len(self.buf) or len(mono) == 0:
            return
        mono = mono[: len(self.buf) - i]
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.buf[i: i + len(mono), 0] += mono * gain * left * 1.41
        self.buf[i: i + len(mono), 1] += mono * gain * right * 1.41


def _t(seconds):
    return np.arange(int(seconds * SR)) / SR


def _env(n, attack, release_at, release):
    """Attack ramp, then a release from `release_at` seconds."""
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(attack, 1e-4))
    rel = t > release_at
    e[rel] *= np.exp(-(t[rel] - release_at) / release)
    return e


# ---- instruments (each returns mono audio for one note) ----

@functools.lru_cache(maxsize=None)
def piano(m, dur, vel=0.7):
    f = hz(m)
    length = dur + 1.2
    t = _t(length)
    out = np.zeros(len(t))
    tau = 1.6 * (261.6 / f) ** 0.45
    for k in range(1, int(min(16, 9000 / f)) + 1):
        fk = k * f * np.sqrt(1 + 0.00025 * k * k)
        a = (1 / k ** 1.15) * np.exp(-(k - 1) * (0.42 - 0.25 * vel))
        tk = tau / (1 + 0.45 * (k - 1))
        dec = 0.55 * np.exp(-t / (tk * 0.25)) + 0.45 * np.exp(-t / tk)
        for det in (-0.6, 0.6) if k <= 3 else (0,):
            out += a * dec * np.sin(2 * np.pi * fk * (1 + det / 1731) * t + k) / (2 if k <= 3 else 1)
    noise = np.random.default_rng(m).normal(0, 1, int(0.006 * SR)) * np.linspace(1, 0, int(0.006 * SR))
    out[: len(noise)] += signal.lfilter(*signal.butter(2, 2500 / (SR / 2)), noise) * 0.08
    return out * _env(len(t), 0.002, dur, 0.18) * vel


@functools.lru_cache(maxsize=None)
def music_box(m, vel=0.7):
    f = hz(m)
    t = _t(2.2)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.9)
    y += 0.35 * np.sin(2 * np.pi * f * 6.27 * t) * np.exp(-t / 0.08)  # the tine's bright ping
    y += 0.12 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.4)
    return y * _env(len(t), 0.001, 99, 1) * vel


@functools.lru_cache(maxsize=None)
def glock(m, vel=0.7):
    f = hz(m)
    t = _t(1.6)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.7) + 0.25 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.15)
    y += 0.1 * np.sin(2 * np.pi * f * 5.40 * t) * np.exp(-t / 0.05)
    return y * _env(len(t), 0.001, 99, 1) * vel


@functools.lru_cache(maxsize=None)
def bass(m, dur, vel=0.8):
    f = hz(m)
    length = dur + 0.15
    t = _t(length)
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t / 0.3) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t / 0.12)
    y *= 0.7 * np.exp(-t / 1.4) + 0.3
    return y * _env(len(t), 0.004, dur, 0.06) * vel


@functools.lru_cache(maxsize=None)
def pluck(m, dur, vel=0.7, bright=0.5):
    """A nylon string (Karplus-Strong): ukulele and guitar strums."""
    f = hz(m)
    length = dur + 0.4
    n_total = int(length * SR)
    period = max(2, int(round(SR / f - 0.5)))
    rng = np.random.default_rng(int(m * 7 + bright * 100))
    burst = rng.uniform(-1, 1, period)
    b, a = signal.butter(1, min(0.99, (1500 + 5000 * bright) / (SR / 2)))
    burst = signal.lfilter(b, a, burst)
    y = np.zeros(n_total + period + 1)  # y[0] is a zero before the string starts
    y[1:period + 1] = burst
    decay = 0.998 - 0.004 * (f / 1000)
    i = period + 1
    while i < n_total + 1:
        j = min(i + period, n_total + 1)
        y[i:j] = decay * 0.5 * (y[i - period: j - period] + y[i - period - 1: j - period - 1])
        i = j
    y = y[1:n_total + 1]
    return y * _env(len(y), 0.001, dur, 0.08) * vel


def pad(ms, dur, vel=0.5, bright=1400):
    """Soft strings / organ under the song: detuned saws through a gentle low-pass."""
    length = dur + 0.8
    t = _t(length)
    y = np.zeros(len(t))
    for m in ms:
        f = hz(m)
        for det in (-5, 5):
            y += signal.sawtooth(2 * np.pi * f * (1 + det / 1731) * t + m)
    b, a = signal.butter(2, bright / (SR / 2))
    y = signal.lfilter(b, a, y) / (2 * len(ms))
    return y * _env(len(t), 0.35, dur, 0.5) * vel


@functools.lru_cache(maxsize=None)
def flute(m, dur, vel=0.6):
    """A soft flute, for playing the tune."""
    f = hz(m)
    length = dur + 0.1
    t = _t(length)
    vib = 1 + 0.0045 * np.clip((t - 0.25) / 0.3, 0, 1) * np.sin(2 * np.pi * 5.2 * t)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    y = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = np.random.default_rng(m).normal(0, 1, len(t))
    lo, hi = max(50, f * 0.7), min(SR / 2 - 100, f * 2.5)
    breath = signal.lfilter(*signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], btype='band'), breath)
    y += breath * 0.05
    return y * _env(len(t), 0.05, dur, 0.06) * vel


_NOISE = np.random.default_rng(7).normal(0, 1, SR)


def kick():
    t = _t(0.35)
    f = 45 + 80 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14)


def clap():
    n = int(0.2 * SR)
    y = _NOISE[:n].copy()
    env = np.zeros(n)
    for d in (0, 0.011, 0.022):
        i = int(d * SR)
        env[i:] += np.exp(-np.arange(n - i) / SR / (0.006 if d < 0.02 else 0.07))
    y = signal.lfilter(*signal.butter(2, [900 / (SR / 2), 3200 / (SR / 2)], btype='band'), y * env)
    return y * 0.9


def shaker():
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    y = signal.lfilter(*signal.butter(2, 5500 / (SR / 2), btype='high'), _NOISE[1000:1000 + n])
    return y * np.minimum(1, t / 0.012) * np.exp(-t / 0.03)


def tambourine():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    y = signal.lfilter(*signal.butter(2, 6500 / (SR / 2), btype='high'), _NOISE[3000:3000 + n])
    jingle = sum(np.sin(2 * np.pi * f * t) for f in (5100, 6900, 8400)) * 0.15
    return (y + jingle) * np.exp(-t / 0.06)


# ---- reverb ----

def reverb(x, seconds=1.8, seed=3):
    """A soft room: convolution with decaying, darkening noise."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros((len(x) + n - 1, 2))
    for ch in range(2):
        ir = np.random.default_rng(seed + ch).normal(0, 1, n) * np.exp(-t * 6.9 / seconds)
        ir = signal.lfilter(*signal.butter(1, 3500 / (SR / 2)), ir)
        ir[: int(0.018 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = signal.fftconvolve(x[:, ch], ir)
    return out[: len(x)]


# ---- playing the chords in each style ----

def voicing(symbol, transpose, low=55, high=67):
    root, shape = chord_notes(symbol, transpose)
    notes = sorted({(root + i) % 12 for i in shape})
    out = []
    for pc in notes:
        m = low + ((pc - low) % 12)
        out.append(m)
    while max(out) - min(out) > 12 or max(out) > high + 2:
        out.sort()
        out[-1] -= 12
    return sorted(out), root


def bass_note(root, low=36):
    """The chord's root in the bass range (C2..B2)."""
    return low + (root - low) % 12


def accompany(song, chords, clock, total_sec, karaoke=False):
    """Returns the band's stereo mix (dry, reverb) as two Tracks."""
    style = song['style']
    meter = song['meter']
    tr = song.get('transpose', 0)
    dry = Track(total_sec)
    wet = Track(total_sec)  # sent to the reverb
    T = clock.time

    def note(fn, m, beat, beats, gain, pan=0.0, send=0.3, **kw):
        at = T(beat)
        dur = T(beat + beats) - at
        y = fn(m, round(dur, 2), **kw) if fn not in (music_box, glock) else fn(m, **kw)
        dry.add(y, at, gain, pan)
        wet.add(y, at, gain * send, pan)

    def hit(y, beat, gain, pan=0.0, send=0.15):
        dry.add(y, T(beat), gain, pan)
        wet.add(y, T(beat), gain * send, pan)

    end = chords[-1][1] + chords[-1][2]
    for i, (sym, start, beats) in enumerate(chords):
        chord, root = voicing(sym, tr)
        low = bass_note(root)
        last = i == len(chords) - 1
        if style == 'hymn':
            # Piano: bass note, then a flowing broken chord in eighths; soft strings underneath.
            note(piano, low + 12, start, beats, 0.55, -0.2)
            pattern = [chord[0], chord[1], chord[2], chord[1]]
            steps = int(beats * 2) if not last else 2
            for s in range(steps):
                note(piano, pattern[s % len(pattern)], start + s / 2, 1.5 if not last else beats, 0.26, 0.25)
            if last:
                for m in chord:
                    note(piano, m + 12, start + 1, beats - 1, 0.18, 0.2)
            hit(pad(tuple(chord), T(start + beats) - T(start), 0.5, 1100), start, 0.22)
        elif style == 'gospel':
            # Piano bass on 1 and 3, chord stabs on 2 and 4; claps and tambourine on the backbeat.
            for b in range(int(beats)):
                beat = start + b
                bar_pos = beat % meter
                if bar_pos in (0, 2):
                    m = low if bar_pos == 0 else low + 7
                    note(bass, m, beat, 0.9, 0.55, 0, 0.05)
                    note(piano, (low if bar_pos == 0 else low + 7) + 12, beat, 0.9, 0.35, -0.25)
                else:
                    for m in chord:
                        note(piano, m + 12, beat, 0.45, 0.2, 0.2)
                    if not last:
                        hit(clap(), beat, 0.32, 0.15)
                        hit(tambourine(), beat, 0.18, -0.35)
                if not last:
                    hit(shaker(), beat + 0.5, 0.07, 0.4, 0.05)
                    hit(shaker(), beat, 0.04, 0.4, 0.05)
            hit(pad(tuple(chord), T(start + beats) - T(start), 0.35, 1800), start, 0.12)
            if last:
                for m in chord:
                    note(piano, m + 12, start, beats, 0.25, 0.2)
        elif style == 'waltz':
            # Gentle waltz: bass on 1, chord on 2 and 3, with music-box sparkles; strings underneath.
            for b in range(int(beats)):
                beat = start + b
                pos = beat % meter
                if pos == 0 or last:
                    note(piano, low + 12, beat, 2.8 if not last else beats, 0.45, -0.2)
                    if last:
                        for m in chord:
                            note(piano, m + 12, beat, beats, 0.2, 0.2)
                        break
                else:
                    for m in chord:
                        note(piano, m + 12, beat, 0.9, 0.13, 0.25)
                if pos == 0:
                    note(music_box, chord[-1] + 24, beat, 1, 0.07, 0.5, 0.6)
            hit(pad(tuple(chord), T(start + beats) - T(start), 0.5, 1000), start, 0.24)
        elif style == 'lullaby':
            # Music-box arpeggios over soft strings and a low hum of bass.
            arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[0] + 24, chord[2] + 12, chord[1] + 12]
            steps = int(beats * 2) if not last else 1
            for s in range(steps):
                note(music_box, arp[(s + int(start * 2)) % len(arp)], start + s / 2, 0.5, 0.16, 0.3 * (1 if s % 2 else -1), 0.5)
            note(bass, low + 12, start, beats, 0.3, 0, 0.1)
            hit(pad(tuple(chord), T(start + beats) - T(start), 0.5, 900), start, 0.26)
            if last:
                note(music_box, chord[0] + 24, start + 1, 1, 0.14, 0, 0.6)
        elif style == 'party':
            # Ukulele strums, bass on 1, shaker.
            uke = [m + 12 if m < 60 else m for m in chord] + [chord[0] + 12]
            for b in range(int(beats)):
                beat = start + b
                pos = beat % meter
                strum = [0, 0.5] if pos else [0]
                for s in strum:
                    down = s == 0
                    for j, m in enumerate(uke if down else reversed(uke)):
                        dry_gain = 0.2 if (pos == 0 and down) else 0.13
                        note(pluck, m, beat + s + j * 0.012 * (2 if down else 1), 0.6 if not last else beats, dry_gain, 0.3)
                    if last:
                        break
                if pos == 0:
                    note(bass, low + 12, beat, 0.9 if not last else beats, 0.5, 0, 0.05)
                    if not last:
                        hit(kick(), beat, 0.35, 0, 0.0)
                if not last:
                    hit(shaker(), beat + 0.5, 0.08, 0.4, 0.05)
                if last:
                    break
        elif style == 'bouncy':
            # Island strum (down, down-up, up-down-up), bass on 1 and 3, kick and clap.
            uke = [m + 12 if m < 60 else m for m in chord] + [chord[0] + 12]
            for b in range(int(beats)):
                beat = start + b
                pos = beat % meter
                eighths = {0: ['D'], 1: ['D', 'U'], 2: [None, 'U'], 3: ['D', 'U']}[pos] if not last else ['D']
                for e, d in enumerate(eighths):
                    if not d:
                        continue
                    order = uke if d == 'D' else list(reversed(uke))
                    for j, m in enumerate(order):
                        note(pluck, m, beat + e / 2 + j * 0.01, 0.45 if not last else beats, 0.15 if d == 'D' else 0.1, 0.3, 0.2, bright=0.6)
                if pos in (0, 2):
                    note(bass, (low if pos == 0 else low + 7) + 12, beat, 0.8 if not last else beats, 0.5, 0, 0.05)
                    if not last:
                        hit(kick(), beat, 0.4, 0, 0.0)
                elif not last:
                    hit(clap(), beat, 0.25, 0.1)
                if not last:
                    hit(shaker(), beat + 0.5, 0.07, 0.45, 0.05)
                if last:
                    break
    return dry, wet
