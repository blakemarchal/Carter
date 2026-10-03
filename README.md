# Carter's Ark Adventure

A faith-based learning game for Carter: Bible stories, reading, numbers, and Pokémon-style Ark Pals.
See [SPEC.md](SPEC.md) for the full plan.

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

**Players:** the title screen asks "Who's playing?". Each player (Carter, Dad, or anyone added in the Parent Corner) has separate progress and settings on the device, so testing as Dad never touches Carter's game.

**What's in the game:**
- A sailing map of seven story islands (Noah, Creation, David, Jonah, Loaves & Fishes, Baby Jesus, and a birthday island that opens on January 8). Islands open in order; each is data in `src/data/<island>.ts`.
- Activities: picture-book stories, memory match, adaptive reading and number questions, put-in-order, sorting, story questions, counting into a basket, letter tracing, mazes, memory verses (World English Bible).
- Ark Pals: 18 collectable Pals with three stages each, an evolution scene, friendly battles with basic, brave and super moves, Pal homes (pet, feed, dress up, color), a mystery egg, the Pal Kitchen (cook each Pal's favorite food: counting, reading, patterns, shapes), a sticker book and a bedtime story.
- Sing-along: Jesus Loves Me, This Little Light of Mine, Noah Built a Big Boat (to "Old MacDonald"), Twinkle Twinkle, Away in a Manger, and Happy Birthday, Carter.
- Parent Corner (hold the ⚙️ for 3 seconds): players, levels, narrator voice, music, this week's summary, open all islands, family voice recordings, your own sing-along songs, backup and restore, app updates.

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
   scp words.json root@68.183.130.3:/root/carter-words.json
   ssh root@68.183.130.3 "cd /opt/Carter && node scripts/sing/fetch-words.mjs /root/carter-words.json /root/carter-sing-words"
   scp -r "root@68.183.130.3:/root/carter-sing-words" .
   ```
2. Make the songs (needs Python 3 and `pip install -r scripts/sing/requirements.txt`):
   ```bash
   python scripts/sing/make.py carter-sing-words           # all songs; or --only twinkle
   ```
   Each word is pitched onto its notes and its vowel held for the note's length (the WORLD vocoder), then mixed with a synthesized band. It prints how close each song is to the written notes.
3. Build and deploy as usual. Song files have a content hash in their names, so iPads pick up new versions.

Parent Corner: on the map, **press and hold ⚙️ for 3 seconds**.
