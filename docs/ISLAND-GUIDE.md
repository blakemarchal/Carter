# Making an island

How to add a story island to Ark Pals. An island is mostly content (text, data and pictures), checked before it ships. [GAME-PLAN.md](GAME-PLAN.md) covers where islands are heading: seas, three visits each, and signature mini-games. This guide covers what exists today.

## The files

Start with `npm run new-island -- red-sea "The Red Sea"`. It writes the two content files from a template, with TODOs to fill in, and prints the lines that register the island. Its place on the voyage (which sea, and in what order) is in `src/data/seas.ts`.

| File | What goes in it |
|---|---|
| `src/data/<id>.ts` | The story pages, the activities, the memory verse, the battle intro and the reward. Export `<ID>_STEPS`. |
| `src/art/scenes/<id>.tsx` | One component per story page, in order. Export `<ID>_ART`. |
| `src/art/scenes/index.ts` | Register the art: `<id>: <ID>_ART`. |
| `src/data/islands.ts` | Register the island: `{ id, name, emoji, color, at: [x, y], steps }`. The map is 1000 x 620, and the emoji is its landmark. |
| `src/data/pals.ts` + `src/art/pals/<species>.tsx` + `src/art/pals/index.ts` | The island's two new Pals: the grumpy creature in the battle, and the reward Pal. |

## The story (6–8 pages)

- **Audience:** ages 4 to 7, read aloud. Keep sentences short and words concrete, with one idea per page. The text-to-speech voice reads it, so it must sound natural spoken: no symbols, no emoji, no "&" or "/". Write numbers as words.
- **Faith:** grace first, with obedience as a loving response. **God is never drawn as a person**: His presence is light (`Glow`, `Rays`, `Sparkles`). Jesus is drawn as a person (`PEOPLE.jesus`). Stay true to the Bible, but tell it simply. Leave out anything frightening.
- **The first page** is read as "<title>. <page 1>", so a title has no "!".
- **End** with what the story shows about God ("God always keeps His promises!").

## The story pictures

- Each page is an 800 x 450 `<Scene>` (see `src/art/scenes/kit.tsx`), built from the kit's props and from `Person` (`src/art/people.tsx`). **Reuse before you draw.** When you need something new (a prop, an animal), add it to the kit so the next island gets it too.
- **People** come from presets in `PEOPLE`. A character looks the same on every page and every island: the same clothes, hair and colors. The player and their family come from `usePlayer()`.
- **Things in pictures** that already have a drawn item (`#gallery/items`) can be placed with `<Emoji e="🐑" x y size />`, and the drawing is used.
- **Every page must match its words.** If the text says "five loaves", draw five. If it says "the dove came back with an olive leaf", draw the leaf. Anything named in the text should be visible.
- **Anatomy:**
  - Animals have two eyes, the right number of legs, and wings at the sides of the body (not sticking out of the back), with tails at the back.
  - Nothing floats unless it flies. Feet touch the ground, and nothing important is cut off at the edge.
- **Living pictures:** wrap 2–4 things per page in `<Tap say="Baa!" sfx="pop">…</Tap>`. Tapping makes them hop, and their line is spoken when the narrator isn't mid-sentence. Never put a CSS class on an element that has a `transform` attribute; wrap it in a `<g>`.
- **Motion** uses the existing classes in `styles.css` ("Story scenes"): `sc-float`, `sc-sway`, `sc-wing` and others.

## Activities (2–4 per island, then the verse, battle and reward)

All the step kinds are in `src/data/islands.ts`: `pairs`, `practice`, `sequence`, `sort`, `quiz`, `count`, `trace`, `maze`, `verse`, `battle` and `reward`.

- **Pictures.** Activity pictures are `{ emoji, say, art? }`. The emoji names a drawn item, and the narrator says `say`. **The picture must show exactly what's said.**
  - "Fish and birds" needs a picture with fish *and* birds.
  - "Baby Jesus in the stable" needs the baby in the stable.
  - When no item fits, add one to `src/art/items/` (see that folder's files for the style) rather than settling for a near-miss emoji.
- **Story cards.** To retell the story (put in order, story questions), use the story's own pictures: `art: 'story:<id>:<page>'`.
- **Spoken text** follows the same rules as the story: no emoji or symbols. The tests check this.
- Every island should teach something. Use one reading or number practice, and pick its `theme` emoji from the story (raindrops, stars, fish).

## Memory verse

Use the World English Bible, word for word, split into 2–4 chunks a child can build in order. Keep it short.

## The two new Pals

Every island adds two Pals, and each Pal belongs to one island only (the tests check this):

- **The grumpy creature in the battle.** It joins the Ark when it's befriended.
- **The reward Pal.**

For each one:
- **In `pals.ts`:** three stages, with xp 0, 100 and 300. Give it moves using the listed effects, a fruit of the Spirit, and an intro that starts "is a".
- **The art:** one species file drawing all three stages in a 200 x 200 box. Use the shared helpers in `src/art/kit.tsx` (`useShade`, `CuteFace`, `Shine`, `Anim`) so it matches the other Pals. Each stage adds something new: a bigger size, an accessory, a crown or wings.

## Before it ships

1. Run `npx tsc -b` and `npm test`.
2. Render the pictures at 2x and look at every one:
   `node scripts/film/gallery.mjs <out> scenes/<id> --scale 2` and `node scripts/film/gallery.mjs <out> pals --scale 2`.
3. Open `/#review/<id>` and read each page beside its picture, and each activity's pictures beside their words.
4. Get a fresh review from someone who didn't draw it, using the checklist in this guide. Fix everything marked HIGH or MED.
5. Play it through on an iPad, or with `node scripts/film/play.mjs <out> <id> <step>` for each step.
