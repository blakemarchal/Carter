# Carter's Ark Adventure — Product Spec (v0.2)

A faith-based learning game for Carter, an advanced 4-year-old who turns 5 on **January 8, 2027**.

Priorities, in order:
1. **Learning:** kindergarten-readiness skills, pitched a little ahead of her age.
2. **Christianity:** Bible stories, memory verses, and character (Fruit of the Spirit).
3. **Pokémon flavor:** collecting, befriending, and evolving creature companions. Nice to have.

Working title only. Rename it to whatever Carter would love.

---

## 0. Decisions so far

| Topic | Decision |
|---|---|
| Device | **iPad first** (landscape, installed to the Home Screen). The Windows laptop works too, in Edge or Chrome, at no extra cost. |
| Reading | Knows all letter sounds and is starting to blend words. Content starts at **CVC words** (cat, sun) and moves to sight words. |
| Numbers | Counts past 100, with the 1–9 pattern solid. She sometimes forgets the **next decade** (69 → 70, 79 → 80), so "what comes next" questions deliberately practice decade crossings. |
| Voice | Built-in device voice for now. **Mom and Dad record** the final narration, and different characters can use different voices. |
| Art | AI-generated and open-licensed art are fine. The prototype uses emoji and hand-built SVG Pals. |
| Pokémon taste | She likes the tough ones (Onix, Mewtwo, Charizard) *and* the cute ones (Pikachu). The starter Pals cover each: **Zippy** (cute electric mouse), **Ember** (dragon that grows into Glorydrake), **Pebble** (rock serpent). **Nova** is a hidden legendary cosmic cat. |
| Battles | **Yes, friendly ones.** Correct answers power your Pal's move and fill a *Friendship meter*. Nobody gets hurt, and the "foe" becomes a friend and joins the Ark. |
| Theme | **Pink!** |
| Family | Little brother **Luke** (10 months) gets a cameo in a story, with his own player profile later. Family adventures with Mom and Dad come later (see §10). |
| Screen time | 1 hour/day with a gentle "Pals are sleepy" reminder. An adult is always present, so no lock-out. |
| Hosting | DigitalOcean VPS, on **spiritflow.church** (the existing app is archived first, see §9). |
| Security | Private and password-protected. No chat, no other players, no user content, no ads, no outside links. Nothing like Roblox. |

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
- **Starter choice.** On first launch Carter picks her first Pal (Zippy, Ember or Pebble), Pokémon-style.
- **Friendly battles.** Each island ends with a grumpy creature (e.g., Rumble the storm cloud). Each correct answer makes her Pal use its move ("Ember used Brave Flame!") and fills the **Friendship meter**. When the meter is full, the creature smiles, becomes a friend, and joins the Ark. Wrong answers are harmless ("Rumble sprinkled some rain! Try again.").

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
| Oct 16 | ✅ **Prototype (built Oct 2):** app shell, starter Pal choice, map, full Noah's Ark island (story, Two by Two, Word Boat, Raindrop Numbers, memory verse, friendly battle, reward), Ark collection, evolution, parent corner. Placeholder art and device voice. **Next: playtest with Carter.** |
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

## 9. Hosting & security plan (spiritflow.church)

1. **Archive the existing app first.** Before anything changes on the VPS, back up its database and files to an off-server copy (and a DigitalOcean snapshot), then stop it. This step needs details about what it runs on (see §11).
2. **Serve the game as static files** behind Caddy (automatic HTTPS) or the existing nginx, on `spiritflow.church` or a subdomain such as `carter.spiritflow.church`.
3. **Family password.** A tiny login step sets a long-lived, secure cookie, so each device enters the password once. This works better than browser "basic auth" pop-ups, which behave badly in iPad Home Screen apps.
4. **No server data.** Progress stays on the iPad, and the server only hands out the game files. Optional backup/sync of progress can be added later.
5. `robots.txt` blocks search engines. There is no analytics or third-party tracking, and fonts will be self-hosted.

## 10. Future ideas
- **Family Adventures:** a "pass the iPad" mode where Mom or Dad joins a battle as a second Pal, plus family prayer and praise prompts.
- **Luke's profile** once he's old enough: separate progress and his own starter Pal.
- Parent-recorded voices, with each family member as a character.
- A new island every few weeks after launch.

## 11. Still open
- **Church tradition and Bible translation** for memory verses. The default is NIrV-style kid wording.
- **VPS details:** web server (nginx, Caddy, Apache or Docker), and what the current spiritflow.church app uses (database type, Docker or not), so we can back it up safely.
- Root domain or a `carter.` subdomain?
