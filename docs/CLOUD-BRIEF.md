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
6. **Billing in Stripe test mode (BUSINESS-PLAN §1 and §4, §10 step 5).**
   - **Where it runs.** A separate "Ark Pals" Stripe account in Blake's organization, using its **sandbox**, "Ark Pals sandbox" (already made), not the shared test mode.
   - **Library.** The official `stripe` Node SDK (22.6.0), on API version `2026-08-26.dahlia`, with one Stripe client instance; don't set a global key.
   - **Keys.**
     - A **restricted key** (`rk_`) with only the permissions the code needs. List them in DEPLOY.md.
     - Add `npm run set-stripe-key`, modelled on `server/set-email-key.mjs`. It saves `STRIPE_KEY` to `/opt/Carter/.env` and never prints it.
     - Keys never go in code, the client or git.
   - **Catalog.** `npm run stripe-setup` creates or updates everything, keyed by `lookup_key`, so it's safe to run twice:
     - The products: "Ark Pals Family" at $9.99/mo and $79/yr; "Ark Pals Grace" at $4.99/mo, a separate Product because it's a separate choice; and "Sponsor a Family" at $9.99/mo.
     - 100%-off coupons for 6 and 12 months, used for the Grace codes.
     - The webhook endpoint `https://spiritflow.church/stripe/webhook`, created through the API. The script saves its signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`.
   - **Checkout.**
     - Checkout Sessions in subscription mode. Never pass `payment_method_types`.
     - `allow_promotion_codes: true` and a 7-day `trial_period_days`.
     - `integration_identifier` set to `arkpals-checkout-` plus 8 random letters.
     - The yearly plan is shown first. The Grace price is offered kindly ("This price helps our family right now"), with no questions asked.
   - **Billing page.** Stripe's Customer Portal, opened from the Parent Corner, for cancelling, changing the card and receipts.
   - **Webhooks are required.**
     - Verify the signature on the raw body.
     - Handle `checkout.session.completed`, `checkout.session.async_payment_succeeded` (check `payment_status`), `customer.subscription.created`, `customer.subscription.updated` and `customer.subscription.deleted`, `invoice.paid` and `invoice.payment_failed`.
     - Match each event to a family through the Stripe **Customer ID** saved on the family, not through metadata.
     - Make the handlers safe when the same event arrives twice.
   - **Access.**
     - The family is what pays: save its plan, status and paid-through date.
     - The game checks access when it's online and allows 7 days offline.
     - **Enforcement stays off** behind `BILLING_ENFORCED` (off by default) until Blake turns it on.
     - The first family, and any family the owner marks as comped (the church beta), is always free.
   - **Owner dashboard** (first family only):
     - Make batches of Grace codes: single-use promotion codes on the 6- and 12-month coupons. Show them for printing or copying.
     - Show how many families are on each plan. It must never show children's data.
   - **Sponsor a Family.** Each paid `invoice.paid` adds one Grace code to the owner's pool. Build this last, and leave it out if it gets complicated.
   - **Tax.**
     - Build `automatic_tax` support, but behind a `STRIPE_TAX` setting that's off.
     - Prices use `tax_behavior: 'exclusive'`, and the product tax code comes from a setting. Don't hardcode a `txcd_`; Blake picks it from Stripe's list.
     - DEPLOY.md must say that no tax is collected until Blake sets a head office address and has an active registration.
   - **Tests.** Signed test events for every webhook, the access rules, and the offline grace period. Add a DEPLOY.md section with exactly what Blake does: make the restricted key in "Ark Pals sandbox", `set-stripe-key`, `stripe-setup`, and test card 4242 4242 4242 4242.
7. **Hand back.** Update `docs/GAME-PLAN.md` §9. Then write a short note at the end of this file: what changed, any new spoken lines, anything the local thread must do (warm-up, voice-script pages, server changes) and anything that needs Blake's decision.

## Later (not now)

Church licenses, and turning on `BILLING_ENFORCED` and `STRIPE_TAX`: Blake decides these closer to launch.

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
