"""The sing-along songs, written out note by note.

Every melody here was checked against published sheet music, so Ara sings the real tune with the
real rhythm. All of these are public domain (or, for "Noah Built a Big Boat" and the island songs,
new words to public-domain tunes).

Format
  lines:  (lyric, notes). Syllables are split by spaces and hyphens. Notes are "<pitch>:<beats>",
          "r:<beats>" for a rest, and "+<pitch>:<beats>" to carry the previous syllable onto
          another note (a slur). Lines follow each other with no gap, starting at `start` (beats).
  chords: "<chord>:<beats>" from beat 0, written in the song's own key (before `transpose`).
  tempo:  beats per minute, or a list of (beat, bpm) for slowing down (a fermata).
  swing:  where an off-beat eighth lands (0.5 = straight, 0.6 = gospel swing).
  say:    how to say a word to the voice when its spelling would mislead it (/IPA/ works). A list
          says each syllable on its own (for E-I-E-I-O).

Tunes in 6/8 count the dotted quarter as the beat (meter 2, two beats a bar) with swing=2/3, which
moves each half-beat onto the beat's third eighth: a quarter and an eighth are written ":.5 :.5",
three even eighths ":.25 :.25 :.5", and a dotted quarter ":1".
"""

SAY = {
    'a': '/ə/',
    'the': '/ðə/',
    'close': '/kloʊs/',
    'baa': '/bɑː/',
    'e-i-e-i-o': ['/iː/', '/aɪ/', '/iː/', '/aɪ/', '/oʊ/'],
    "ev-'ry-where": 'everywhere',
    'gon-na': 'gonna',
    "ev-'ry": 'every',
    "ev-'ry-one": 'everyone',
    "fam-'ly": '/ˈfæmli/',  # two syllables, as it's sung ("family" alone is often said with three)
    "li-ons'": 'lions',
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

# ---- The island songs: new words to public-domain tunes, one for each island's song spot ----

# "The Farmer in the Dell" (6/8), checked against abcnotation.com (the Digital Tradition's "The Farmer
# in the Dell", K:G, and R. L. Walker's, K:D) and singing-bell.com's sheet music.
def _dell(a, b, c, d, last=False):
    return [
        (a, 'D4:.5 G4:.5 G4:.5 G4:.5 G4:.5 G4:1.5'),
        (b, 'A4:.5 B4:.5 B4:.5 B4:.5 B4:.5 B4:1.5 r:.5'),
        (c, 'D5:1 D5:.5 E5:.5 D5:.5 B4:.5 G4:.5'),  # "Heigh-ho, the der-ry-o"
        (d, 'A4:.5 B4:.5 B4:.5 A4:.5 A4:.5 ' + ('G4:2' if last else 'G4:1.5')),
    ]


_HOORAY = 'Hip, hip, hoo-ray! Hoo-ray!'
_GOOD = 'God saw that it was good!'
CREATION_SONG = dict(
    id='song-creation', title='God Made It All', style='bouncy', meter=2, tempo=100, swing=2 / 3,
    transpose=-2, start=7.5,
    lines=_dell('God made the light so bright,', 'God made the sky and sea,', _HOORAY, _GOOD)
    + _dell('God made the land and trees,', 'The sun, the moon, the stars!', _HOORAY, _GOOD)
    + _dell('God made the fish and birds,', 'The bun-nies and the bears!', _HOORAY, _GOOD)
    + _dell('And God made you and me!', 'And God loves you and me!', _HOORAY, "It's ver-y, ver-y good!",
            last=True),
    chords='G:4 D7:4 ' + 'G:12 D7:2 G:2 ' * 4 + 'G:2',
)

# "Twinkle, Twinkle, Little Star", the same tune as TWINKLE above (en.wikipedia.org's score), played
# on the piano instead of the music box, a little quicker and higher.
ABRAHAM_SONG = dict(
    id='song-abraham', title='Count the Stars', style='hymn', meter=4, tempo=100, transpose=3, start=8,
    lines=[
        ('A-bra-ham, look up at night!', _TWINKLE_A),
        ('Count the stars that twin-kle bright!', _TWINKLE_B),
        ('One, two, three, and on they go!', _TWINKLE_C),
        ("God will make your fam-'ly grow!", _TWINKLE_C),
        ('A-bra-ham, look up at night!', _TWINKLE_A),
        ('Count the stars that twin-kle bright!', _TWINKLE_B + ' r:4'),
        ('A-bra-ham and Sar-ah, too,', _TWINKLE_A),
        ('Wait-ed for a dream come true.', _TWINKLE_B),
        ('Then a ba-by came! Hoo-ray!', _TWINKLE_C),
        ('I-saac, born that hap-py day!', _TWINKLE_C),
        ("God keeps ev-'ry prom-ise true.", _TWINKLE_A),
        ('God loves me, and God loves you!', 'F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:4'),
    ],
    chords='C:4 G7:4 ' + _TWINKLE_CHORDS + 'C:4 ' + _TWINKLE_CHORDS + 'C:4',
)


# "Mary Had a Little Lamb" (the tune it's sung to today, also "Merrily We Roll Along"), checked
# against it.wikipedia.org's score and singing-bell.com's sheet music.
def _lamb(a, b, c, d, last=False):
    return [
        (a, 'E4:1 D4:1 C4:1 D4:1 E4:1 E4:1 E4:2'),
        (b, 'D4:1 D4:1 D4:2 E4:1 G4:1 G4:2'),
        (c, 'E4:1 D4:1 C4:1 D4:1 E4:1 E4:1 E4:1'),
        (d, 'E4:1 D4:1 D4:1 E4:1 D4:1 ' + ('C4:4' if last else 'C4:3 r:1')),
    ]


_LAMB_CHORDS = 'C:8 G7:4 C:12 G7:4 C:4 '
JOSEPH_SONG = dict(
    id='song-joseph', title="Joseph's Coat", style='party', meter=4, tempo=116, transpose=4, start=8,
    lines=_lamb('Jo-seph had a rain-bow coat,', 'Rain-bow coat, rain-bow coat.',
                'Jo-seph had a rain-bow coat;', 'His fa-ther loved him so!')
    + _lamb('Broth-ers had a jeal-ous frown,', 'Jeal-ous frown, jeal-ous frown.',
            'Sent him far, so far a-way,', 'But God stayed by his side!')
    + _lamb('Jo-seph gave a great big hug,', 'Great big hug, great big hug!',
            "He for-gave them, ev-'ry one,", 'And God turned bad to good!', last=True),
    chords='C:4 G7:4 ' + _LAMB_CHORDS * 3 + 'C:4',
)

# "Skip to My Lou" (2/4), checked against singing-bell.com's sheet music (and the Kodály Collection's
# tone set and motives for it).
_LOU_A = 'F#4:1 D4:1 F#4:.5 F#4:.25 F#4:.25 A4:1'  # "Skip, skip, skip to my Lou"
_LOU_B = 'E4:1 C#4:1 E4:.5 E4:.25 E4:.25 G4:1'


def _lou(a, b, c, d, last=False):
    return [
        (a, _LOU_A),
        (b, _LOU_B),
        (c, _LOU_A),
        (d, 'E4:.5 E4:.25 G4:.25 F#4:.5 E4:.5 D4:1 ' + ('D4:3' if last else 'D4:1')),  # "Skip to my Lou, my dar-lin'."
    ]


_PATH = 'Whoosh! Whoosh! God made a path!'
_STEP = 'Step, step, all the way through,'
_SEA_CHORUS = _lou(_PATH, _PATH, _PATH, 'Walk through the sea on dry land!')
RED_SEA_SONG = dict(
    id='song-red-sea', title='Through the Sea', style='gospel', meter=4, tempo=112, transpose=2, start=8,
    lines=_lou('Deep, deep, deep was the sea,', 'Deep, deep, deep was the sea,',
               'Deep, deep, deep was the sea.', 'What will the peo-ple do now?')
    + _SEA_CHORUS
    + _lou(_STEP, _STEP, _STEP, 'Hap-py and safe on dry land!')
    + _SEA_CHORUS
    + _lou('Dance, dance, Mir-i-am, dance!', 'Clap, clap, sing to the Lord!',
           'Dance, dance, Mir-i-am, dance!', 'Dance with the tam-bou-rine, dance!', last=True),
    chords='D:4 A7:4 ' + 'D:4 A7:4 D:4 A7:2 D:2 ' * 5 + 'D:4',
)


# "This Old Man", checked against abcnotation.com (Musica Viva's "This old man", K:C) and
# singing-bell.com's sheet music.
def _old_man(a, b, c, d, last=False):
    return [
        (a, 'G4:1 E4:1 G4:2 G4:1 E4:1 G4:2'),  # "This old man, he played one,"
        (b, 'A4:1 G4:1 F4:1 E4:1 D4:1 E4:1 F4:1'),  # "He played knick-knack on my thumb,"
        # "With a knick-knack, pad-dy-whack, give a dog a bone,"
        (c, 'E4:.5 F4:.5 G4:1 C4:1 C4:.5 C4:.5 C4:1 C4:.5 D4:.5 E4:.5 F4:.5 G4:2'),
        (d, 'G4:1 D4:1 D4:1 F4:1 E4:1 D4:1 ' + ('C4:4' if last else 'C4:2')),  # "This old man came roll-ing home."
    ]


_BIGGER = 'God is big-ger, God is strong!'
DAVID_SONG = dict(
    id='song-david', title="David's Song", style='bouncy', meter=4, tempo=116, transpose=2, start=8,
    lines=_old_man('Shep-herd boy with his sheep,', 'Da-vid played his harp for God,',
                   'With a strum, strum, strum a strum, hap-py songs he sang!', 'God loved Da-vid; he loved God!')
    + _old_man("Gi-ant's tall, Da-vid's small,", "God made Da-vid's heart so brave!",
               'And he said, "I trust in God! God is by my side!"', _BIGGER)
    + _old_man('Big or small, God loves all!', "God is with you ev-'ry day!",
               'Come and sing, sing, sing a song, sing to God with me!', _BIGGER, last=True),
    chords='C:4 G7:4 ' + 'C:8 F:4 G7:4 C:8 G7:4 C:1 G7:1 C:2 ' * 3 + 'C:4',
)


# "Frère Jacques" ("Are You Sleeping?"), checked against en.wikipedia.org's score and abcnotation.com
# (the Digital Tradition's "Frere Jacques", K:C). The chords are the score's: I, V7, I in every bar.
def _jacques(a, b, c, d, last=False):
    return [
        (a, 'C4:1 D4:1 E4:1 C4:1 C4:1 D4:1 E4:1 C4:1'),
        (b, 'E4:1 F4:1 G4:2 E4:1 F4:1 G4:2'),
        (c, 'G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1 G4:.5 A4:.5 G4:.5 F4:.5 E4:1 C4:1'),
        (d, 'C4:1 G3:1 C4:2 C4:1 G3:1 ' + ('C4:4' if last else 'C4:2')),  # "Ding, dang, dong."
    ]


DANIEL_SONG = dict(
    id='song-daniel', title='Daniel Prayed', style='lullaby', meter=4, tempo=100, transpose=3, start=8,
    lines=_jacques("Dan-iel's pray-ing, Dan-iel's pray-ing,", "Ev-'ry day, ev-'ry day,",
                   'Kneel-ing by the win-dow, kneel-ing by the win-dow:', '"Thank you, God! Thank you, God!"')
    + _jacques('Where is Dan-iel? Where is Dan-iel?', "Li-ons' den! Li-ons' den!",
               'God sent down His an-gel, God sent down His an-gel.', 'Mouths shut tight! Mouths shut tight!')
    + _jacques("Dan-iel's safe now, Dan-iel's safe now,", 'Not a scratch, not a scratch!',
               'God took care of Dan-iel, God took care of Dan-iel.', 'God loves you! God loves you!', last=True),
    chords='C:4 G7:4 ' + 'C:1 G7:1 C:2 ' * 24 + 'C:4',
)


# "Row, Row, Row Your Boat" (6/8), checked against en.wikipedia.org's score and singing-bell.com's
# sheet music.
def _row(a, b, c, d, last=False):
    return [
        (a, 'C4:1 C4:1 C4:.5 D4:.5 E4:1'),  # "Row, row, row your boat,"
        (b, 'E4:.5 D4:.5 E4:.5 F4:.5 G4:2'),  # "Gent-ly down the stream."
        (c, 'C5:.25 C5:.25 C5:.5 G4:.25 G4:.25 G4:.5 E4:.25 E4:.25 E4:.5 C4:.25 C4:.25 C4:.5'),  # "Mer-ri-ly" x4
        (d, 'G4:.5 F4:.5 E4:.5 D4:.5 ' + ('C4:3' if last else 'C4:2')),  # "Life is but a dream."
    ]


JONAH_SONG = dict(
    id='song-jonah', title='Jonah and the Big Fish', style='hymn', meter=2, tempo=72, swing=2 / 3,
    transpose=0, start=4,
    lines=_row('Jo-nah ran from God,', 'Sail-ing far, so far.',
               'Up and down, up and down, up and down, up and down,', 'What a storm-y sea!')
    + _row('Gulp! Gulp! Great big fish', 'Swal-lowed Jo-nah up.',
           'Jo-nah prayed, "Thank you, God! Thank you, God! Thank you, God!"', 'God kept Jo-nah safe.')
    + _row('God said, "Try a-gain!"', 'Jo-nah said, "I\'ll go!"',
           'God loves you, God loves me, God loves you, God loves me,', "God loves ev-'ry-one!", last=True),
    chords='C:2 G7:2 ' + 'C:12 G7:2 C:2 ' * 3 + 'C:2',
)


# "Here We Go Round the Mulberry Bush" (6/8), checked against en.wikipedia.org's score. Bar 7 ("so
# ear-ly in the") is the version in Moffat's "Our Old Nursery Rhymes" (1911, Project Gutenberg),
# "The Everyday Song Book" (1927) and P. Hardy's tunebook: up D-E-F#, the first syllable over D-E.
def _mulberry(a, b, c, d, last=False):
    return [
        (a, 'G4:.25 G4:.25 G4:.5 G4:.5 B4:.5 D5:.5 B4:.5 G4:.5'),  # "Here we go round the mul-b'ry bush,"
        (b, 'G4:.5 A4:.5 A4:.5 A4:.5 G4:.5 F#4:.5 E4:.5 D4:1'),  # "the mul-b'ry bush, the mul-b'ry bush."
        (c, 'G4:.25 G4:.25 G4:.5 G4:.5 B4:.5 D5:.5 B4:.5 G4:.5'),
        # "so ear-ly in the morn-ing."
        (d, 'G4:.5 A4:.5 A4:.5 D4:.25 +E4:.25 F#4:.5 ' + ('G4:1 G4:2' if last else 'G4:1 G4:.5 r:.5')),
    ]


LOAVES_SONG = dict(
    id='song-loaves', title='Five Little Loaves', style='party', meter=2, tempo=100, swing=2 / 3,
    transpose=-2, start=8,
    lines=_mulberry('One lit-tle boy had five small loaves', 'And two small fish, and two small fish.',
                    'One lit-tle boy had five small loaves;', 'He shared them all with Je-sus!')
    + _mulberry('Je-sus gave thanks and passed it out', "To ev-'ry-one, to ev-'ry-one.",
                'Je-sus gave thanks and passed it out,', 'And all the tum-mies filled up!')
    + _mulberry('Then there were twelve big bas-kets full', 'Of bread and fish, of bread and fish!',
                'Then there were twelve big bas-kets full,', 'With lots and lots left o-ver!')
    + _mulberry('This is the way we share our food,', 'We share our food, we share our food.',
                'This is the way we share our food,', 'For Je-sus cares a-bout us!', last=True),
    chords='G:4 D7:4 ' + 'G:4 D:2 D7:2 G:4 D7:2 G:2 ' * 4 + 'G:2',
)

ISLAND_SONGS = [CREATION_SONG, ABRAHAM_SONG, JOSEPH_SONG, RED_SEA_SONG, DAVID_SONG, DANIEL_SONG, JONAH_SONG, LOAVES_SONG]

SONGS = [JESUS_LOVES_ME, THIS_LITTLE_LIGHT, AWAY_IN_A_MANGER, TWINKLE, HAPPY_BIRTHDAY, NOAH] + ISLAND_SONGS
