"""Makes the sing-along songs: Ara singing each song over its band, and a sing-it-yourself version
with the tune played on a flute instead. Writes public/music/*.mp3 and src/data/songs.gen.json.

  python scripts/sing/make.py <folder of Ara's word clips>  [--only <song id>] [--wav]

The word clips come from fetch-words.mjs (run on the server, where the voice key is).
Needs: pip install -r scripts/sing/requirements.txt
"""
import argparse
import hashlib
import json
import os

import lameenc
import numpy as np
import pyworld as pw
from scipy import signal

import voice
from band import SR, Track, accompany, flute, glock, reverb
from model import build
from scores import SONGS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_AUDIO = os.path.join(ROOT, 'public', 'music')
OUT_JSON = os.path.join(ROOT, 'src', 'data', 'songs.gen.json')


def rms_db(x):
    loud = x[np.abs(x) > 1e-4]
    return 10 * np.log10(np.mean((loud if len(loud) else x) ** 2) + 1e-20)


def to_mp3(stereo, kbps=96):
    enc = lameenc.Encoder()
    enc.set_bit_rate(kbps)
    enc.set_in_sample_rate(SR)
    enc.set_channels(2)
    enc.set_quality(2)
    pcm = (np.clip(stereo, -1, 1) * 32767).astype('<i2')
    return enc.encode(pcm.tobytes()) + enc.flush()


def master(x):
    """Soft-limit the peaks and normalize to just under full scale."""
    x = x / (np.abs(x).max() + 1e-9) * 1.25
    over = np.abs(x) > 0.8
    x[over] = np.sign(x[over]) * (0.8 + 0.2 * np.tanh((np.abs(x[over]) - 0.8) / 0.2))
    return x / (np.abs(x).max() + 1e-9) * 0.93


def pitch_error(vocal24, events):
    """How far the sung pitch is from the written notes, in cents (median, and the worst 5%)."""
    f0, t = pw.harvest(vocal24.astype(np.float64), voice.FS, f0_floor=100, f0_ceil=900, frame_period=10)
    errs = []
    for ev in events:
        for m, st, du in ev['notes']:
            a, b = st + 0.03, st + du * 0.6  # the held part of the note, not the slide into the next
            sel = (t >= a) & (t <= b) & (f0 > 0)
            if sel.any():
                errs.extend(1200 * np.log2(f0[sel] / (440 * 2 ** ((m - 69) / 12))))
    errs = np.abs(np.array(errs))
    return float(np.median(errs)), float(np.percentile(errs, 95))


def render(song, words_dir, index, wav=False):
    sylls, lines, chords, clock, end_beat = build(song)
    T = clock.time
    total = T(end_beat) + 3.0
    meter = song['meter']

    clips, events = {}, []
    for i, s in enumerate(sylls):
        if s['slot']:
            continue  # the name: the flute plays it, and the game says it
        text, n, j = s['tts']
        if text not in clips:
            clips[text] = voice.Word(os.path.join(words_dir, index[text]), n)
        nxt = sylls[i + 1] if i + 1 < len(sylls) else None
        end = s['notes'][-1][1] + s['notes'][-1][2]
        follows = nxt is not None and not nxt['slot'] and abs(nxt['notes'][0][1] - end) < 1e-6
        b0 = s['notes'][0][1]
        accent = 1.0 if abs(b0 % meter) < 1e-6 else (-1.0 if abs(b0 % 1) > 1e-6 else 0.0)
        events.append(dict(
            word=clips[text], seg=j, accent=accent,
            notes=[(m, T(b), T(b + d) - T(b)) for m, b, d in s['notes']],
            joined=follows and nxt['line'] == s['line'],
            breath=follows and nxt['line'] != s['line'],
        ))
    vocal24 = voice.sing(events, total, list(clips.values()))
    err = pitch_error(vocal24, events)
    vocal = signal.resample_poly(vocal24, 147, 80)
    vocal = signal.lfilter(*signal.butter(2, 110 / (SR / 2), btype='high'), vocal)

    band_dry, band_wet = accompany(song, chords, clock, total)
    tune = Track(total)
    name_tune = Track(total)  # the name's notes, played louder in Ara's version where she doesn't sing
    for s in sylls:
        for m, b, d in s['notes']:
            (name_tune if s['slot'] else tune).add(flute(m, round(T(b + d) - T(b), 2)), T(b), 1.0, 0.1)
    if song['style'] in ('lullaby', 'party', 'bouncy'):
        for s in sylls:
            m, b, d = s['notes'][0]
            tune.add(glock(m + 12), T(b), 0.25, -0.1)

    n = len(band_dry.buf)
    vocal = np.pad(vocal, (0, max(0, n - len(vocal))))[:n]
    band = band_dry.buf
    g_band = 10 ** ((-22.5 - rms_db(band.sum(axis=1))) / 20)
    g_vox = 10 ** ((-20.5 - rms_db(vocal)) / 20)
    g_tune = 10 ** ((-22 - rms_db(tune.buf.sum(axis=1))) / 20)
    vox2 = np.stack([vocal, vocal], axis=1) * g_vox

    outputs = {}
    for kind, tune_gain, vox_gain, name_gain in (('ara', 0.16, 1.0, 0.6), ('sing', 1.0, 0.0, 1.0)):
        melody = tune.buf * tune_gain + name_tune.buf * name_gain
        dry = band * g_band + vox2 * vox_gain + melody * g_tune
        wet = band_wet.buf * g_band + vox2 * vox_gain * 0.28 + melody * g_tune * 0.3
        mix = master(dry + reverb(wet) * 0.55)
        tail = np.flatnonzero(np.abs(mix).max(axis=1) > 0.002)
        mix = mix[: tail[-1] + int(0.3 * SR)]
        fade = int(0.3 * SR)
        mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
        outputs[kind] = mix

    timing = dict(
        duration=round(len(outputs['ara']) / SR, 2),
        meter=meter,
        beats=[round(T(b), 3) for b in range(int(end_beat) + 1)],
        lines=[],
    )
    slots = [s for s in sylls if s['slot']]
    if slots:
        # When to say the name, and when its notes end.
        first, last = slots[0]['notes'][0], slots[-1]['notes'][-1]
        timing['name'] = [round(T(first[1]), 3), round(T(last[1] + last[2]), 3)]
    for li, line in enumerate(lines):
        words = []
        for w in line['words']:
            first = sylls[w['syllables'][0]]
            words.append([w['text'], round(T(first['notes'][0][1]), 3)])
        last = [s for s in sylls if s['line'] == li][-1]['notes'][-1]
        timing['lines'].append(dict(start=words[0][1], end=round(T(last[1] + last[2]), 3), words=words))

    files = {}
    for kind, mix in outputs.items():
        data = to_mp3(mix, 96 if kind == 'ara' else 80)
        stem = song['id'] + ('' if kind == 'ara' else '-sing')
        name = f'{stem}.{hashlib.sha1(data).hexdigest()[:8]}.mp3'
        for old in os.listdir(OUT_AUDIO):
            if old.startswith(stem + '.') and old.endswith('.mp3'):
                os.remove(os.path.join(OUT_AUDIO, old))
        with open(os.path.join(OUT_AUDIO, name), 'wb') as f:
            f.write(data)
        files[kind] = f'/music/{name}'
        if wav:
            import soundfile as sf
            sf.write(os.path.join(words_dir, f'{stem}.wav'), mix, SR)
            if kind == 'ara':
                sf.write(os.path.join(words_dir, f'{stem}-vocal.wav'), vocal24 / (np.abs(vocal24).max() + 1e-9) * 0.9, voice.FS)
    timing['audio'] = files
    print(f"{song['id']}: {timing['duration']}s, pitch off by {err[0]:.0f} cents typically ({err[1]:.0f} for the worst 5%)", flush=True)
    return timing


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('words')
    ap.add_argument('--only')
    ap.add_argument('--wav', action='store_true', help='also write .wav files next to the word clips, to listen to')
    args = ap.parse_args()
    with open(os.path.join(args.words, 'index.json'), encoding='utf8') as f:
        index = json.load(f)
    os.makedirs(OUT_AUDIO, exist_ok=True)
    out = {}
    if os.path.exists(OUT_JSON):
        with open(OUT_JSON, encoding='utf8') as f:
            out = json.load(f)
    for song in SONGS:
        if args.only and song['id'] != args.only:
            continue
        out[song['id']] = render(song, args.words, index, args.wav)
    out = {s['id']: out[s['id']] for s in SONGS if s['id'] in out}
    with open(OUT_JSON, 'w', encoding='utf8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
