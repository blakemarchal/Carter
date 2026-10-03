# Ark Pals

A faith-based learning game for young children: Bible stories, reading, numbers, and Pokémon-style Ark Pals.
It began as a game for one family's daughter; [SPEC.md](SPEC.md) is that first plan, and
[docs/BUSINESS-PLAN.md](docs/BUSINESS-PLAN.md) is where it's going. No child is written into the code:
names, birthdays, looks and family all come from the players and the Parent Corner.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also on your LAN, so the iPad can open it)
npm run build      # production files in dist/
```

**Quick playtest without the server:** on the Windows laptop run `npm install` then `npm run dev`. Open the "Network" URL it prints (e.g. `http://192.168.1.20:5173`) in Safari on the iPad, on the same Wi-Fi. If Windows asks, allow Node through the firewall on private networks.

**Deploy to spiritflow.church:** see [deploy/DEPLOY.md](deploy/DEPLOY.md).
**Narration** uses Grok's "Ara" voice (xAI text-to-speech) when the server has an xAI API key; see DEPLOY.md, "Narrator voice". Each line is generated once and cached on the server and the iPad. Without a key, or with `npm run dev`, the device's built-in voice reads instead.

**Music and sound effects** are synthesized in the browser (`src/lib/audio.ts`, `music.ts`, `sfx.ts`), so there are no audio files. Each scene has its own tune. Music is on by default; the 🎵 button on the map turns it off.

**Sing-along** (🎤 on the map): Ara sings six songs while the words light up one at a time, and the player's Pal dances. "I sing!" swaps to the same song with the tune on a flute. The songs are made ahead of time by `scripts/sing` (see "Making the songs" below) into `public/music/` and `src/data/songs.gen.json`. Parents can add their own recordings in the Parent Corner and tap along once to time the words.

**Players:** the title screen asks "Who's playing?" (a brand-new device asks for the first player's name). Each player has separate progress and settings on the device, so a grown-up testing as themselves never touches a child's game. In the Parent Corner each player can have a birthday (month and day only) and a look for the story pictures, and the family cast (what the children call Mom and Dad, brothers and sisters, pets) puts the family into the stories.

**Birthdays:** the week before, balloons appear on the map and the player's Pal counts the sleeps. On the day, a surprise party starts when they open the game: every Pal in a party hat, Ara singing Happy Birthday with their name, candles to put on the cake and blow out, the birthday story (their date, age, family and Pals), "Thank you, God, for making ___!" with Psalm 139:14, a battle where the grumpy balloon was bringing a present, and gifts: an age sticker ("5 candles") that collects year by year, party hats for their Pals, and a birthday cake in the Pal Kitchen that day. The other players see "Today is ___'s birthday!". Tapping an age sticker in the sticker book plays that party again.

**What's in the game:**
- A sailing map of six story islands (Noah, Creation, David, Jonah, Loaves & Fishes, Baby Jesus). Islands open in order; each is data in `src/data/<island>.ts`.
- Activities: picture-book stories, memory match, adaptive reading and number questions, put-in-order, sorting, story questions, counting into a basket, letter tracing, mazes, memory verses (World English Bible).
- Ark Pals: 18 collectable Pals with three stages each, an evolution scene, friendly battles with basic, brave and super moves, Pal homes (pet, feed, dress up, color), a mystery egg, the Pal Kitchen (cook each Pal's favorite food: counting, reading, patterns, shapes), a sticker book and a bedtime story.
- Sing-along: Jesus Loves Me, This Little Light of Mine, Noah Built a Big Boat (to "Old MacDonald"), Twinkle Twinkle, Away in a Manger, and Happy Birthday (Ara leaves a gap for the name, and the game says the player's name there).
- Parent Corner (hold the ⚙️ for 3 seconds): players (birthday and look), the family cast, a birthday-party preview, levels, narrator voice, music, this week's summary, open all islands, family voice recordings, your own sing-along songs, backup and restore, app updates.

**Tests:** `npm test` checks the spoken-text rules, question generation, move unlocks, and every island, Pal and recipe.

## Layout

- `src/data/`: story text, Pals, word lists, islands (most content edits happen here)
- `src/lib/`: narration, sounds, adaptive questions, saved progress
- `src/activities/`: story book, Two by Two, practice rounds, memory verse, friendly battle, reward
- `src/screens/`: title, starter choice, map, Ark, parent corner, Noah island flow
- `server/`: tiny password-protected server for production
- `deploy/`: systemd unit, Caddy block, deploy scripts and runbook
- `scripts/sing/`: makes the sing-along songs (Python)

## Checking animations

`scripts/film/` drives the game in headless Chrome at iPad size, with touch and real finger drags, and takes pictures as it goes (start `npm run dev -- --port 5179` first):

```bash
node scripts/film/screens.mjs                                     # motion audit: title, map, Ark, a Pal's home
node scripts/film/motion.mjs "http://localhost:5179/#gallery/scenes/all"   # every story picture (and #gallery/pals)
node scripts/film/gallery.mjs out/pics scenes/birthday/family     # a picture of each page (…/family: a made-up family)
node scripts/film/play.mjs out/pairs noah 1                       # play one island step: pairs, sequence, sort, count, maze, verse, battle
node scripts/film/kitchen.mjs out/kitchen zippy                   # cook a whole recipe by dragging
python scripts/film/transforms.py .                               # CSS that would wipe out an SVG element's position
```

The motion audit pauses every animation, scrubs it through its cycle and lists anything that travels far from where it rests (a sign of a transform pivoting on the wrong point). `sheet.py` turns a folder of pictures into one contact sheet. `#gallery/...` pages only exist in `npm run dev`.

## Making the songs

Each song is written out note by note in `scripts/sing/scores.py` (melodies checked against published sheet music; all public domain). To make Ara sing them:

1. Get Ara's voice saying each word. This runs on the server, which has the voice key:
   ```bash
   python scripts/sing/words.py > words.json
   scp scripts/sing/fetch-words.mjs root@68.183.130.3:/opt/Carter/scripts/sing/
   scp words.json root@68.183.130.3:/root/sing-words.json
   ssh root@68.183.130.3 "cd /opt/Carter && node scripts/sing/fetch-words.mjs /root/sing-words.json /root/sing-words"
   scp -r "root@68.183.130.3:/root/sing-words" .
   ```
2. Make the songs (needs Python 3 and `pip install -r scripts/sing/requirements.txt`):
   ```bash
   python scripts/sing/make.py sing-words                  # all songs; or --only twinkle
   ```
   Each word is pitched onto its notes and its vowel held for the note's length (the WORLD vocoder), then mixed with a synthesized band. It prints how close each song is to the written notes.
3. Build and deploy as usual. Song files have a content hash in their names, so iPads pick up new versions.

Parent Corner: on the map, **press and hold ⚙️ for 3 seconds**.
