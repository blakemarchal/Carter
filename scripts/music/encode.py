"""Re-encodes a song or loop as a small stereo mp3 at a steady loudness, so everything plays at one level.
  python encode.py <in.mp3|wav> <out.mp3> [--kbps 96] [--loudnorm] [--fade-out SECONDS]
--loudnorm brings it to -16 LUFS (pyloudnorm, EBU R128) with a true-peak ceiling of -1.5 dB.
"""
import argparse

import lameenc
import librosa
import numpy as np
import pyloudnorm as pyln
import soundfile as sf

SR = 44100
ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('out')
ap.add_argument('--kbps', type=int, default=96)
ap.add_argument('--loudnorm', action='store_true')
ap.add_argument('--fade-out', type=float, default=0)
a = ap.parse_args()

data, sr = sf.read(a.src, dtype='float32', always_2d=True)
if sr != SR:
    data = np.stack([librosa.resample(data[:, c], orig_sr=sr, target_sr=SR) for c in range(data.shape[1])], axis=1)
if data.shape[1] == 1:
    data = np.repeat(data, 2, axis=1)
data = data[:, :2]
if a.loudnorm:
    meter = pyln.Meter(SR)
    loud = meter.integrated_loudness(data)
    if np.isfinite(loud):
        data = pyln.normalize.loudness(data, loud, -16.0)
    peak = np.abs(data).max()
    ceiling = 10 ** (-1.5 / 20)
    if peak > ceiling:
        data = data * (ceiling / peak)
if a.fade_out > 0:
    n = min(len(data), int(a.fade_out * SR))
    data[-n:] *= np.linspace(1, 0, n)[:, None]
enc = lameenc.Encoder()
enc.set_bit_rate(a.kbps)
enc.set_in_sample_rate(SR)
enc.set_channels(2)
enc.set_quality(2)
pcm = (np.clip(data, -1, 1) * 32767).astype('<i2')
mp3 = enc.encode(pcm.tobytes()) + enc.flush()
with open(a.out, 'wb') as f:
    f.write(mp3)
print(f'{a.out}: {len(data) / SR:.1f}s, {len(mp3) / 1e6:.2f} MB')
