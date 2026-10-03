"""The sing-along songs, written out note by note.

Every melody here was checked against published sheet music, so Ara sings the real tune with the
real rhythm. All of these are public domain (or, for "Noah Built a Big Boat", new words to the
public-domain "Old MacDonald" tune).

Format
  lines:  (lyric, notes). Syllables are split by spaces and hyphens. Notes are "<pitch>:<beats>",
          "r:<beats>" for a rest, and "+<pitch>:<beats>" to carry the previous syllable onto
          another note (a slur). Lines follow each other with no gap, starting at `start` (beats).
  chords: "<chord>:<beats>" from beat 0, written in the song's own key (before `transpose`).
  tempo:  beats per minute, or a list of (beat, bpm) for slowing down (a fermata).
  swing:  where an off-beat eighth lands (0.5 = straight, 0.6 = gospel swing).
  say:    how to say a word to the voice when its spelling would mislead it (/IPA/ works). A list
          says each syllable on its own (for E-I-E-I-O).
"""

SAY = {
    'a': '/ə/',
    'the': '/ðə/',
    'close': '/kloʊs/',
    'baa': '/bɑː/',
    'e-i-e-i-o': ['/iː/', '/aɪ/', '/iː/', '/aɪ/', '/oʊ/'],
    "ev-'ry-where": 'everywhere',
    'gon-na': 'gonna',
}

JESUS_LOVES_ME = dict(
    id='jesus-loves-me', title='Jesus Loves Me', style='hymn', meter=4, tempo=92, transpose=0, start=8,
    lines=[
        ('Je-sus loves me! This I know,', 'G4:1 E4:1 E4:1 D4:1 E4:1 G4:1 G4:2'),
        ('For the Bi-ble tells me so.', 'A4:1 A4:1 C5:1 A4:1 A4:1 G4:1 G4:2'),
        ('Lit-tle ones to Him be-long;', 'G4:1 E4:1 E4:1 D4:1 E4:1 G4:1 G4:2'),
        ('They are weak, but He is strong.', 'A4:1 A4:1 G4:1 C4:1 E4:1 D4:1 C4:2'),
        ('Yes, Je-sus loves me!', 'G4:2 E4:1 G4:1 A4:2 C5:2'),
        ('Yes, Je-sus loves me!', 'G4:2 E4:1 C4:1 E4:2 D4:2'),
        ('Yes, Je-sus loves me!', 'G4:2 E4:1 G4:1 A4:2 C5:2'),
        ('The Bi-ble tells me so.', 'A4:2 G4:1 C4:1 E4:1 D4:1 C4:4'),
    ],
    chords='C:4 G7:4 '
           'C:4 C:4 F:4 C:4 C:4 C:4 F:2 C:2 G7:2 C:2 '
           'C:4 F:4 C:4 C:2 G7:2 C:4 F:4 F:2 C:2 G7:2 C:6',
)

_LIGHT_END = [
    ("I'm gon-na let it shine.", 'A4:1 A4:.5 A4:.5 A4:.5 G4:1 F4:1.5 r:1'),
    ('Let it shine, let it shine, let it shine!', 'F4:.5 G4:1 A4:2.5 Bb4:.5 A4:1 G4:2.5 A4:.5 G4:1 F4:6.5 r:2'),
]
_LIGHT_CHORDS = 'F:2 Gm7:2 F:4 F:2 Gm7:2 F:4 Bb:4 F:4 F:2 Gm7:2 F:2 C7:2 F:2 Gm7:2 F:4 A7:2 D7:2 Gm7:2 C7:2 F:4 Gm7:2 C7:2 F:4 F:4 '
THIS_LITTLE_LIGHT = dict(
    id='this-little-light', title='This Little Light of Mine', style='gospel', meter=4, tempo=108, swing=0.6,
    transpose=0, start=8,
    lines=[
        ('This lit-tle light of mine,', 'C4:1 C4:.5 C4:.5 C4:.5 D4:1 F4:4.5'),
        ("I'm gon-na let it shine.", 'A4:1 A4:.5 A4:.5 A4:.5 G4:1 F4:4.5'),
        ('This lit-tle light of mine,', 'D4:1 D4:.5 D4:.5 D4:.5 E4:1 F4:4.5'),
        ("I'm gon-na let it shine.", 'F4:1 F4:.5 D4:.5 F4:.5 D4:1 C4:4.5'),
        ('This lit-tle light of mine,', 'C4:1 C4:.5 C4:.5 C4:.5 D4:1 F4:4.5'),
        *_LIGHT_END,
        ("Ev-'ry-where I go,", 'C4:1 C4:.5 C4:1 D4:1 F4:4.5'),
        ("I'm gon-na let it shine.", 'A4:1 A4:.5 A4:.5 A4:.5 G4:1 F4:4.5'),
        ("Ev-'ry-where I go,", 'D4:1 D4:.5 D4:1 E4:1 F4:4.5'),
        ("I'm gon-na let it shine.", 'F4:1 F4:.5 D4:.5 F4:.5 D4:1 C4:4.5'),
        ("Ev-'ry-where I go,", 'C4:1 C4:.5 C4:1 D4:1 F4:4.5'),
        *_LIGHT_END,
    ],
    chords='F:4 C7:4 ' + _LIGHT_CHORDS + _LIGHT_CHORDS + 'F:4',
)

_MANGER_1 = 'C5:1 C5:1.5 Bb4:.5 A4:1 A4:1.5 G4:.5 F4:1 F4:1 E4:1 D4:1 C4:2'
_MANGER_2 = 'C4:1 C4:1.5 D4:.5 C4:1 C4:1 G4:1 E4:1 D4:1 C4:1 F4:1 A4:2'
_MANGER_4 = 'C4:1 Bb4:1.5 A4:.5 G4:1 A4:1 G4:1 F4:1 G4:1 D4:1 E4:1'
_MANGER_CHORDS = 'F:3 F:3 Bb:3 F:3 C7:3 C7:3 C7:2 F:1 F:3 F:3 F:3 Bb:3 F:3 Bb:3 F:3 C7:3 F:3 '
AWAY_IN_A_MANGER = dict(
    id='away-in-a-manger', title='Away in a Manger', style='waltz', meter=3, tempo=96, transpose=0, start=5,
    lines=[
        ('A-way in a man-ger, no crib for a bed,', _MANGER_1),
        ('The lit-tle Lord Je-sus laid down His sweet head.', _MANGER_2),
        ('The stars in the sky looked down where He lay,', 'C5:1 C5:1.5 Bb4:.5 A4:1 A4:1.5 +G4:.5 F4:1 F4:1 E4:1 D4:1 C4:2'),
        ('The lit-tle Lord Je-sus, a-sleep on the hay.', _MANGER_4 + ' F4:2 r:3'),
        ('Be near me, Lord Je-sus, I ask Thee to stay', _MANGER_1),
        ('Close by me for-ev-er, and love me, I pray.', _MANGER_2),
        ('Bless all the dear chil-dren in Thy ten-der care,', _MANGER_1),
        ('And fit us for heav-en to live with Thee there.', _MANGER_4 + ' F4:3'),
    ],
    chords='F:3 C7:3 ' + _MANGER_CHORDS + 'F:2 C7:1 ' + _MANGER_CHORDS + 'F:6',
)

_TWINKLE_A = 'C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2'
_TWINKLE_B = 'F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2'
_TWINKLE_C = 'G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2'
_TWINKLE_CHORDS = 'C:4 F:2 C:2 F:2 C:2 G:2 C:2 C:2 F:2 C:2 G:2 C:2 F:2 C:2 G:2 C:4 F:2 C:2 F:2 C:2 G:2 C:2 '
TWINKLE = dict(
    id='twinkle', title='Twinkle, Twinkle, Little Star', style='lullaby', meter=4, tempo=84, transpose=2, start=8,
    lines=[
        ('Twin-kle, twin-kle, lit-tle star,', _TWINKLE_A),
        ('How I won-der what you are!', _TWINKLE_B),
        ('Up a-bove the world so high,', _TWINKLE_C),
        ('Like a dia-mond in the sky.', _TWINKLE_C),
        ('Twin-kle, twin-kle, lit-tle star,', _TWINKLE_A),
        ('How I won-der what you are!', _TWINKLE_B + ' r:4'),
        ('When the blaz-ing sun is gone,', _TWINKLE_A),
        ('When he noth-ing shines up-on,', _TWINKLE_B),
        ('Then you show your lit-tle light,', _TWINKLE_C),
        ('Twin-kle, twin-kle, all the night.', _TWINKLE_C),
        ('Twin-kle, twin-kle, lit-tle star,', _TWINKLE_A),
        ('How I won-der what you are!', 'F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:4'),
    ],
    chords='C:4 G:4 ' + _TWINKLE_CHORDS + 'C:4 ' + _TWINKLE_CHORDS + 'C:4',
)

HAPPY_BIRTHDAY = dict(
    id='happy-birthday', title='Happy Birthday', style='party', meter=3,
    # The held name (a fermata): slow down for those two beats, then back to tempo. Nobody's name is
    # sung: the flute carries those two notes and the game says the birthday child's name ({name}).
    tempo=[(0, 104), (21, 78), (22, 46), (23, 104)], transpose=-2, start=5, name_notes=2,
    lines=[
        ('Hap-py birth-day to you,', 'D4:.75 D4:.25 E4:1 D4:1 G4:1 F#4:2'),
        ('Hap-py birth-day to you,', 'D4:.75 D4:.25 E4:1 D4:1 A4:1 G4:2'),
        ('Hap-py birth-day, dear {name},', 'D4:.75 D4:.25 D5:1 B4:1 G4:1 F#4:1 E4:1'),
        ('Hap-py birth-day to you!', 'C5:.75 C5:.25 B4:1 G4:1 A4:1 G4:3'),
    ],
    chords='G:3 D7:3 G:3 D7:3 D7:3 G:3 G7:3 C:3 G:2 D7:1 G:6',
)


def _noah_verse(animals, sound, last=False):
    o = 'G4:4' if last else 'G4:3 r:1'
    return [
        ('Old No-ah built a big boat,', 'G4:1 G4:1 G4:1 D4:1 E4:1 E4:1 D4:2'),
        ('E-I-E-I-O!', 'B4:1 B4:1 A4:1 A4:1 G4:3'),
        (f'And on that boat he had some {animals},', 'D4:1 G4:1 G4:1 G4:1 D4:1 E4:1 E4:1 D4:2'),
        ('E-I-E-I-O!', 'B4:1 B4:1 A4:1 A4:1 G4:3'),
        (f'With a {sound} {sound} here, and a {sound} {sound} there,', 'D4:.5 D4:.5 G4:1 G4:1 G4:1 D4:.5 D4:.5 G4:1 G4:1 G4:2'),
        (f'Here a {sound}, there a {sound}, ev-\'ry-where a {sound} {sound},',
         'G4:.5 G4:.5 G4:1 G4:.5 G4:.5 G4:1 G4:.5 G4:.5 G4:.5 G4:.5 G4:1 G4:1'),
        ('Old No-ah built a big boat,', 'G4:1 G4:1 G4:1 D4:1 E4:1 E4:1 D4:2'),
        ('E-I-E-I-O!', 'B4:1 B4:1 A4:1 A4:1 ' + o),
    ]


_NOAH_CHORDS = 'G:4 C:2 G:2 G:2 D7:2 G:4 G:4 C:2 G:2 G:2 D7:2 G:4 G:4 C:4 G:4 G:4 G:4 C:2 G:2 G:2 D7:2 G:4 '
NOAH = dict(
    id='noah-boat', title='Noah Built a Big Boat', style='bouncy', meter=4, tempo=120, transpose=0, start=8,
    lines=_noah_verse('sheep', 'baa') + _noah_verse('ducks', 'quack') + _noah_verse('cows', 'moo', last=True),
    chords='G:4 D7:4 ' + _NOAH_CHORDS * 3 + 'G:4',
)

SONGS = [JESUS_LOVES_ME, THIS_LITTLE_LIGHT, AWAY_IN_A_MANGER, TWINKLE, HAPPY_BIRTHDAY, NOAH]
