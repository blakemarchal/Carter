"""The beat of a song, for the Pal's dancing: when each beat falls, in seconds (librosa).
  python beats.py <song.mp3>   -> JSON {"bpm": 104.2, "beats": [0.52, 1.1, ...], "duration": 83.4}
"""
import json
import sys

import librosa
import numpy as np

y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
tempo, frames = librosa.beat.beat_track(y=y, sr=sr, units='frames')
beats = librosa.frames_to_time(frames, sr=sr)
bpm = float(np.atleast_1d(tempo)[0])
# (a steady grid from the found beats, so the dance doesn't stumble where the tracker missed one)
if len(beats) >= 4:
    period = float(np.median(np.diff(beats)))
    first = float(beats[0])
    n = int((len(y) / sr - first) / period) + 1
    beats = [round(first + i * period, 3) for i in range(n)]
else:
    beats = [round(float(b), 3) for b in beats]
print(json.dumps({'bpm': round(bpm, 1), 'beats': beats, 'duration': round(len(y) / sr, 2)}))
