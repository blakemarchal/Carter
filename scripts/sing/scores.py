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
    'des-ert': '/ˈdɛzərt/',  # the dry land, not "to desert"
    'sam-uel': '/ˈsæmjəl/',  # two syllables, as it's sung
    'bo-az': '/ˈboʊæz/',
    'ha-man': '/ˈheɪmən/',
    'mor-de-cai': '/ˈmɔːrdəkaɪ/',
    "ev-'ry-bod-y": 'everybody',
    'lamb-y': '/ˈlæmi/',
    'zac-chae-us': '/zæˈkiːəs/',
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


# "Hush, Little Baby" (a traditional American lullaby), checked against singing-bell.com's sheet music
# and MIDI (the sung tune, with the words under the notes) and flutetunes.com's score. Every couplet is
# sung the way the first one is ("Hush, little baby, don't say a word, / Mama's gonna buy you a mockingbird").
def _hush(a, b, last=False):
    return [
        (a, 'G3:1 E4:.5 E4:.5 E4:1 E4:.5 F4:.5 E4:1 D4:1 D4:2'),  # "Hush, lit-tle ba-by, don't say a word,"
        # "Ma-ma's gon-na buy you a mock-ing-bird."
        (b, 'G3:.5 D4:.5 D4:.5 D4:.5 D4:1 D4:.5 E4:.5 D4:1 C4:1 ' + ('C4:4' if last else 'C4:2')),
    ]


BABY_MOSES_SONG = dict(
    id='song-baby-moses', title='Baby in a Basket', style='lullaby', meter=4,
    tempo=[(0, 100), (96, 92), (98, 84)],  # a little slower for the last "cozy bed"
    transpose=5, start=4,
    lines=_hush('Hush, lit-tle ba-by, lay down your head,', "Ma-ma's gon-na make you a bas-ket bed.")
    + _hush('Down by the riv-er, the reeds grow tall,', 'Ba-by in a bas-ket, so snug and small.')
    + _hush('Big sis-ter Mir-i-am watch-es you,', 'Watch-ing o-ver ba-by, like sis-ters do.')
    + _hush('Look in the bas-ket! A ba-by boy!', 'Prin-cess loves the ba-by. Oh, what a joy!')
    + _hush('Who kept him safe? Can you tell me who?', 'God kept ba-by Mo-ses, and God loves you!')
    + _hush('Hush, lit-tle one, now lay down your head;', 'God takes care of you in your co-zy bed.', last=True),
    chords='C:2 G7:2 ' + 'C:4 G7:8 C:4 ' * 6 + 'C:2',
)


# "She'll Be Coming 'Round the Mountain" (traditional American), as R. L. Walker's ABC on abcnotation.com
# (K:D, with the words under the notes). The printed versions differ in a few notes; at each of those,
# Walker's agrees with flutetunes.com's score or makingmusicfun.net's sheet music, or both. Written in
# eighths, as singing-bell.com's sheet music writes it.
def _mountain(a, b, c, d, e, last=False):
    return [
        (a, 'D4:.5 E4:.5 G4:.5 G4:.5 G4:.5 G4:.5 E4:.5 D4:.5 B3:.5 D4:.5 G4:3'),  # "She'll be com-ing 'round the moun-tain when she comes,"
        (b, 'G4:.5 A4:.5 B4:.5 B4:.5 B4:.5 B4:.5 D5:.5 B4:.5 A4:.5 G4:.5 A4:3'),
        (c, 'D5:.5 C5:.5 B4:.5 B4:.5 B4:.5 B4:.5 A4:.5 G4:.5'),  # "She'll be com-ing 'round the moun-tain,"
        (d, 'G4:.5 G4:.5 E4:.5 E4:.5 E4:.5 E4:.5 A4:.5 G4:.5'),
        (e, 'F#4:.5 E4:.5 D4:.5 D4:.5 D4:.5 D4:.5 B4:.5 A4:.5 E4:.5 F#4:.5 ' + ('G4:4' if last else 'G4:3')),
    ]


_FIRE = "There's a bush up on the moun-tain, all on fire!"
_CALL = 'God is call-ing, "Mo-ses! Mo-ses!" from the bush!'
_GO = 'God says, "Go now, Mo-ses! I will be with you!"'
BURNING_BUSH_SONG = dict(
    id='song-burning-bush', title='Moses and the Bush', style='bouncy', meter=4, tempo=100, transpose=0, start=7,
    lines=_mountain(_FIRE, _FIRE, 'And the shep-herd Mo-ses sees it,', 'But it nev-er, nev-er burns up!', _FIRE)
    + _mountain(_CALL, _CALL, '"Take your san-dals off," God tells him.', '"This is ho-ly ground," God tells him.', _CALL)
    + _mountain(_GO, _GO, "So he goes to help God's peo-ple,", "Yes, he goes to help God's peo-ple,",
                'And our God will al-ways be with you and me!', last=True),
    chords='G:4 D7:4 ' + 'G:12 D7:4 G:2 G7:2 C:2 Am:1 D7:1 G:2 D7:2 G:4 ' * 3,
)


# "The Muffin Man" (traditional English), checked against flutetunes.com's score and abcnotation.com
# (Lester Bailey's "Muffin Man" and Paul Hardy's "The Muffin Man", both K:G). The "the" before the second
# "muffin man" is on F#, as in Bailey's, Hardy's and singing-bell.com's sheet music (FluteTunes has G).
def _muffin(a, b, c, d, last=False):
    return [
        (a, 'D4:.5 G4:.5 G4:.75 A4:.25 B4:.5 G4:.5 G4:.75'),  # "Do you know the muf-fin man,"
        (b, 'F#4:.25 E4:.5 A4:.5 A4:.75 G4:.25 F#4:.5 D4:.5 D4:1'),  # "the muf-fin man, the muf-fin man?"
        (c, 'D4:.5 G4:.5 G4:.75 A4:.25 B4:.5 G4:.5 G4:.5'),  # "Do you know the muf-fin man"
        (d, 'G4:.5 E4:.5 A4:.5 G4:.5 F#4:.5 ' + ('G4:4' if last else 'G4:1.5 r:.5')),  # "who lives on Dru-ry Lane?"
    ]


MANNA_SONG = dict(
    id='song-manna', title='Bread from Heaven', style='gospel', meter=2, tempo=96, transpose=0, start=4,
    lines=_muffin('In the des-ert, hot and dry,', 'The tum-mies growled, the tum-mies growled!',
                  'In the des-ert, hot and dry,', "God's peo-ple need-ed food.")
    + _muffin('God sent bread from heav-en high,', 'From heav-en high, from heav-en high,',
              'God sent bread from heav-en high,', 'Each morn-ing, fresh and new!')
    + _muffin('White and sweet like hon-ey, yum!', 'Like hon-ey, yum! Like hon-ey, yum!',
              'White and sweet like hon-ey, yum!', 'They called it man-na bread.')
    + _muffin("Just e-nough for ev-'ry day,", "For ev-'ry day, for ev-'ry day,",
              "Just e-nough for ev-'ry day:", 'God gives us what we need!')
    + _muffin('Thank you, God, for food to eat,', 'For food to eat, for food to eat!',
              'Thank you, God, for food to eat!', 'You give us what we need!', last=True),
    chords='G:2 D7:2 ' + 'G:4 Am:2 D7:2 G:4 Am:1 D7:1 G:2 ' * 5 + 'G:2',
)


# "When Johnny Comes Marching Home" (Patrick Gilmore, 1863; the tune of "The Ants Go Marching"), as Paul
# Hardy's Session Tunebook (pghardy.net, K:C, A minor) and Erich Rickheit's ABC from the Digital Tradition
# on abcnotation.com, which agree note for note. 6/8: the dotted quarter is the beat.
def _johnny(a, b, c, d, last=False):
    return [
        # "When John-ny comes march-ing home a-gain, hur-rah! hur-rah! We'll"
        (a, 'E4:.5 E4:.25 A4:.25 A4:.5 A4:.5 B4:.5 C5:.5 B4:.5 C5:.5 A4:.5 G4:1.5 E4:.5 G4:1.5 A4:.5'),
        # "give him a heart-y wel-come then, hur-rah! hur-rah! The"
        (b, 'E4:.25 A4:.25 A4:.5 A4:.5 B4:.5 C5:.5 B4:.5 C5:.5 D5:.5 E5:1.5 C5:.5 E5:1.5 C5:.5'),
        # "men will cheer and the boys will shout, the la-dies they will all turn out, and we'll all"
        (c, 'E5:.5 E5:.5 E5:.25 D5:.25 C5:.5 D5:.5 D5:.5 D5:.5 B4:.5 C5:.5 C5:.5 C5:.25 B4:.25 A4:.5 '
            'B4:.5 B4:.5 B4:.25 C5:.25 D5:.5'),
        # "feel gay when John-ny comes march-ing home."
        (d, 'E5:1 D5:1 C5:1 B4:.5 E4:.5 E4:.25 A4:.25 A4:.5 A4:.5 G4:.5 ' + ('A4:3' if last else 'A4:1.5')),
    ]


JERICHO_SONG = dict(
    id='song-jericho', title='Round and Round Jericho', style='party', meter=2, tempo=96, swing=2 / 3,
    transpose=-2, start=3.5,  # (the first "God's" is a pickup: the last eighth before the first bar)
    lines=_johnny("God's peo-ple went march-ing 'round the town, toot, toot! Toot, toot! Just",
                  'one time a day for six whole days, toot, toot! Toot, toot! The',
                  'priests would blow and the peo-ple walked, the gold-en box went a-round and round, and they',
                  'kept so qui-et, not a sin-gle peep or sound!')
    + _johnny('Then day num-ber sev-en came a-round, toot, toot! Toot, toot! They',
              'marched a-round sev-en times that day, toot, toot! Toot, toot! The',
              'trum-pets blew and the peo-ple shout-ed, and the big walls came tum-bling down, yes, they',
              'all came tum-bling, tum-bling, tum-bling, down, down, down!')
    + _johnny("And Ra-hab's fam-'ly was safe and sound, hur-rah! Hur-rah! For",
              'God al-ways keeps His prom-is-es, hur-rah! Hur-rah! So',
              'march with me, and we\'ll toot our horns and sing to God a-bove! God is so good! He',
              'loves us all the way up to the sky, hur-rah!', last=True),
    chords='Am:2 E7:2 ' + 'Am:4 C:4 Am:4 C:2 E:2 Am:2 G:2 Am:2 Em:2 Am:1 G:1 F:1 E:1 Am:4 ' * 3 + 'Am:2',
)


# "Did You Ever See a Lassie?" (the tune of "The More We Get Together"), as "The Everyday Song Book" (1927,
# John Chambers' transcription on abcnotation.com, K:G) and R. L. Walker's ABC (K:D), which agree note for
# note. 3/4, with a two-eighth pickup.
def _lassie(a, b, c, d, last=False):
    return [
        (a, 'G4:.5 B4:.5 D5:1.5 E5:.5 D5:.5 C5:.5 B4:1 G4:1 G4:1 A4:1 D4:1 D4:1 B4:1 G4:1'),  # "Did you ev-er see a las-sie, a las-sie, a las-sie?"
        (b, 'G4:.5 B4:.5 D5:1.5 E5:.5 D5:.5 C5:.5 B4:1 G4:1 G4:1 A4:1 D4:1 D4:1 G4:1 r:1'),  # "Did you ev-er see a las-sie do this way and that?"
        (c, 'G4:1 A4:1 D4:1 D4:1 B4:1 G4:1 G4:1 A4:1 D4:1 D4:1 B4:1 G4:1'),  # "Do this way and that way, and this way and that way;"
        (d, 'G4:.5 B4:.5 D5:1.5 E5:.5 D5:.5 C5:.5 B4:1 G4:1 G4:1 A4:1 D4:1 D4:1 ' + ('G4:3' if last else 'G4:2')),
    ]


RUTH_SONG = dict(
    id='song-ruth', title='Where You Go, I Will Go', style='waltz', meter=3, tempo=104, transpose=-2,
    start=5,  # (the pickup "Ruth said" is the last beat before the first bar)
    lines=_lassie("Ruth said, \"I'll go where you go, dear Na-o-mi, Na-o-mi,",
                  'and your peo-ple will be mine, and your God will be mine!"',
                  'And they walked to-geth-er, to-geth-er, to-geth-er,',
                  "all the way to Beth-le-hem, Na-o-mi's own home town.")
    + _lassie('In the fields of gold-en bar-ley, the bar-ley, the bar-ley,',
              'Ruth would gath-er up the grain that the help-ers had dropped.',
              'And kind Bo-az told them, "Leave some ex-tra for her!"',
              'Then she car-ried home a bas-ket full for Na-o-mi.')
    + _lassie('Ruth and Bo-az had a ba-by, a ba-by, a ba-by,',
              'and his name was lit-tle O-bed, and Na-o-mi smiled.',
              'And O-bed grew up to be grand-pa of Da-vid,',
              'the brave boy who fought Go-li-ath with one lit-tle stone!')
    + _lassie('God took care of Ruth and Na-o-mi, God took such good care,',
              'and He takes good care of you and of me, ev-\'ry day!',
              "So where you go, I'll go, and where you stay, I'll stay,",
              'and your peo-ple are my peo-ple, your God is my God!', last=True),
    chords='G:3 D7:3 ' + 'G:6 D7:3 G:9 D7:3 G:3 D7:3 G:3 D7:3 G:9 D7:3 G:3 ' * 4 + 'G:3',
)


# "All Through the Night" ("Ar Hyd y Nos", a Welsh air first printed in 1784), as the BBC's "Singing
# Together" (1969, the North Atlantic Tune List's ABC on abcnotation.com, K:G) and Erich Rickheit's ABC (K:F):
# every pitch agrees. Where they differ in rhythm (two bars: dotted or even quarters), this is the BBC's.
_NIGHT_A = 'G4:1.5 F#4:.5 E4:1 G4:1 A4:1.5 G4:.5 F#4:1 D4:1 E4:2 F#4:1.5 F#4:.5 '


def _night(a, b, c, d, last=False):
    return [
        (a, _NIGHT_A + 'G4:3 r:1'),  # "Sleep, my child, and peace at-tend thee, all through the night;"
        (b, _NIGHT_A + 'G4:3 r:1'),
        (c, 'C5:1 B4:1 C5:1 D5:1 E5:1.5 D5:.5 C5:1 B4:1 C5:1 B4:1 A4:1 G4:1 B4:1.5 A4:.5 G4:1 F#4:1'),
        (d, _NIGHT_A + ('G4:4' if last else 'G4:3 r:1')),
    ]


SAMUEL_SONG = dict(
    id='song-samuel', title='Speak, Lord, I Am Listening', style='lullaby', meter=4, tempo=80, transpose=-2,
    start=4,
    lines=_night("Sam-uel slept in God's house soft-ly, in the still night,",
                 'by the lamp so warm and glow-ing, in the still night.',
                 'Then he heard a voice say, "Sam-uel!" Up he jumped and ran to E-li:',
                 '"Here I am! You called me, E-li!" in the still night.')
    + _night('E-li said, "I did not call you. Back to your bed."',
             'Three times Sam-uel heard God call-ing in the still night.',
             'E-li said, "It\'s God who\'s call-ing! When He calls you, an-swer Him, child:',
             'Say, \'Speak, Lord, I\'m lis-ten-ing now,\'" all through the night.')
    + _night('God called, "Sam-uel! Sam-uel!" soft-ly, in the still night.',
             'Sam-uel said, "Speak, Lord, I hear You," in the still night.',
             'Sam-uel grew up lis-ten-ing to God, and God was with him al-ways.',
             "God speaks to us, so let's lis-ten, all day and night!", last=True),
    chords='G:2 D7:2 ' + ('G:4 D7:4 C:2 D7:2 G:4 ' * 2 + 'C:4 C:2 G:2 Am:2 D7:2 G:2 D7:2 ' + 'G:4 D7:4 C:2 D7:2 G:4 ') * 3,
)


# "Michael, Row the Boat Ashore" (a spiritual, printed in "Slave Songs of the United States", 1867), as Musica
# Viva's ABC (K:G, on abcnotation.com). Erich Rickheit's ABC (K:D) has every pitch the same; it dots two other
# notes, and this follows Musica Viva's rhythm.
def _michael(a, b, last=False):
    return [
        # "Mi-chael, row the boat a-shore, Hal-le-lu-jah!"
        (a, 'G4:1 B4:1 D5:1.5 B4:.5 D5:1 E5:1 D5:2 B4:1 D5:1 E5:4 D5:1 r:1'),
        (b, 'B4:1 D5:1 D5:1.5 B4:.5 C5:1 B4:1 A4:2 G4:1 A4:1 B4:2 +A4:2 ' + ('G4:4' if last else 'G4:1 r:1')),
    ]


ELIJAH_SONG = dict(
    id='song-elijah', title='Fire from Heaven', style='gospel', meter=4, tempo=92, transpose=-5,
    start=2,  # (each verse starts with a two-beat pickup: "God sent")
    lines=_michael('God sent rav-ens with some bread, Hal-le-lu-jah!', 'E-li-jah had food to eat, Hal-le-lu-jah!')
    + _michael('Then a wid-ow shared her bread, Hal-le-lu-jah!', 'God made her flour last and last, Hal-le-lu-jah!')
    + _michael('E-li-jah prayed on the hill, Hal-le-lu-jah!', 'Down came fire from heav-en high, Hal-le-lu-jah!')
    + _michael('Then the rain came pour-ing down, Hal-le-lu-jah!', 'Our God an-swers when we pray, Hal-le-lu-jah!', last=True),
    chords='G:2 D7:2 ' + 'G:8 C:4 G:8 D7:8 G:4 ' * 4,
)


# "London Bridge" (a traditional English singing game), as "The Everyday Song Book" (1927, John Chambers'
# transcription on abcnotation.com, K:F): the tune is its top line.
def _bridge(a, b, last=False):
    return [
        (a, 'C5:1.5 D5:.5 C5:1 A#4:1 A4:1 A#4:1 C5:2 G4:1 A4:1 A#4:2 A4:1 A#4:1 C5:2'),  # "Lon-don Bridge is fall-ing down, fall-ing down, fall-ing down,"
        (b, 'C5:1.5 D5:.5 C5:1 A#4:1 A4:1 A#4:1 C5:2 G4:2 C5:2 A4:1 ' + ('F4:3' if last else 'F4:2 r:1')),  # "Lon-don Bridge is fall-ing down, My fair La-dy."
    ]


ESTHER_SONG = dict(
    id='song-esther', title='Brave Queen Esther', style='bouncy', meter=4, tempo=108, transpose=-2, start=4,
    lines=_bridge('Es-ther was a lov-ing queen, lov-ing queen, lov-ing queen;', 'Es-ther was a lov-ing queen. God was with her.')
    + _bridge('Proud old Ha-man made a plan, made a plan, made a plan;', 'Proud old Ha-man made a plan, such a mean one!')
    + _bridge('"Es-ther, will you help us now, help us now, help us now?"', 'Mor-de-cai said, "Help us now! Be so brave, Queen!"')
    + _bridge('Es-ther prayed and was so brave, was so brave, was so brave;', 'Es-ther prayed and was so brave. God was with her!')
    + _bridge("God's own peo-ple all were saved, all were saved, all were saved;", "God's own peo-ple all were saved! Let's all praise Him!", last=True),
    chords='F:2 C7:2 ' + 'F:8 C7:4 F:12 C7:4 F:4 ' * 5,
)


# "Oh! Dear, What Can the Matter Be?" (English, 18th century; "Johnny's so long at the fair"), as "The Everyday
# Song Book" (1927, John Chambers' transcription on abcnotation.com, K:Eb): its chorus. 6/8: the dotted
# quarter is the beat.
def _oh_dear(a, last=False):
    return [(a, 'A#4:.5 r:.5 A#4:.5 r:.5 '                                  # "Oh! dear,"
                'A#4:.25 G4:.25 D#5:.5 A#4:.25 G4:.25 D#4:.5 '              # "what can the mat-ter be?"
                'G#4:.5 r:.5 G#4:.5 r:.5 '                                  # "Dear! dear!"
                'G#4:.25 F4:.25 G4:.5 G#4:.25 G4:.25 F4:.5 '                # "what can the mat-ter be?"
                'A#4:.5 r:.5 A#4:.5 r:.5 '
                'A#4:.25 G4:.25 D#5:.5 A#4:.25 G4:.25 D#4:.5 '
                'C4:.25 D#4:.25 G#4:.5 G4:.25 G#4:.25 F4:.5 '               # "John-ny's so long at the"
                + ('D#4:3' if last else 'D#4:1.5 r:.5'))]                    # "fair."


BOY_JESUS_SONG = dict(
    id='song-boy-jesus', title='Where Can Our Jesus Be?', style='hymn', meter=2, tempo=72, swing=2 / 3,
    transpose=-1, start=4,
    lines=_oh_dear('Hap-py! Off to Je-ru-sa-lem! Hap-py! Off to the Pass-o-ver! Je-sus, Ma-ry and Jo-seph went '
                   'all the way up to the feast!')
    + _oh_dear("Oh, dear! Where can our Je-sus be? Oh, dear! Where can our Je-sus be? Oh, dear! Where can our Je-sus be? "
               "Look-ing for Him ev-'ry-where!")
    + _oh_dear("Look, there! There is our Je-sus, there! In God's house, in His Fa-ther's house! Teach-ers lis-tened, "
               "a-mazed at Him. Then He went home with them all.")
    + _oh_dear("Je-sus grew up so strong and wise, lov-ing God and His fam-'ly, too. God loves you, and He loves me, too! "
               'Thank You, God, for lov-ing us!', last=True),
    chords='Eb:2 Bb7:2 ' + 'Eb:4 Bb7:4 Eb:4 Ab:1 Bb7:1 Eb:2 ' * 4 + 'Eb:2',
)


# "The Bear Went Over the Mountain" (a traditional American children's song), as Erich Rickheit's ABC from
# the Digital Tradition (abcnotation.com, K:G). 6/8: the dotted quarter is the beat.
def _bear(a, last=False):
    return [(a, 'B4:.5 '                                                    # "The"
                'B4:.5 B4:.5 B4:.25 A4:.25 B4:.5 C5:1 B4:.5 B4:.5 '          # "bear went o-ver the moun-tain, the"
                'A4:.5 A4:.5 A4:.25 G4:.25 A4:.5 B4:1 G4:.5 A4:.5 '          # "bear went o-ver the moun-tain, the"
                'B4:.5 B4:.5 B4:.25 A4:.25 B4:.5 C5:1 E5:.5 E5:.5 '          # "bear went o-ver the moun-tain, to"
                'D5:.25 +E5:.25 D5:.5 C5:.25 +B4:.25 A4:.5 '                 # "see what he could"
                + ('G4:3' if last else 'G4:1.5'))]                           # "see."


FISHERS_SONG = dict(
    id='song-fishers', title='Fishers of People', style='party', meter=2, tempo=92, swing=2 / 3, transpose=-2,
    start=3.5,  # (each verse starts with a pickup: the last eighth before its first bar)
    lines=_bear('The fish-er-men fished all night long, they fished and they fished all night long, '
                'they fished and they fished all night long, but caught no fish at all!')
    + _bear('Then Je-sus told Si-mon Pe-ter, "Go out to the deep-er wa-ter, and let down your nets for fish there!" '
            'So Pe-ter said, "Yes, Lord!"')
    + _bear('The nets filled up with so ma-ny, the nets filled up with so ma-ny, the nets filled up with so ma-ny, '
            'the boats be-gan to sink!')
    + _bear('"Come fol-low me now," said Je-sus, "I\'ll make you fish-ers of peo-ple!" They left their boats and they '
            'fol-lowed, they fol-lowed Him with joy!')
    + _bear("So let's all go fol-low Je-sus, so let's all go fol-low Je-sus, so let's all go fol-low Je-sus, "
            'and tell them God is love!', last=True),
    chords='G:2 D7:2 ' + 'G:2 C:1 G:1 D7:2 G:2 G:2 C:2 G:1 D7:1 G:2 ' * 5 + 'G:2',
)


# "Lightly Row" (the German folk song "Hänschen klein"), as Musica Viva's ABC (abcnotation.com, K:C), which is
# the folk tune itself. ("The Everyday Song Book" has a 1915 arrangement that ends its lines differently.)
_LIGHTLY_A = 'G4:1 E4:1 E4:2 F4:1 D4:1 D4:2 '                                # "Light-ly row, light-ly row,"


def _lightly(a, b, c, d, last=False):
    return [
        (a, _LIGHTLY_A + 'C4:1 D4:1 E4:1 F4:1 G4:1 G4:1 G4:2'),            # "...on the wat-ers light-ly row."
        (b, _LIGHTLY_A + 'C4:1 E4:1 G4:1 G4:1 C4:4'),                      # "...o'er the deep blue sea."
        (c, 'D4:1 D4:1 D4:1 D4:1 D4:1 E4:1 F4:2 E4:1 E4:1 E4:1 E4:1 E4:1 F4:1 G4:2'),  # "Gen-tle breez-es..."
        (d, _LIGHTLY_A + 'C4:1 E4:1 G4:1 G4:1 C4:4'),
    ]


STORM_SONG = dict(
    id='song-storm', title='Peace, Be Still', style='hymn', meter=4, tempo=100, transpose=4, start=4,
    lines=_lightly('Sail-ing out, sail-ing out, on the lake they sail a-bout;', 'Je-sus slept, Je-sus slept, in the boat He slept.',
                   'Then the wind be-gan to blow, waves came splash-ing high and low;', 'Je-sus, help! Je-sus, help! We are scared, oh help!')
    + _lightly('Je-sus woke, Je-sus woke, "Peace, be still!" is what He spoke;', 'Wind went still, waves went still, calm and qui-et, still.',
               "Ev-'ry-bod-y was a-mazed, lift-ing hands, they gave God praise:", '"Who is this? Who is this? Wind and waves o-bey!"')
    + _lightly("When we're scared, when we're scared, Je-sus loves us, He is there;", "We can pray, we can pray, He hears ev-'ry prayer.",
               'Je-sus calms the wind and sea, He takes care of you and me;', 'Light-ly row, light-ly row, home a-cross the sea.', last=True),
    chords='C:2 G:2 ' + 'C:4 G:4 C:4 G:4 C:4 G:4 C:2 G:2 C:4 G:8 C:8 C:4 G:4 C:2 G:2 C:4 ' * 3,
)


# "Pop! Goes the Weasel" (traditional), the American children's tune, as Erich Rickheit's ABC from the Digital
# Tradition (abcnotation.com, K:C): its first strain. 6/8: the dotted quarter is the beat.
def _weasel(a, last=False):
    return [(a, 'G4:.5 '                                                    # "All"
                'C5:.5 C5:.5 D5:.5 D5:.5 E5:.25 +G5:.25 E5:.5 C5:.5 G4:.5 '  # "a-round the mul-ber-ry bush, the"
                'C5:.5 C5:.5 D5:.5 F5:.5 E5:1 C5:.5 G4:.5 '                  # "mon-key chased the wea-sel, the"
                'C5:.5 C5:.5 D5:.5 D5:.5 E5:.25 +G5:.25 E5:.5 C5:1 '         # "mon-key thought 'twas all in fun,"
                'A5:1 D5:.5 F5:.5 E5:1 ' + ('C5:2' if last else 'C5:.5'))]  # "Pop! goes the wea-sel."


LOST_SHEEP_SONG = dict(
    id='song-lost-sheep', title='Where Is the Little Lamb?', style='party', meter=2, tempo=92, swing=2 / 3,
    transpose=-5, start=3.5,  # (each verse starts with a pickup: the last eighth before its first bar)
    lines=_weasel('A shep-herd had a hun-dred sheep, he count-ed them each eve-ning. But on-ly nine-ty-nine were there! '
                  'Where is the lamb-y?')
    + _weasel('He left the nine-ty-nine at home, and went to find the lost one. He looked be-hind the rocks and trees, '
              "Baa! There's the lamb-y!")
    + _weasel('He put the lamb up-on his shoul-ders, car-ried him home, hap-py! "Come cel-e-brate, I found my lamb!" '
              'Hap-py, hap-py day!')
    + _weasel("God loves us like the shep-herd loves each lit-tle lamb, his dear one. He comes to find us when we're lost. "
              'God loves you so much!')
    + _weasel('So clap your hands and stamp your feet, and sing a-long so hap-py! God found the lit-tle lamb, and He '
              'loves you, He loves you!', last=True),
    chords='C:2 G7:2 ' + 'C:4 G7:2 C:6 F:1 G7:1 C:2 ' * 5 + 'C:2',
)


# "Tramp! Tramp! Tramp!" (George F. Root, 1864), the tune of "Jesus Loves the Little Children": its chorus, as
# John Chambers' ABC of "God Save Ireland" (set to Root's melody; trillian.mit.edu, K:G) gives it. 2/4.
def _tramp(a, b, c, d, e, last=False):
    return [
        (a, 'B4:1 B4:1 B4:.75 A4:.25 G4:.75 E4:.25 D4:2 G4:2'),                  # "Je-sus loves the lit-tle chil-dren,"
        (b, 'A4:1 A4:1 B4:.75 A4:.25 G4:.75 B4:.25 A4:3'),                      # "all the chil-dren of the world;"
        (c, 'D4:.75 C4:.25 B3:.75 D4:.25 G4:.75 A4:.25 G4:1'),                  # "red and yel-low, black and white,"
        (d, 'G4:.75 F#4:.25 E4:.75 F#4:.25 G4:.75 E4:.25 D4:1'),                # "they are pre-cious in His sight,"
        (e, 'B4:.75 A4:.25 G4:.75 F#4:.25 G4:.75 E4:.25 F#4:.75 D4:.25 F#4:.75 A4:.25 '
            + ('G4:4' if last else 'G4:3 r:1')),                                # "Je-sus loves the lit-tle chil-dren of the world."
    ]


SAMARITAN_SONG = dict(
    id='song-samaritan', title='Love Your Neighbor', style='gospel', meter=2, tempo=100, transpose=3, start=4,
    lines=_tramp('Once a man was on a jour-ney,', 'Walk-ing down to Jer-i-cho;', 'Rob-bers took his things a-way,',
                 'Left him hurt and sad that day.', 'Who will stop and help the poor man on the road?')
    + _tramp('Then a priest came walk-ing by him,', 'But he did not stop to help;', 'Then a tem-ple help-er passed,',
             'He went by him, oh so fast!', 'Who will stop and help the poor man on the road?')
    + _tramp('Then a kind man came a-rid-ing', 'From Sa-mar-i-a he came;', 'He was sad to see him there,',
             'So he stopped to help and care.', 'Yes, he stopped to help the poor man on the road!')
    + _tramp('Ban-daged up his cuts and bruis-es,', 'Let him ride his don-key, too,', 'To an inn to rest and stay,',
             'And he paid for it, hoo-ray!', 'He was kind and loved the poor man on the road!')
    + _tramp('Je-sus says to love our neigh-bors,', "Ev-'ry-one we meet each day;", 'Friends and strang-ers, big and small,',
             'God wants us to love them all!', "Let's be kind like the Sa-mar-i-tan each day!", last=True),
    chords='G:2 D7:2 ' + 'G:8 D:2 A7:2 D:2 D7:2 G:4 C:2 G:2 Em:2 D:2 G:4 ' * 5 + 'G:2',
)


# "Yankee Doodle" (an old English tune, 1755), as "The Everyday Song Book" (1927, John Chambers' transcription on
# trillian.mit.edu, K:A) gives it, pickups and all; sung here in G and straight, as children sing it today.
# 2/4. Each verse starts with a pickup: the last eighth before its first bar.
def _doodle(a, b, c, d, e, last=False):
    return [
        (a, 'D4:.5 G4:.5 G4:.5 A4:.5 B4:.5 G4:.5 B4:.5 A4:.5 D4:.5 G4:.5 G4:.5 A4:.5 B4:.5 G4:1 F#4:.5'),  # "(And) Yan-kee Doo-dle went to town, a-rid-ing on a po-ny,"
        (b, 'D4:.5 G4:.5 G4:.5 A4:.5 B4:.5 C5:.5 B4:.5 A4:.5 G4:.5 F#4:.5 D4:.5 E4:.5 F#4:.5 G4:1 G4:.5 r:.5'),  # "(he) stuck a fea-ther in his cap and called it mac-a-ro-ni."
        (c, 'E4:.75 F#4:.25 E4:.5 D4:.5 E4:.5 F#4:.5 G4:.5 r:.5'),            # "Yan-kee Doo-dle, keep it up,"
        (d, 'D4:.75 E4:.25 D4:.5 C4:.5 B3:.75 +C4:.25 D4:.5 r:.5'),          # "Yan-kee Doo-dle dan-dy;"
        (e, 'E4:.75 F#4:.25 E4:.5 D4:.5 E4:.5 F#4:.5 G4:.5 E4:.5 D4:.5 G4:.5 F#4:.5 A4:.5 '
            + ('G4:1 G4:2' if last else 'G4:1 G4:.5')),                      # "Mind the mu-sic and the step, and with the girls be han-dy."
    ]


ZACCHAEUS_SONG = dict(
    id='song-zacchaeus', title='Hurry Down, Zacchaeus!', style='bouncy', meter=2, tempo=112, transpose=2,
    start=3.5,  # (each verse starts with a pickup: the last eighth before its first bar)
    lines=_doodle('Zac-chae-us was a lit-tle man, a rich man, but so lone-ly;',
                  'He took more mon-ey, more and more, and folks were cross and grump-y.',
                  'Then one day the news came round:', 'Je-sus, here He comes now!',
                  "Ev-'ry-bod-y crowd-ed round; Zac-chae-us could-n't see Him!")
    + _doodle('So up he climbed a syc-a-more, up in the leaves and branch-es,',
              'And there he sat and watched and watched, to see if Je-sus passed by.',
              'Je-sus stopped be-neath the tree,', 'Look-ing up, He called out:',
              '"Hur-ry down, Zac-chae-us, come! I\'m stay-ing at your house now!"')
    + _doodle('Zac-chae-us hur-ried down so fast, he was so glad and hap-py!',
              'But some folks grum-bled, grum-ble, grum! "Why vis-it such a bad man?"',
              'Then Zac-chae-us stood up tall:', '"I will give and share now!',
              'If I took too much from you, I\'ll pay back four times o-ver!"')
    + _doodle('So Je-sus smiled and said, "Hoo-ray! To-day God\'s love has found you!',
              'For I have come to find the lost and bring them home so hap-py!"',
              'Big or lit-tle, short or tall,', 'Je-sus loves us, each one!',
              'Je-sus wants to stay with you and be your friend for-ev-er!', last=True),
    chords='G:2 D7:2 ' + 'G:2 D:2 G:2 D:2 G:2 C:2 D:2 G:2 C:2 G:2 D:2 G:2 C:2 G:2 D7:2 G:2 ' * 4 + 'G:1',
)

ISLAND_SONGS = [CREATION_SONG, ABRAHAM_SONG, JOSEPH_SONG, RED_SEA_SONG, DAVID_SONG, DANIEL_SONG, JONAH_SONG, LOAVES_SONG,
                BABY_MOSES_SONG, BURNING_BUSH_SONG, MANNA_SONG, JERICHO_SONG, RUTH_SONG, SAMUEL_SONG,
                ELIJAH_SONG, ESTHER_SONG, BOY_JESUS_SONG, FISHERS_SONG, STORM_SONG, LOST_SHEEP_SONG,
                SAMARITAN_SONG, ZACCHAEUS_SONG]

SONGS = [JESUS_LOVES_ME, THIS_LITTLE_LIGHT, AWAY_IN_A_MANGER, TWINKLE, HAPPY_BIRTHDAY, NOAH] + ISLAND_SONGS
