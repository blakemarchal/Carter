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
5. **Extend the play stats that already exist** (`src/lib/stats.ts`, `server/stats.mjs`, `POST/GET /stats`): opt-in, counts only, shared totals, readable only by the first family.
   - Add totals for the learning backbone: each exercise kind and level gets started, finished and first-try-right counts, so we can see where kids struggle. Also count placement results by level.
   - Keep the same rules: no names, players, devices, answers or times of day.
   - Add an owner-only summary page that reads `GET /stats`, if there isn't one yet: sorted tables with the weakest spots first.
   - Make `docs/legal/PRIVACY.md` say exactly what's kept.
6. **Hand back.** Update `docs/GAME-PLAN.md` §9. Then write a short note at the end of this file: what changed, any new spoken lines, anything the local thread must do (warm-up, voice-script pages, server changes) and anything that needs Blake's decision.

## Later (not now)

Billing in Stripe test mode waits until Blake creates the separate Ark Pals Stripe account.
