# Making an island

How to add a story island to Ark Pals. An island is mostly content (text, data and pictures), checked before it ships. [GAME-PLAN.md](GAME-PLAN.md) covers where the game is heading. This guide covers how an island is made today.

## The files

Start with `npm run new-island -- red-sea "The Red Sea"`. It writes the three content files from a three-visit template, with TODOs to fill in, and prints the lines that register the island. Its place on the voyage (which sea, and in what order) is in `src/data/seas.ts`.

| File | What goes in it |
|---|---|
| `src/data/<id>.ts` | The story (two parts), the activities, the memory verse, the mini-game, the battle, the song and the reward. Export `<ID>_STEPS`. |
| `src/art/scenes/<id>.tsx` | One component per story page, part 1 then part 2, in order. Export `<ID>_ART`. |
| `src/art/games/<id>.tsx` | The kit of pictures for the island's mini-game (see "The signature mini-game"). |
| `src/data/islands.ts` | Register the island: `{ id, name, emoji, color }` in `ISLANDS` (the emoji is its landmark on the map), and a line in `CONTENT` that loads its steps and pictures (`npm run new-island` prints it). An island's content loads only when it's needed, so the game starts quickly however many islands there are. Raise `version` when a finished island gets new content, so players see "New!". |
| `src/data/pals.ts` + `src/art/pals/<species>.tsx` + `src/art/pals/index.ts` + `src/art/pals/faces.ts` | The island's two new Pals: the grumpy creature in the battle, and the reward Pal. |
| `src/data/songs.ts` + `scripts/sing/scores.py` | The island's song (see "The song"). |
| `src/art/items/isl-<id>.tsx` | New drawn things the island's activities need. |

## Three visits

An island is played over three visits of about 8 to 10 minutes each, split by `pause` steps ([GAME-PLAN.md](GAME-PLAN.md) §3.1). The daily voyage counts visits, and the next visit starts after the pause.

1. **The story:** story part 1, then the signature mini-game, then one learning activity, then a `pause` with a gentle cliffhanger ("Will the dove find dry land? Let's find out next time!").
2. **The adventure:** story part 2, then two learning activities, then the memory verse, then a `pause`.
3. **The rescue:** put the story in order (a `sequence` of story cards), then the `battle`, the `song` and the `reward`.

## The story (10–12 pages, in two parts)

- **Audience:** ages 4 to 7, read aloud. Keep sentences short and words concrete, with one idea per page. The text-to-speech voice reads it, so it must sound natural spoken: no symbols, no emoji, no "&" or "/". Write numbers as words.
- **Faith:** grace first, with obedience as a loving response. **God is never drawn as a person**: His presence is light (`Glow`, `Rays`, `Sparkles`). Jesus is drawn as a person (`PEOPLE.jesus`). Stay true to the Bible, but tell it simply. Leave out anything frightening.
- **Each part is a chapter**, with its own title. The first page of a part is read as "<title>. <page 1>", so a title has no "!".
- **Part 2 says where its pictures start**: `first: <part 1's length>`. Its first page picks the story up again with a short reminder.
- **End** with what the story shows about God ("God always keeps His promises!").

## The story pictures

- Each page is an 800 x 450 `<Scene>` (see `src/art/scenes/kit.tsx`), built from the kit's props and from `Person` (`src/art/people.tsx`). **Reuse before you draw.** When you need something new (a prop, an animal), add it to the kit so the next island gets it too.
- **Shared drawing lives in shared files:** poses and faces (`Figure`, `Kneel`, `Sitting`, `Brows`…) in `src/art/people.tsx`, props (`ThoughtBubble`, `Tent`, `Rock`…) in `src/art/scenes/kit.tsx`, the Moses cast in `src/art/scenes/moses.tsx`. **Never import from another island's scene file:** each island is its own download, and that import drags the other island along. Move what's shared into the shared files instead.
- **People** come from presets in `PEOPLE`. A character looks the same on every page and every island: the same clothes, hair and colors. The player and their family come from `usePlayer()`.
- **Things in pictures** that already have a drawn item (`#gallery/items`) can be placed with `<Emoji e="🐑" x y size />`, and the drawing is used.
- **Every page must match its words.** If the text says "five loaves", draw five. If it says "the dove came back with an olive leaf", draw the leaf. Anything named in the text should be visible.
- **Anatomy:**
  - Animals have two eyes, the right number of legs, and wings at the sides of the body (not sticking out of the back), with tails at the back.
  - Nothing floats unless it flies. Feet touch the ground, and nothing important is cut off at the edge.
- **Living pictures:** wrap 2–4 things per page in `<Tap say="Baa!" sfx="pop">…</Tap>`. Tapping makes them hop, and their line is spoken when the narrator isn't mid-sentence. Never put a CSS class on an element that has a `transform` attribute; wrap it in a `<g>`.
- **Motion** uses the existing classes in `styles.css` ("Story scenes"): `sc-float`, `sc-sway`, `sc-wing` and others.

## The signature mini-game

Each island has one game that only makes sense there ([GAME-PLAN.md](GAME-PLAN.md) §5.2). It's a reusable mechanic (`src/activities/games/`) played with the island's own kit of pictures (`src/art/games/<id>.tsx`). The step is `{ kind, title, intro, done, kit }`; the kit's shape for each kind is in `src/activities/games/types.ts`.

| Kind | Game | For example |
|---|---|---|
| `build` | drag the parts onto their places | building the ark, getting the stable ready |
| `spot` | find things in a big picture | the animals God made, Abraham's stars, the gentle lions |
| `paint` | color by number | Joseph's coat |
| `steer` | lead the hero along the way | the big fish to the beach, through the Red Sea |
| `rhythm` | tap along with the music | David's harp |
| `share` | give everyone the same | the loaves and fishes |

A kit's backdrop is a whole `<Scene>`; its other pieces are SVG fragments centred on (0, 0). See every piece in place at `#gallery/kit/<id>`, and play the game with the island's kit at `#gallery/game/<kind>/<id>`.

## Activities

All the step kinds are in `src/data/islands.ts`: `pairs`, `practice`, `sequence`, `sort`, `quiz`, `count`, `trace`, `maze`, `verse`, the mini-games, `pause`, `battle`, `song` and `reward`.

- **Pictures.** Activity pictures are `{ emoji, say, art? }`. The emoji names a drawn item, and the narrator says `say`. **The picture must show exactly what's said.**
  - "Fish and birds" needs a picture with fish *and* birds.
  - "Baby Jesus in the stable" needs the baby in the stable.
  - When no item fits, add one to `src/art/items/isl-<id>.tsx` (see `farm.tsx` for the style) rather than settling for a near-miss emoji.
- **Story cards.** To retell the story (put in order, story questions), use the story's own pictures: `art: 'story:<id>:<page>'`, counting pages from 1 across both parts.
- **Spoken text** follows the same rules as the story: no emoji or symbols. The tests check this.
- Every island should teach something. Mix reading and numbers, and pick a number practice's `theme` emoji from the story (raindrops, stars, fish).
- **Things no emoji names** (manna, a mud brick, the basket boat) get a drawing in `isl-<id>.tsx` with no emoji, used by its id: `art` on an activity picture, the `count` item's `art`, or a sticker named by the drawing's id. Only give a drawing an emoji when it is what that emoji means everywhere: a drawing of baby Moses that claimed 👶 once turned every baby in the game into his basket. (A practice's `theme` is still emoji only.)
- **Words the voice can misread:** a few words are spelled the same but said two ways. "Bow" is read as a ribbon unless it's "bow down"; watch "read", "live", "wind", "tear" and "lead" too, and listen to the line on the review page.

## Memory verse

Use the World English Bible, word for word, split into 2–4 chunks a child can build in order. Keep it short. The narrator always says "God", so prefer verses that say "God" over ones with "Yahweh".

## The song

Each island ends with its own song: new words to a public-domain tune, written note by note in `scripts/sing/scores.py` and listed in `src/data/songs.ts` with the island's id (it joins the sing-along once the island is done). Ara's word clips are fetched on the server (`scripts/sing/fetch-words.mjs`), then `scripts/sing/make.py` builds the audio. Until a song is made, its song step skips itself.

## The two new Pals

Every island adds two Pals, and each Pal belongs to one island only (the tests check this):

- **The grumpy creature in the battle.** It joins the Ark when it's befriended.
- **The reward Pal.**

For each one:
- **In `pals.ts`:** three stages, with xp 0, 100 and 300. Give it moves using the listed effects, a fruit of the Spirit, and an intro that starts "is a".
- **The art:** one species file drawing all three stages in a 200 x 200 box, happy and grumpy. Use the shared helpers in `src/art/kit.tsx` (`useShade`, `CuteFace`, `Shine`, `Anim`) so it matches the other Pals. Each stage adds something new: a bigger size, an accessory, a crown or wings.
- **Its face in `faces.ts`:** where its face, yawn and party hat go. Check them at `#gallery/hats/<species>`.

## Before it ships

1. Run `npx tsc -b` and `npm test`.
2. Render the pictures at 2x and look at every one:
   `node scripts/film/gallery.mjs <out> scenes/<id> kit/<id> pals/<species> hats/<species> --scale 2`.
3. Open `/#review/<id>` and read each page beside its picture, visit by visit, with each activity's pictures beside their words.
4. Get a fresh review from someone who didn't draw it, using the checklist in this guide. Fix everything marked HIGH or MED.
5. Play it through on an iPad, or step by step: `node scripts/film/step.mjs <out> <id> <step>` shows any step, `node scripts/film/play.mjs <out> <id> <step>` plays the classic activities with real drags, and `scripts/film/games/<kind>.mjs <out> <id>` plays the mini-game.
