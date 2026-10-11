# Brief for the Ark Pals (Cloud) thread: wave 8

Blake greenlit this on Oct 11, 2026. The cloud thread does the building and checking. The local thread (on Blake's laptop) does what needs the server: narration warm-up, the voice script, deploys and the production test.

## Start here

- Repo: github.com/blakemarchal/Carter. Read `README.md`, `docs/GAME-PLAN.md` (§4 learning, §8 technology, §9 progress) and `docs/BUSINESS-PLAN.md` (§5 privacy, §7 rollout).
- Base: **`blake/wave7`** (7029a73), which has everything that's live, plus the polish round and Grumbleshade's arc. Your `blake/learning-backbone` was branched before those. It merges cleanly, but check it against the new content.
- Work on a new branch, **`blake/wave8`**, made from `blake/wave7`. Push it after each item so the local thread can pick it up.
- Before each push: `npx tsc -b` is clean and `npx vitest run` passes.

## Rules

- Grace first, the World English Bible for verses, no copyrighted tunes or recordings.
- No child's name in the code. Players, birthdays and family all come from the profiles.
- Spoken text follows the existing narration rules (see the tests). Every new spoken line is a fixed string, or is built from names the way the existing lines are, so the local thread can voice it ahead of time.
- Don't change `deploy/`, `server/` secrets handling or anything that reads `.env`. Don't deploy.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Items, in order

1. **Integrate.** Merge `blake/learning-backbone` into `blake/wave8`. Also bring in `docs/legal/` (PRIVACY, TERMS, DATA-SECURITY) from `blake/email-signin`. Copy only those three files; that branch's older code is already in wave7.
2. **Fresh-eyes review of the learning backbone.** Have a reviewer who didn't write it play every new exercise kind at every level, at iPad size (`scripts/film/` shows how). Check that the answers are right, the levels are right for ages 4–7, the drag targets are easy for small fingers, and the narration matches the screen. Fix what it finds.
3. **Placement game (GAME-PLAN §4).** A short, friendly first-time game (about 2–3 minutes, no "test" feel) that sets each player's starting reading and math levels. Parents can rerun it or set the levels in the Parent Corner. It's skipped for players who already have progress.
4. **Automated playthroughs in Safari's engine (GAME-PLAN §8).** Use Playwright with WebKit at iPad size and touch. It plays one visit of every island, a battle, the kitchen and a practice round of each learning kind. It fails on console errors and saves screenshots. Add `npm run e2e`, plus a GitHub Actions workflow that runs it on pushes to `blake/*`.
5. **Privacy-first play stats (BUSINESS-PLAN §5, GAME-PLAN §8, decision 4).**
   - Off until a parent opts in (Parent Corner).
   - First-party only, no outside services, totals only: counts per island, visit or activity for starts, finishes, replays and wrong-first-tries. No free text and nothing that identifies a child.
   - The server endpoint adds them into the family's data. Delete and export include them.
   - An owner-only summary page.
   - Update `docs/legal/PRIVACY.md` to say exactly what's kept.
6. **Hand back.** Update `docs/GAME-PLAN.md` §9. Then write a short note at the end of this file: what changed, any new spoken lines, anything the local thread must do (warm-up, voice-script pages, server changes) and anything that needs Blake's decision.

## Later (not now)

Billing in Stripe test mode waits until Blake creates the separate Ark Pals Stripe account.

---

## Hand-back from the cloud thread (Oct 11, 2026)

Everything is on **`blake/wave8`** (made from `blake/wave7`, pushed after each item). `npx tsc -b` is clean and `npx vitest run` passes (475 tests). `npm run e2e:chromium` passes 36 of 36 on the final branch.

### What changed
1. **Integrated.** The learning backbone is merged, and `docs/legal/` (PRIVACY, TERMS, DATA-SECURITY) is copied from `blake/email-signin`.
2. **Learning backbone reviewed and fixed.** A fresh reviewer played every exercise at every level, inside islands (Elijah, Pentecost, Zacchaeus) and in a battle. Fixes:
   - An idle hint no longer lowers her level.
   - The number line counts back in the numbers its bubble shows.
   - Each clock moment has its own hour.
   - A battle doesn't repeat a question.
   - Numbers levels 4 and 5 now say in the Parent Corner that they also count on past 100.
3. **Placement game.** It's for new players only, right after they choose a Pal. It's a treasure hunt with no right or wrong, plus a "Not sure" button, and it sets both levels in 4–10 questions. It's skipped for anyone with progress, and the Parent Corner has a "Find my levels again" button. (`src/learn/placement.ts`, `src/screens/Placement.tsx`.)
4. **Automated playthroughs.**
   - `npm run e2e` runs in WebKit and `npm run e2e:chromium` in Chromium.
   - `.github/workflows/e2e.yml` runs on pushes to `blake/*`, with screenshots in the artifact.
   - In the cloud only Chromium could run, because the WebKit download is blocked. The first GitHub run is the first WebKit run.
   - `vite.config.ts` ignores `e2e-results/`.
5. **Play stats, reworked.**
   - Opt-in per device by a parent.
   - Counts per day only: starts, finishes, replays and wrong first tries per island, visit and activity kind. Names are checked strictly on the device and on the server.
   - Kept in the family's own `play-totals.json` for 400 days, included in the family's download, and deleted with the family or by a parent (`DELETE /stats`).
   - `GET /stats` is an owner-only page. It shows sums across families, and nothing until at least five families share.
   - `/family` now says `owner`, and the privacy and data-security drafts describe all of this.
6. **Also:**
   - `npm run learning-lines` writes `preview/learning-lines.json`: every line the learning questions and the placement game send to the narrator (1,356 today, older question lines included), ready for the warm-up.
   - A Parent Corner typo is fixed ("This This device").

### New spoken lines
- **Learning questions and exercise prompts:** run `npm run learning-lines` and warm `preview/learning-lines.json` with `scripts/warm-narration.mjs`. Lines already made are skipped.
- **Lines spoken inside the exercises as they're played** are fixed strings in `src/learn/topics/*.tsx` and aren't in that list. Mom's script needs them too. They're built from:
  - letter sounds and "f, o, x: fox!";
  - "Put the words in order to tell the picture!";
  - "That says 5 o'clock. Try again!";
  - "Oops, too far! Let's count back.";
  - "You landed on 13!";
  - "We're adding, so hop forward!" and "We're taking away, so hop back!";
  - "Oops, that's too much! Here is your dime back.";
  - "That's just right. Thank you!";
  - "Short, longer, longest!";
  - the market lines in `MARKET` and the clock moments in `MOMENTS`.
- **Clock moments changed:** wake up at 6, breakfast at 7, dinner at 5, bedtime at 8.
- **Placement game:**
  - "<Pal> wants to go on a treasure hunt with you, <name>! Every puzzle you try finds a treasure. Tap Let's go!"
  - "First, some word puzzles!"
  - "Now, some number puzzles!"
  - the six praise lines (`PLACEMENT_PRAISE`)
  - "That's OK! Here's a treasure anyway. Let's try another one."
  - "What a treasure hunt! <Pal> had so much fun with you, <name>. Let's sail!"
- **Play stats:** none.

### For the local thread
- **Before deploying:** if Blake wants a copy of the old pooled play totals, `tar` `/var/lib/carter/stats` first. On its first start the new server deletes those day files (they mixed every family together, with the old names) and logs "Removed the old pooled play totals (N days)".
- **Families who opted in before must opt in again.** The old switch is cleared on the device, since the new totals count different things.
- **Warm the new lines** (above), and add the exercise and placement lines to Mom's voice script.
- **Nothing in `.env` or `deploy/` changed.** New server files are made when a family first sends totals.
- **After deploying:**
  - Check `/stats` as the owner (it should say fewer than five families).
  - Turn sharing on in the Parent Corner and play a visit.
  - Check the family download includes `playTotals`.
  - Play the placement game with a brand-new test player.

### For Blake to decide
1. **Numbers level 10 is easier than level 9.** It's mostly measuring. Recommended: move longer/shorter to level 3 (next to more/fewer) and make level 10 half hours plus setting the clock as review.
2. **Pictures:** the "bug" is a caterpillar (a ladybug would be clearer), and the "rat" looks like a mouse (redraw it, or drop it from the word lists).
3. **WebKit as a required check:** keep the playthroughs as a required check once a WebKit run passes on GitHub.
4. **Content to look over:**
   - the 19 built sentences;
   - the reading sentences and stories, including "We sing a song to God." and "We fold our hands. We thank God for our food.";
   - the market prices (2 to 20 cents);
   - "Singing time is at 10 o'clock".
