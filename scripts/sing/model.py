"""Turns the written-out songs in scores.py into timed notes, syllables and words."""
import math
import re

from scores import SAY

_SEMI = dict(C=0, D=2, E=4, F=5, G=7, A=9, B=11)
_PUNCT = '.,;:!?"'
_KEEP_CASE = {'I', 'Jesus', 'Bible', 'Lord', 'Noah'}
# Where the birthday child's name goes: not sung (the game says it), but it still has its notes.
NAME = '{name}'


def midi(name):
    """'Bb4' -> 70."""
    m = re.fullmatch(r'([A-G])([#b]?)(-?\d)', name)
    if not m:
        raise ValueError(f'bad note {name!r}')
    return 12 * (int(m[3]) + 1) + _SEMI[m[1]] + {'#': 1, 'b': -1, '': 0}[m[2]]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def chord_notes(symbol, transpose=0):
    """'Gm7' -> (root pitch class, [intervals])."""
    m = re.fullmatch(r'([A-G])([#b]?)(maj7|m7|m|7|dim)?', symbol)
    if not m:
        raise ValueError(f'bad chord {symbol!r}')
    root = (_SEMI[m[1]] + {'#': 1, 'b': -1, '': 0}[m[2]] + transpose) % 12
    shape = {None: [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11], 'dim': [0, 3, 6]}[m[3]]
    return root, shape


class Clock:
    """Beats -> seconds, with swing and tempo changes."""

    def __init__(self, tempo, swing=0.5):
        self.marks = [(0.0, float(tempo))] if isinstance(tempo, (int, float)) else [(float(b), float(t)) for b, t in tempo]
        self.swing = swing

    def _swung(self, b):
        n = math.floor(b)
        f = b - n
        s = self.swing
        return n + (f * 2 * s if f <= 0.5 else s + (f - 0.5) * 2 * (1 - s))

    def time(self, beat):
        b = self._swung(beat)
        t = 0.0
        for i, (start, bpm) in enumerate(self.marks):
            end = self.marks[i + 1][0] if i + 1 < len(self.marks) else math.inf
            if b <= start:
                break
            t += (min(b, end) - start) * 60.0 / bpm
        return t

    def bpm_at(self, beat):
        bpm = self.marks[0][1]
        for start, t in self.marks:
            if beat >= start:
                bpm = t
        return bpm


def _split_word(raw):
    core = raw.strip(_PUNCT)
    return core, core.split('-')


def tts_items(core):
    """What to ask the voice for, for one written word: [(text, syllable count)]."""
    key = core.lower()
    say = SAY.get(key)
    sylls = core.split('-')
    if isinstance(say, list):
        return [(s, 1) for s in say]
    text = say or core.replace('-', '')
    if not text.startswith('/') and text.split("'")[0] not in _KEEP_CASE:
        text = text.lower()
    return [(text, len(sylls))]


def build(song):
    """Returns (syllables, lines, chords, clock, end_beat).

    syllable: dict(text, word, notes=[(midi, start_beat, beats)], line, tts=(text, n syllables, index), slot)
              (slot: the name, which isn't sung)
    line:     dict(text, words=[dict(text, syllables=[indexes])])
    chords:   [(symbol, start_beat, beats)]
    """
    tr = song.get('transpose', 0)
    clock = Clock(song['tempo'], song.get('swing', 0.5))
    beat = float(song['start'])
    sylls, lines = [], []
    for li, (lyric, notes) in enumerate(song['lines']):
        line_sylls = []
        words = []
        for raw in lyric.split():
            core, parts = _split_word(raw)
            slot = core == NAME
            if slot:
                parts = [NAME] * song.get('name_notes', 2)
            items = [(NAME, len(parts))] if slot else tts_items(core)
            word = dict(text=raw.replace('-', ''), syllables=[])
            k = 0
            for text, n in items:
                for j in range(n):
                    word['syllables'].append(len(sylls) + len(line_sylls))
                    line_sylls.append(dict(text=parts[k], word=len(words), line=li, notes=[], tts=(text, n, j), slot=slot))
                    k += 1
            words.append(word)
        si = -1
        for tok in notes.split():
            pitch, beats = tok.split(':')
            beats = float(beats)
            if pitch == 'r':
                beat += beats
                continue
            if pitch.startswith('+'):
                line_sylls[si]['notes'].append((midi(pitch[1:]) + tr, beat, beats))
            else:
                si += 1
                if si >= len(line_sylls):
                    raise ValueError(f'{song["id"]} line {li + 1}: more notes than syllables')
                line_sylls[si]['notes'].append((midi(pitch) + tr, beat, beats))
            beat += beats
        if si != len(line_sylls) - 1:
            raise ValueError(f'{song["id"]} line {li + 1}: {len(line_sylls)} syllables but {si + 1} notes')
        sylls.extend(line_sylls)
        lines.append(dict(text=lyric.replace('-', ''), words=words))
    chords, b = [], 0.0
    for tok in song['chords'].split():
        sym, beats = tok.split(':')
        chord_notes(sym)  # validates
        chords.append((sym, b, float(beats)))
        b += float(beats)
    if b < beat - 1e-6:
        raise ValueError(f'{song["id"]}: chords end at beat {b}, but the singing runs to {beat}')
    return sylls, lines, chords, clock, max(b, beat)
