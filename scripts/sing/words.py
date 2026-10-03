"""Prints every word the voice needs to say for the songs, as JSON (for fetch-words.mjs)."""
import json

from model import build
from scores import SONGS

if __name__ == '__main__':
    items = []
    for song in SONGS:
        sylls = build(song)[0]
        for s in sylls:
            if not s['slot'] and s['tts'][0] not in items:  # (the name isn't sung)
                items.append(s['tts'][0])
    print(json.dumps(items))
