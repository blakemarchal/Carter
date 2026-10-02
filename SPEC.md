# Carter's Ark Adventure — Product Spec (v0.1 draft)

A faith-based learning game for Carter, an advanced 4-year-old who turns 5 on **January 8, 2027**.

Priorities, in order:
1. **Learning:** kindergarten-readiness skills, pitched a little ahead of her age.
2. **Christianity:** Bible stories, memory verses, and character (Fruit of the Spirit).
3. **Pokémon flavor:** collecting, befriending, and evolving creature companions. Nice to have.

Working title only. Rename it to whatever Carter would love.

---

## 1. Platform recommendation

**Build it as an installable web app (PWA), hosted on your VPS.**

| Option | Verdict |
|---|---|
| **PWA on VPS** ✅ | One codebase. You install it from Safari/Chrome to the tablet's home screen, it opens full-screen like a native app, and it **works offline** (car rides). Updates go live the moment you deploy. No app store review and no fees. |
| Native iOS/Android | App Store accounts, review, and signing add cost and weeks of friction for an audience of one. If we ever need it, the PWA can be wrapped with **Capacitor** later without a rewrite. |
| Local desktop app | Fine for a laptop, but a 4-year-old does far better with a touchscreen tablet. |

**Stack:** Vite + TypeScript + React, animations in SVG/CSS (Framer Motion), audio with Howler.js, and `vite-plugin-pwa` for offline install. All progress is saved on the device (IndexedDB). Optional sync to the VPS can come later.

**Hosting:** static files served by Caddy or nginx with HTTPS. HTTPS is required for PWA install. You can optionally put it behind a simple password or an obscure subdomain.

Nothing here needs special cloud access. We can build and test it entirely in this repo and deploy to your VPS with a single `rsync`/`scp` command or a GitHub Action.

---

## 2. Design principles for a 4–5 year old

- **No reading required to navigate.** Every instruction is spoken aloud, and every button is a big picture. Tapping the speaker (or the character) replays the instruction.
- **Big touch targets** (≥ 64 px). Use drag *or* tap, never precise gestures.
- **No failure states.** A wrong answer gets a gentle wiggle and "Try again!" After two misses, a hint appears (the right answer glows). There are never lives, timers that punish, or losing.
- **Short sessions:** each activity takes 1–3 minutes, and a full "adventure" is about 10 minutes.
- **Constant, warm praise**, plus a visible reward after each activity (sticker, companion XP).
- **Safe by construction:** no ads, no chat, no external links, no accounts, no data leaving the device.
- **Parent area behind a parental gate** (e.g., "press and hold for 3 seconds" + a simple question).

---

## 3. Core game loop

```
Home (Carter's Ark)
  └─ World Map: Bible story islands, unlocked in order
       └─ Story Island
            1. Story Time: narrated picture-book (5–8 pages, ~2 min)
            2. 3–4 Learning Activities themed to the story
            3. Memory Verse: echo-and-repeat, tap words in order
            4. Reward: a new companion joins, or an existing one grows
       └─ Back on the Ark: visit companions, see sticker book
```

### The "Pokémon" layer: **Ark Pals**
- These are original, cute creature companions (not Pokémon IP; see §8). They are inspired by animals from the stories: lamb, lion, dove, whale, donkey, camel, fish, sheep, and so on.
- **Types are the Fruit of the Spirit** (Galatians 5:22–23): Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control. Each Pal has a type and a short virtue lesson ("Pip the dove is a *Peace* Pal!").
- **Evolution through practice.** Pals gain XP when Carter completes activities. At thresholds they grow (e.g., Lamb → Sheep → Shepherd's Ram) with a celebration animation.
- **Collection screen (the "Ark"):** Carter can see her Pals, tap them to hear them, and feed or pet them. Silhouettes show the Pals not yet found.
- No battles. "Challenges" are cooperative: her Pal helps her solve the puzzle.

---

## 4. Content plan

### 4.1 Story islands (MVP = first 6)

| # | Story | Learning activities (examples) | Pal earned |
|---|---|---|---|
| 1 | **Creation** (Gen 1) | Sequence days 1–7; count stars/fish/birds; sort land/sea/sky animals | Sunny (Joy) |
| 2 | **Noah's Ark** (Gen 6–9) | Match animals two-by-two (pairs / count by 2s); rainbow color order; letters A–N on animals | Pip the dove (Peace) |
| 3 | **David & Goliath** (1 Sam 17) | Count 5 smooth stones; big vs. small / measuring; letter D sounds | Lionel the lion cub (Faithfulness) |
| 4 | **Jonah** (Jonah 1–3) | Fish addition within 10; beginning sounds ("what starts like *whale*?"); left/right | Bubbles the whale (Patience) |
| 5 | **Jesus Feeds 5,000** (John 6) | 5 loaves + 2 fish = 7; sharing equally (early division); patterns in baskets | Basket the donkey (Kindness) |
| 6 | **Christmas / Jesus' Birth** (Luke 2) | Follow the star (mazes); count sheep to 20; sight words *God*, *love*, *is* | Starling the lamb (Love) |

**Later islands:** Moses & the Red Sea, Daniel & the Lions, Joseph's Coat (colors!), Zacchaeus, Jesus Calms the Storm, Lost Sheep, Easter, and a **birthday bonus island** for January 8.

### 4.2 Learning skill tracks (adaptive)

Each track has levels. The game nudges difficulty up after 3 correct answers in a row and down after repeated misses.

- **Literacy:** letter recognition (upper/lower) → letter sounds → beginning sounds → CVC words (*cat, sun, ark*) → sight words → reading a short verse with highlighting
- **Math:** counting to 20 → to 100 by 1s/10s → compare more/less → addition/subtraction within 10 → skip counting by 2s/5s → simple patterns
- **Thinking:** shapes, sorting, sequencing story events, memory match, simple mazes
- **Faith:** story comprehension ("Who did God keep safe in the ark?"), memory verses, prayer prompts ("Tell God thank you for something!")

### 4.3 Memory verses (short, kid-friendly)
- "God is love." (1 John 4:8)
- "In the beginning God created the heavens and the earth." (Gen 1:1)
- "I can do all things through Christ who strengthens me." (Phil 4:13)
- "Be kind to one another." (Eph 4:32)
- "Jesus said, 'Let the little children come to me.'" (Matt 19:14)

The translation is TBD (see questions). Story text will be original, age-appropriate retellings, which avoids translation licensing.

---

## 5. Parent area
- Progress per skill track and per island
- **Session timer** (e.g., 20 min/day) with a friendly "Time to rest! The Pals are sleeping 💤"
- Unlock/lock islands; reset progress; mute music
- Choose the narration voice (parent recordings vs. computer voice)
- Optional: add a custom memory verse or a "word of the week"

---

## 6. Audio & art
- **Narration is the most important asset.** Options:
  - **A. Parent-recorded voice (recommended for the soul of it).** We produce a script of every line, and you record on your phone. Hearing Dad or Mom is magical for a 4-year-old.
  - **B. High-quality text-to-speech, pre-generated** into audio files at build time. This is consistent and fast to iterate.
  - Start with B for development, then swap in A line by line.
- **Art:** a bright, soft, rounded style. Sources include CC0 packs (e.g., Kenney.nl), hand-built SVG, and/or AI-generated illustrations you approve. Ark Pals need consistent original designs; I can draft them as SVG.
- **Music:** gentle royalty-free loops, plus optional simple kids' worship tunes (public domain hymns like "Jesus Loves Me").

---

## 7. Milestones (≈14 weeks to Jan 8)

| By | Milestone |
|---|---|
| Oct 16 | **Prototype:** app shell, map, 1 island (Noah's Ark) with story + 2 activities + 1 Pal, using placeholder art and TTS. Playtest with Carter. |
| Nov 6 | **Core systems:** Ark Pals collection + evolution, adaptive skill engine, parent area, offline PWA install on her tablet, deployed to VPS |
| Dec 4 | **Content:** 6 islands complete, art pass, music |
| Dec 18 | **Polish:** parent voice recordings swapped in, playtest fixes |
| Jan 1 | **Content freeze:** birthday bonus island + "Happy 5th Birthday, Carter!" surprise |
| **Jan 8** | 🎂 Launch |

After launch: add a new island every few weeks so the game "grows up" with her.

---

## 8. Pokémon note (IP)
Real Pokémon names, sprites, and sounds are Nintendo/Game Freak IP. Using them is legally gray even for a private app, and it's a non-starter if the app is ever public. The spec therefore uses **original Pokémon-*style* creatures** (Ark Pals) with the same feel: collect, name, evolve, types. If you want a nod to her favorite Pokémon for a purely private build, that can be a personal sticker, kept out of anything public.

---

## 9. Open questions
See the list sent with this spec. Answers will update this document.
