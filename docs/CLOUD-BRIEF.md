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

### Update (Oct 11, later): billing and the approved follow-ups

Also on `blake/wave8` (pushed as `blake/billing` too). `npx vitest run` passes (524 tests), and `npm run e2e:chromium` passes 36 of 36. The WebKit workflow passed on GitHub (runs 2 to 4).

**What changed**
- **Billing in Stripe test mode (item 6), off by default.**
  - `server/billing.mjs`, `npm run set-stripe-key`, `npm run stripe-setup`, `POST /stripe/webhook`.
  - The owner dashboard at `/billing/owner`.
  - In the Parent Corner, a plan section (`src/components/FamilyPlan.tsx`). A grown-up-facing "The Pals are resting" screen shows only when plans are enforced and the family has none.
  - `stripe@22.6.0` is a dependency. Billing data lives in the family database and is in the family's download. Deleting a family deletes its Stripe Customer first.
- **Blake's decisions:**
  - Longer or shorter moved to numbers level 3, and level 10 is half hours plus setting the clock.
  - "bug" is the ladybug in all learning content, and the rat is redrawn.
- **Play totals** also count each learning exercise kind and level and each practice skill and level (started, finished, right first time), plus placement results by level. The owner page lists the weakest spots first (rows with fewer than 10 starts aren't ranked).

**For the local thread**
- **Before or with the deploy:** run `npm install --omit=dev` on the server. `deploy.sh` doesn't ship `node_modules`, and billing needs `stripe`. Consider making `deploy.sh` send `package-lock.json` and run `npm ci --omit=dev`.
- **Blake's steps, in order** (details in `deploy/DEPLOY.md`, "Billing: Stripe, in test mode"):
  1. Make a restricted key in **Ark Pals sandbox** with these permissions:
     - Customers W
     - Checkout Sessions W
     - Customer portal W
     - Subscriptions R
     - Products W
     - Prices W
     - Coupons W
     - Promotion Codes W
     - Webhook Endpoints W
  2. `npm run set-stripe-key`.
  3. Optionally set `STRIPE_TAX_CODE`.
  4. `npm run stripe-setup`, then restart.
  5. Test with a second family and card 4242 4242 4242 4242.
- **New spoken lines:** none. The resting screen isn't spoken.
- **After deploying:**
  - Check Stripe's webhook deliveries are 200.
  - Make Grace codes on `/billing/owner` and redeem one.
  - Play a practice round and a placement game on a device that shares totals.

**For Blake to decide**
1. **Grace-code families still give a card, and renew at $9.99 after the free months unless they cancel.** Not taking a card would also drop it during everyone's free week, so it's left as is for now. I'd recommend changing this before the church beta, so a Grace family is never surprised by a charge. One way is to make a Grace code checkout collect no card and end when the free months do.
2. **WebKit as a required check:** in GitHub, go to Settings → Rules → Rulesets → New branch ruleset. Target the branch you deploy from (`blake/happy-fermi-dkah27`), turn on "Require status checks to pass", and add **Playthroughs (WebKit)**.
3. **Ranking minimum:** a row needs 10 starts before it's ranked (`MIN_RANKED` in `server/stats.mjs`).

---

## Hand-back: wave 9 (Oct 11, 2026)

On **`blake/wave9`**, made from `blake/billing`, with `blake/wave7`'s Parent Corner wording fixes (c8842d7) merged in. `npx vitest run` passes (544 tests).

**Blake's four approvals.** Items 1 to 3 were already done on `blake/wave8` / `blake/billing`, so wave 9 carries them:
1. Longer or shorter is at numbers level 3, beside more or fewer. Level 10 is half hours, with hours to review and setting the clock as its exercise.
2. "bug" is the ladybug everywhere in the learning content, and the rat is redrawn and clearly a rat. Its word-family card was checked beside the mouse.
3. **WebKit as a required check:** the workflow passes on GitHub, but none of the cloud's tools can set branch rules. Blake clicks: Settings → Rules → Rulesets → New branch ruleset → target the deploy branch → "Require status checks to pass" → add **Playthroughs (WebKit)** → Create.
4. The flagged content is left as is.

**No emoji in the placement game or learning content**
- **The placement game's puzzle pictures were already drawn.** They go through `Pic`, which draws the item library's picture, and this was checked on screen. The raw emoji left were its own icons: the 💎 in the treasure bag, and the 📖, 🔢, 🗺️, 🤔 and ⛵ on its labels and buttons.
- **New drawings** in `src/art/items/learn-placement.tsx`: a gem, a book, number blocks (1 2 3) and a "not sure" thought bubble. All of the placement game's icons are now drawn, sized to sit with their words, and checked on screen.
- **Learning content audit:** every question and exercise at every level shows only drawn pictures. A new test, `src/__tests__/learn-drawn.test.ts`, keeps it that way.
- **Left as is:** the 🔊 "hear it again" and ⬅️ back buttons. They're the same in every activity across the whole game, so drawing them is a whole-game choice.

**New spoken lines:** none. **Server work:** none beyond wave 8's billing steps. **For Blake:** the Grace-code card question from the billing hand-back is still open.

---

## Next: Grace codes take no card (Blake approved, Oct 12, 2026)

On a new branch **`blake/grace-nocard`**, made from `blake/wave7`. Billing is live in the sandbox with **Stripe Managed Payments ON**: Stripe is the merchant of record. So Checkout must not send `automatic_tax`, `customer_update`, `payment_method_types`, `tax_id_collection` or `invoice_creation`. The products carry `txcd_10201004` (`STRIPE_TAX_CODE` in .env).

- **Goal:** a family with a Grace code never enters a card and is never charged. The plan simply ends when the free months do, and the family can then choose a plan or ask for another code. Everyone else keeps the card and the 7-day free week, unchanged.
- **Suggested shape:**
  - In "Your family's plan", add an "I have a Grace code" field. The server checks the code (active, unused, one of our Grace coupons).
  - It then makes a Checkout Session for the Family monthly price with:
    - `payment_method_collection: 'if_required'`;
    - a trial the length of the code (6 or 12 months) instead of the coupon;
    - `subscription_data.trial_settings.end_behavior.missing_payment_method: 'cancel'`.
  - The code is marked used once the session completes (deactivate the promotion code, or record it). Then the same code can't be used twice, and the "Add promotion code" box can't stack it on a paid plan.
  - If Managed Payments refuses any of this, find the Stripe-native way that works with it (`stripe docs`, or docs.stripe.com/payments/managed-payments). Say in the hand-back what you chose.
- Before the free months end, the family sees a gentle note in the Parent Corner. No surprise charge is possible.
- **Tests:** a Grace checkout has no card and ends with the free months. A normal checkout still takes a card and has the 7-day trial. A used code is refused. Also cover the webhooks for the trial ending without a card.
- Update DEPLOY.md if Blake has anything to do, and the owner page's wording for codes.
- Hand back the same way as before.

---

## Hand-back: Grace codes take no card (Oct 12, 2026)

On **`blake/grace-nocard`**, made from `blake/wave7` (5534ea1). `npx tsc -b` is clean and `npx vitest run` passes (555 tests, 11 of them new for this item).

**What a Grace family sees**
- In "Your family's plan", a new **I have a Grace code** field (any case; spaces or dashes) with a **Use my code** button. Stripe's checkout opens for the Family plan, free for the code's 6 or 12 months, and **asks for no card**.
- During the free months the Parent Corner reads "Family plan, a gift from a Grace code · free until …" and "No card, and no charge. When the free months end, the plan simply ends."
- **14 days before the end**, a gentle note says the date and that nothing will be charged. To keep going, they can add a card on the billing page (the plan carries on at $9.99 a month), or once the free months end, choose a plan or enter another code.
- **After it ends**, a kind word, then the plans and the code field again. A family that has had a Grace plan doesn't get a second 7-day free week on a paid plan.
- Refused codes are explained:
  - not one of ours (404);
  - already used (410);
  - at another family's checkout right now (423);
  - 10 wrong codes in an hour (429);
  - the family already has a plan (409).
- Everyone else is unchanged: a card, and the 7-day free week once.

**How it works (`server/billing.mjs`)**
- **Grace codes are now ours, kept in SQLite, not Stripe promotion codes.**
  - The owner page and Sponsor a Family make them the same way as before (GRACE6-XXXX-XXXX), with no Stripe call.
  - Codes made before this change are in the same table, so they still work in the new field.
  - `stripe-setup` no longer makes the coupons. The old coupons and promotion codes in the sandbox are unused now: archive them or leave them.
- **The Grace Checkout Session** (`POST /billing/grace {code}`) uses the Family monthly price with:
  - `payment_method_collection: 'if_required'`;
  - `subscription_data.trial_end` = the code's months as calendar months (Aug 31 + 6 is the end of February);
  - `trial_settings.end_behavior.missing_payment_method: 'cancel'`;
  - metadata naming the code's row id (never the code itself);
  - `expires_at` in 30 minutes.
  No coupon or discount is sent.
- **Single use.**
  - While a family is at checkout, the code is held for that family for 35 minutes, longer than the session lives, so two families can't both redeem it.
  - It is marked used when the plan starts. Either `checkout.session.completed` or `customer.subscription.created` does this, whichever arrives first.
  - The owner page shows when each code was used, not by whom.
  - Deleting a family keeps its code used but drops who used it.
- **No stacking:** paid checkouts no longer set `allow_promotion_codes`, so there's no "Add promotion code" box. A Grace code can't go on a paid plan, and nothing else used that box. If Blake wants launch promo codes later, it's one line to turn back on.
- **Managed Payments:**
  - Checkout no longer sends `automatic_tax` or `customer_update`, and never sent `payment_method_types`, `tax_id_collection` or `invoice_creation`. A test checks all five on every kind of checkout.
  - `STRIPE_TAX` isn't read any more.
  - Paid checkouts now say `payment_method_collection: 'always'` outright. That was already Stripe's default.
- **Trial ending without a card:** Stripe deletes the subscription. `customer.subscription.deleted` (already one of our 7 events) marks it canceled, and the family can choose again. No invoice is made, so no charge is possible. No new webhook events are needed, so the endpoint is unchanged.
- **I chose `payment_method_collection: 'if_required'` with a `trial_end` trial.** Stripe's Managed Payments changelog names `if_required` as the way to start a free trial without a payment method. That is the only confirmation: the cloud thread can't reach docs.stripe.com (the network blocks it), so it couldn't read the rest of the Managed Payments docs. Stripe's Trial Offers can't be used through Checkout, so this uses the ordinary trial.
- **Worth checking in the sandbox:** a Grace checkout really shows no card field under Managed Payments, and a card added on the billing page during the free months keeps the plan going. DEPLOY.md's step 6 walks through both.

**Owner page wording:** "Each code works once: a parent types it in Ark Pals (Parent Corner → Your family's plan → I have a Grace code). The family plays free for 6 or 12 months with no card at all, and then the plan simply ends: no one is ever charged." The printed codes page says the same in one line. A new "Free with a Grace code" row counts those families.

**Docs:** DEPLOY.md's billing section covers Managed Payments, Grace codes and the trimmed key permissions. It also has new steps 6 to try a code and, optionally, the free months ending. BUSINESS-PLAN.md now says Grace codes take no card.

**For the local thread**
- **Deploy** as usual. The database adds its new columns on start (`billing.grace`; `grace_codes.used_by`, `used_at`, `held_by`, `held_until`) and a unique index on codes.
- **Blake doesn't need to change anything in Stripe or `.env`.**
  - Optionally, set the restricted key's Coupons and Promotion Codes permissions back to None.
  - Optionally, delete the `STRIPE_TAX` line from `.env` (it does nothing now).
  - Re-running `npm run stripe-setup` isn't needed.
- **Production test** (DEPLOY.md step 6):
  - Make a code on `/billing/owner`.
  - In a second new family, enter it under "I have a Grace code".
  - Check Stripe asks for no card, the plan shows "a gift from a Grace code", the dashboard shows the code used, and the same code is refused the second time.
  - Check webhook deliveries are 200.
- **New spoken lines:** none. The Parent Corner isn't spoken.

---

## Next: wave 10, our family's voices (Oct 12, 2026)

On a new branch **`blake/voices`**, made from `blake/wave7`. This builds BUSINESS-PLAN §2 (the voice plan), which is planned but not built. Read §2 and §3 first.

**Today:**
- A line is spoken by one of three things, in this order: a family recording (exact text only; one voice per family; Parent Corner → Family voices, story pages and bedtime only), then live Grok `/tts`, then the device voice. See `src/lib/speech.ts:146-169`.
- Lines with names (the child, Pals, the family cast) go to Grok as whole sentences, so **a child's name is sent to xAI**. Nothing is stitched.

**Goal:** Mom is the house narrator for every family. Dad and Carter voice some parts. Children's names are spoken without being sent anywhere. Live Grok becomes a build-time fallback only.

1. **Voices and roles.**
   - Recordings carry a **voice** (`mom`, `dad`, `carter`, and room for more) as well as the line fingerprint.
   - A **role** decides which voice speaks a line. By default:
     - `narrator`: Mom. Story pages, prompts, praise and learning.
     - `shade`: Dad. Grumbleshade's lines and the battle foe.
     - `pals`: Carter. Short Pal cheers and reactions, if they exist as lines.
   - Make the role table easy to change.
   - Keep each family's own recordings (Family voices) first in line, above the house narrator.
2. **House narrator.** The house set is shipped to every family:
   - the owner's recordings, kept on the server and stored per voice;
   - fetched like the narration clips, and cached for offline play.
   The order becomes:
   1. family recording;
   2. house recording for the line's role;
   3. a Grok clip made at build time (warmed cache);
   4. the device voice.
   Mom's existing Family voices recordings in the first family, the story pages, can be promoted into the house set with one owner action (same fingerprints).
3. **Stitching.**
   - Lines with `{name}`, Pal names, numbers (0–130), letters and letter sounds are stored as **templates with slots**.
   - A template is recorded once in two parts, before and after the slot.
   - The slot is filled from a **name library**: each name is recorded twice, mid-sentence and as an exclamation ("…, Carter." / "Carter!").
   - Play the parts back to back with tight gaps (Web Audio, trimmed silence).
   - If a name isn't recorded, the line goes to the device voice for that line only. Never send it to Grok.
   - Pal names, numbers and letters are fixed sets, so record them all.
4. **The name library.** Build a list of the most common US children's first names from the Social Security Administration's baby-name data (public domain), births from about 2014 to the latest year. Start with the top 600 girls' and 600 boys' names, merged, with spellings that sound alike recorded once ("Aiden/Aidan").
   - The Parent Corner shows whether each player's name is in the library.
   - A family can record its own child's name in Family voices (two takes).
   - The owner's dashboard shows names families use that aren't in the library yet. Show counts only, and only when 3 or more families use the name.
5. **The recording studio** (owner only, iPad-friendly):
   - Choose a voice, then a queue: story pages, prompts, praise, learning, templates, names, numbers, letters or songs.
   - Line by line: big text, record / play back / retake, automatic silence trimming and level check, and keyboard or tap to go to the next line.
   - Progress per queue ("412 of 1,030"), and flags on lines whose text changed since they were recorded.
   - **Priority order:** what a child hears most comes first. Praise and prompts, then story pages, then learning, then names.
   - A printable script per voice and queue, made from the same data.
6. **Carter sings.** A song mode in the studio: she sings along with the "I sing!" flute version through headphones. The recording is placed on the song's existing word timings, so no tapping is needed. It plays as "Carter's version" in the sing-along.
   - **By default, Carter's voice is for our family only.** Only Blake can turn on sharing her songs or Pal lines with every family, per item.
7. **Privacy.**
   - Remove live `/tts` from the public build. Keep it on dev behind the owner, for warming only.
   - Update `docs/legal/PRIVACY.md`: no child's name ever leaves our server.
   - Add a voice release to `docs/legal/` for Mom, Dad and Carter (Carter's signed by her parents). It covers house use and is limited to Ark Pals.
8. **Tests:** template and slot matching, the playback order, no name ever reaching `/tts`, studio progress and changed-line flags, and the song timing placement.

Hand back the same way as before. Include how many lines each voice has to record per queue, and an estimate of minutes for each.

---

## Hand-back: wave 10, our family's voices (Oct 12, 2026)

On **`blake/voices`**, made from `blake/wave7` (363cdc5). It was pushed after each piece:
1. the name library;
2. the voice core;
3. templates and stitching;
4. the studio, its script and Carter's songs;
5. names in the Parent Corner;
6. these docs.

Checks: `npx tsc -b` is clean, `npx vitest run` passes (597 tests, 42 of them new), and the Chromium playthroughs pass (36 of 36). The studio and its song mode were also driven in Chromium with a fake microphone: record, trim, level, keep, sing along, nudge.

**What a line does now** (`src/lib/speech.ts`, `src/voice/resolve.ts`)
1. **The family's own recording** of the exact line (Family voices) plays first, as before.
2. **The house voice for the line's role** comes next, reading the whole line or stitched from recorded parts. Roles are set in `src/voice/roles.ts`, one table that's easy to change:
   - `narrator`: Mom;
   - `shade`: Dad, with Mom standing in;
   - `pals`: the child, with Mom standing in.
   Grumbleshade's swoop and finale and the foe's attacks are tagged `shade`. "Yes, please!" and "Hee hee! That tickles!" are tagged `pals`.
3. **A Grok clip made ahead of time.** `/tts` now only serves cached clips and never makes a new one. With `TTS_LIVE=1` on dev, the owner's device can still make clips live, for warming. A line that mentions any player, sibling, pet or customised parent name is never asked of `/tts`, and never preloaded.
4. **The device voice.**

**Stitching** (`src/voice/templates.ts`, `src/voice/stitch.ts`)
- There are 77 templates with `{name}`, `{pal}`, `{n}`, `{letter}` and `{sound}` slots. A line is split into sentences. Each run of sentences is either a whole recorded line or a template whose parts and slots are all recorded.
- The whole line stays in one voice. The one exception is a family's own recording of their child's name, which is used first.
- Parts play back to back through Web Audio, with silence trimmed. The gap is 40 ms within a sentence, 160 ms at a comma and 220 ms between sentences.
- If any piece is missing, nothing is stitched. A line with a family's name then goes to the device voice.
- **Numbers run 0–140, not 0–130:** counting past 100 goes up to 140.
- A test samples every learning level, so a changed line with a number or sound that loses its template fails the tests.

**Name library** (`scripts/name-library.mjs`, `src/voice/names.json`)
- It holds the top 600 girls' and 600 boys' names by births from 2014 to 2024, from the SSA national data. ssa.gov is blocked from the cloud, so I took the same SSA files from the `usbabynames` npm package (2.2.1, data to 2024). The script reads SSA's own `yobYYYY.txt` files, so Blake can rerun it on `names.zip`.
- Sound-alike spellings are merged ("Aiden", "Aidan" and "Ayden"; "Sara" and "Sarah"), while names said differently stay apart ("Maria" and "Mariah", "Eli" and "Ellie"). That leaves **1,062 names to record**.
- **The Parent Corner** says under each player whether the game can say their name: in the family's own recording, by the narrator, in the library but not recorded yet, or not in the library (then the iPad reads those lines, and the name is never sent).
- **Family voices** now records each child's name in two takes: the players, plus brothers and sisters from the cast.
- **The owner's list** (`GET /voice/names`, shown in the studio) has the children's names that 3 or more families use, with counts only. The ones missing from the library go first in Mom's Names queue, and once recorded they're stitched like library names.

**House set** (`server/house.mjs`)
- Clips are kept per voice in `STATE_DIRECTORY/house/<voice>/<fingerprint>`, with an `index.json`. Each clip records:
  - what it is (its key and the words read);
  - where it sits in the script;
  - its trim and gain;
  - whether it's shared.
- Families get a manifest, and the service worker keeps each clip after its first play (its address is versioned).
- The child's voice is private to the owner's family unless the owner ticks "Share with every family" on that clip.
- One owner action copies the first family's Family voices recordings into Mom's voice under the same fingerprints.
- **Voice ids are `mom`, `dad` and `child`, not `carter`,** so no child's name goes in the code. Blake names the voices in the studio ("Rename voice"); the names are stored on the server.

**The studio** (`src/screens/Studio.tsx`, owner only: Parent Corner → Family voices → 🎚️ Recording studio)
- Choose a voice and a queue. Each line shows big words; you record, listen, retake and keep. Silence is trimmed automatically, and the level is checked and set (with a warning when a take is too quiet or too loud).
- Space or R records and stops, P listens, Enter keeps, and the arrows move between lines.
- Each queue shows progress ("412 of 1,030") and estimated minutes, and flags lines whose words changed since they were recorded. "🖨️ Print this script" prints the same list.
- The script (`src/voice/script.ts`) comes from the game itself. The learning lines and the code's fixed strings are sampled into `src/voice/lines.gen.json` with a fixed seed by `npm run voice-script`; a test fails if the file is out of date.
- **Carter sings** (song mode): headphones on, she sings along with the flute. The song's start is measured in the recording (allowing for output latency), and her voice is laid on the flute at that point, so the song's own word timings light the words. Earlier and Later buttons fix any drift by ear. It plays in the sing-along as "<her voice's name>'s version", for our family only until shared.

**Lines to record, per voice and queue** (estimates include a listen-back and the odd retake: about 5 seconds a line plus 0.6 seconds a word, or 3 seconds for a name, number or letter)

| Voice | Queue | Lines | About |
|---|---|---|---|
| Mom | Praise | 15 | 2 min |
| Mom | Prompts | 368 | 1 h 30 |
| Mom | Story pages (434 pages, verses and bedtime, plus 1,029 short picture-tap lines) | 1,463 | 4 h 35 (pages about 2 h 10, taps about 2 h 25) |
| Mom | Learning | 446 | 56 min |
| Mom | Templates (parts) | 86 | 10 min |
| Mom | Names (1,062 children's names and 184 Pal names, two takes each) | 2,492 | 2 h 45 |
| Mom | Numbers (0–140, two takes) | 282 | 19 min |
| Mom | Letters (26 names and 26 sounds) | 52 | 3 min |
| **Mom in all** | | **5,204** | **about 10 h 20** |
| Dad | Prompts (Grumbleshade swoops in) | 3 | under 1 min |
| Dad | Story (the Easter finale) | 4 | 1 min |
| Dad | Templates | 4 | under 1 min |
| Dad | Names (Pal names, one take) | 184 | 12 min |
| **Dad in all** | | **195** | **about 15 min** |
| Carter | Prompts (Pal lines) | 2 | under 1 min |
| Carter | Songs (sung along, 31 songs) | 31 | about 1 h 50 |
| **Carter in all** | | **33** | **about 1 h 50** |

Praise and prompts first is about 1 h 30 of Mom's time and covers most of what a child hears. The picture taps are the most skippable: they fall back to the warmed Grok clips.

**Not covered, and why**
- Lines built from object names ("Where does the lion go?", "Drag the cookie here!") aren't in the script, because their combinations aren't fixed. They play the warmed Grok clip, then the device voice. Adding a template for any of them is one line in `templates.ts`.
- "<Pal> used <move>!" lines also fall back to Grok, since move names aren't slots.
- House clips are kept offline after their first play, not fetched ahead of time.

**Privacy and legal**
- `docs/legal/PRIVACY.md` now says no child's name ever leaves our server, and that xAI only made the game's fixed lines ahead of time. It also describes the names-in-use count (3 or more families, names and counts only, nothing kept).
- New `docs/legal/VOICE-RELEASE.md` (draft for legal review): one copy each for Mom, Dad and the child, the child's signed by both parents. It covers:
  - house use only, limited to Ark Pals;
  - no ads, no resale and no voice cloning without separate written agreement;
  - the child's voice for our family only, unless shared item by item;
  - withdrawal within 30 days.
  No names are in it; they go in when it's signed.

**For the local thread**
- **Deploy** as usual. The house folder is made on start, and there's nothing new in `.env`.
- **After deploying:**
  - In the first family's Parent Corner, open Family voices, then the Recording studio. Check the queues load with their counts.
  - Rename the voices.
  - Copy the Family voices recordings into Mom's voice.
  - Record a praise line, then play a practice round and hear it.
  - Check a player whose name isn't recorded hears "Way to go, …!" in the iPad voice, and that `/tts` gets no request with the name in it.
- **Narration warm-up:** there are no new fixed spoken lines this wave. From now on, any line that isn't warmed plays in the device voice until Mom records it, so warm before each content deploy.
- **New spoken lines:** none. The studio, the name notes and the sing-along label aren't spoken.

**For Blake**
- Sign the voice releases.
- Rename the voices in the studio.
- Decide whether to share any of Carter's songs.
- Optional: rerun `node scripts/name-library.mjs <unzipped names.zip>` from SSA's own download to confirm the list (it should match).

---

## Next: wave 11, a bug and polish pass, and Grok for every line (Oct 12, 2026)

On a new branch **`blake/polish`**, made from `blake/wave7`. Blake played production (arkpals.world) as a new owner and asked for a serious bug and polish pass. **Everything spoken should be Grok until our own recordings replace it.** Today some lines play in Grok and some in the device voice, which sounds bad.

### A. Voice: Grok everywhere, without sending a child's name
- **Why the device voice still plays:**
  1. Lines that aren't in the warmed cache (`/tts` is cached-only now). Examples: object-name lines ("Where does the lion go?", "Drag the cookie here!"), "<Pal> used <move>!", and anything built at runtime.
  2. Lines with a family name (by design: names never go to `/tts`).
  3. A clip slower than 4 seconds.
- **Letter sounds:** Blake hears "n" as "N-N-N" (the device voice spells out `say: 'nnn'`), and "t" sounds like "two" (likely Grok reading `/tə/`). See `src/lib/spoken.ts:23-31`.
- **Make Grok a house voice (`grok`)**, ranked after our real voices and before the device voice. Stitch Grok clips exactly as the house voices are stitched (templates, slots, `src/voice/*`), so name lines are Grok too:
  - Grok clips for every template part, numbers 0–140, letter names, **letter sounds as stand-alone clips**, Pal names, move names, item names, and **all 1,062 library names**. The library is the SSA's public list, so no family's data goes to xAI.
  - Add templates for the combinatorial lines (`{item}`, `{move}` and any others you find), so they stitch instead of falling through.
  - Write **`scripts/warm-house-grok.mjs`**, which the local thread runs on the server (only it can reach xAI). It makes every clip the house `grok` voice needs, skipping ones already made, never prints the key, and writes the house index. It takes a list of what to make, so it can be re-run after each wave.
  - Remove the 4-second race for lines that are now house `grok` clips. Preload the next lines as now.
  - **A child's name that isn't in the library** plays in the device voice, as now. Add a Parent Corner choice, **off by default**: "Let the narrator say <name>". It sends that one name to xAI once to make its two clips, and asks for the parent's consent in plain words. Update `docs/legal/PRIVACY.md`.
  - **Letter sounds:** pick the Grok prompt per sound so it says the sound and not the letter name ("tuh" not "two"; a held "nnn" for n, m, s, f, l, r, v, z). Add an owner-only **Sound check page**: every letter sound, letter name and number 0–20 with a ▶ button, so Blake can listen and flag bad ones. Flagged clips get re-made by the warm script with a different prompt.
- **A voice coverage log (owner devices, and dev only):** each time a line falls to the device voice, the client sends the line (never one with a family name) to a small owner-only endpoint. Show the list in the studio, so the local thread can add each line to the next warm-up. Add a test that walks every island step and learning level and fails if a line has no source but the device voice (names excepted).

### B. Bugs Blake hit
1. **The boat sits at a locked island.** A new player's `mapAt` defaults to `'noah'` (`src/lib/progress.ts:111`), from before the map was reordered. Default to the first island of the first sea. Repair saves whose `mapAt` is an island that isn't open yet: put the boat at the next open island.
2. **A family link opened on a signed-in device silently moves that device into the new family.** Blake's owner computer joined "Test Fam". The start link and invitation links must say "This device is signed in to <family>". Offer "Open this on another device or a private window" and "Leave <family> on this device and start the new family" (with a confirm). Never move the first family's last device without that confirm.
3. **The owner's grown-up is named "Grown-ups"** (the first-family bootstrap). After the first password sign-in, ask "What should we call you?" and then for an email.
4. **"Check for updates" / "Reload app" gives no feedback** until the reload. Show a spinner and "Updating…" at once. Disable the button, and show "You have the newest version" when there's nothing new.

### C. A polish pass over every screen
Render every screen at iPad landscape (1180×820), iPad portrait (820×1180) and phone (390×844). Fix:
- **Centering and spacing.** The treasure hunt has a big gap between the Pal and its words, and the Pal sits low. Many things are off-centre. Use one spacing scale, and centre content blocks.
- **The Parent Corner needs a real layout.** Group it into clear sections with headings and short help:
  - Players;
  - Grown-ups and devices;
  - Your family's plan;
  - Voices and recordings;
  - Learning levels;
  - Play and limits;
  - Data and privacy;
  - App.
  Use one style for inputs, selects and buttons (the invite row's native select and truncated placeholder look broken). Make it collapsible, or use a side menu on wide screens.
- **Player avatars are emoji.** Use drawn avatars from the item library, as the game plan's no-emoji rule says, or confirm with Blake if that's large.
- Comments still call the child "she" in places (`progress.ts:21` and others). Make them neutral.
- Then a **fresh-eyes bug sweep**: play a new owner, a new customer family, a placement game, one visit of each sea, a battle, the kitchen, the sing-along and bedtime on WebKit at iPad size. Fix what's broken, and list what you leave.

### Hand back
The same way as before. Also list:
- exactly what the local thread must run: `warm-house-grok.mjs` and its list, the warm-up, and anything in `.env`;
- the Grok clip count to make (a rough xAI character total);
- before and after screenshots of the Parent Corner and the treasure hunt.

---

## Hand-back: wave 11, a bug and polish pass, and Grok for every line (Oct 13, 2026)

On **`blake/polish`**, made from `blake/wave7` (ddb7a66). It was pushed after each piece:
1. the four bugs;
2. Grok as a house voice;
3. the name choice, the sound check and the coverage log;
4. the polish;
5. this hand-back.

Checks: `npx tsc -b` is clean, `npx vitest run` passes (611 tests, 14 of them new; several older ones were extended), and the Chromium playthroughs pass (36 of 36). WebKit can't be downloaded in the cloud, so the WebKit playthroughs run in CI on this push.

### What the local thread must run

1. **Deploy** as usual. There's nothing new in `.env`. (`TTS_LIVE=1` only exists for the dev site; production never sets it.)
2. **Make the house Grok voice on the server**, as root, from `/opt/Carter`:
   ```bash
   node scripts/warm-house-grok.mjs --dry-run   # expect about 6,844 clips, about 171,000 characters
   node scripts/warm-house-grok.mjs
   ```
   - The list is `dist/voice/grok-list.json`, which ships with the deploy.
   - The key is read from `.env` and never printed.
   - Files go to `/var/lib/carter/house/grok` and are handed to `www-data`. The running server picks the new index up by itself, so no restart is needed.
   - Clips already made for the old `/tts` cache are copied, not paid for again, so the real total is lower.
   - **Cost:** about 171,257 characters at $15 per million, roughly **$2.60** once.
   - It's safe to run again after any wave: it only makes what's missing, plus anything flagged.
3. **After Blake's sound check:** run the same command again to remake the flagged clips with their next prompt. Later, `--missed` also makes the lines the owner's devices heard in the device voice.
4. The old warm-up (`scripts/warm-narration.mjs`) isn't needed any more.

**What's in the Grok list (6,844 clips):**

| Kind | Clips |
|---|---|
| Children's names (1,062 × 2 takes) | 2,124 |
| Story-picture taps | 1,028 |
| Names of things, for slots | 694 |
| Things said on their own | 640 |
| Learning lines | 446 |
| Pal names (× 2 takes) | 368 |
| Activity lines | 336 |
| Story pages | 305 |
| Numbers 0–140 (× 2 takes) | 282 |
| Moves | 188 |
| Template parts | 156 |
| Memory verses | 111 |
| Other fixed lines | 114 |
| Letter names | 26 |
| Letter sounds | 26 |

### A. Voice: Grok everywhere, with no child's name sent
- **Grok is now a house voice, `grok`,** last in every role's list: our recordings come first, then Grok, then the device voice. It's stitched exactly like ours, so "Way to go, Liam!" is Grok too. The library names are the SSA's public list; no family's data goes to xAI.
- **There's no 4-second race for house clips any more.** They play once fetched and are kept offline. Preloading now fetches house clips first.
- **New `{item}` and `{move}` slots** cover about 50 templates for the combinatorial lines: sorting, mazes, building, sharing, the kitchen, the map, coins, "<Pal> used <move>!", and the birthday party.
- **New tests** walk every island step (stories, activities, quizzes, verses, sort, maze and order lines) and sampled learning levels. They fail if a line has nothing but the device voice; a name not in the library is the one exception.
- **`scripts/warm-house-grok.mjs`** works as described above.
- **Letter sounds:** Grok gets a held sound for n, m, s, f, l, r, v and z ("Nnnnn."), and "tuh", "buh" and so on for the rest. IPA alone made "t" sound like "two". The device voice no longer reads "nnn" as "N-N-N". Each sound has backup prompts.
- **Sound check page** (owner only; Parent Corner → Voices and recordings): every letter sound, letter name and number 0–20, each with ▶, 🚩 and the prompt Grok was given.
- **"Let the narrator say <name>"** (under a player whose name isn't in the library) is off by default and asks for consent in plain words. Only then is that one name sent to xAI, once, for its two clips. They're kept with the family's recordings, included in its download, and deleted when the choice is turned off. The limit is 6 names a day per family. PRIVACY.md is updated.
- **Voice coverage log:** the owner's devices report lines that fell to the device voice (never one with a name). The studio lists them.

### B. Bugs
1. **The boat.** A new player starts at Creation, the first island of the first sea. An old save with the boat at a locked island moves to the next open one. Checked on the real server: a new family's boat waits at Creation.
2. **A family link on a signed-in device.**
   - The page now says "This device is signed in to <family>" and offers another device or a private window.
   - The device moves only when "Yes, leave <family> on this device…" is ticked, with an extra warning on that family's last device.
   - Checked live: without the tick the server refuses with a 400; with it, the device moves.
3. **"Grown-ups".** After the first family-password sign-in, `/welcome` asks "What should we call you?" and for an email. The Parent Corner keeps nudging while the parent is still "Grown-ups".
4. **Updates.** "Check for updates", "Reload app" and the title's update button now show a spinner and "Updating…" at once, and disable themselves. They say "You have the newest version" when there's nothing new. An update also no longer clears the cached house-voice clips.

### C. Polish
- **Parent Corner:** it's now eight groups with a line of help each:
  - Players;
  - Grown-ups and devices;
  - Your family's plan;
  - Voices and recordings;
  - Learning levels;
  - Play and limits;
  - Data and privacy;
  - App.

  Wide screens get a side menu, narrow ones get folding cards. Inputs, selects and buttons share one style. The invite form has labelled fields, so placeholders aren't cut off and the native select is gone.
- **Spacing:** there's one spacing scale (`--s1` to `--s7`). The treasure hunt's Pal now sits with its words, and the puzzle no longer stretches to leave a gap under the Pal. Screen titles are centred.
- **Phones:**
  - Headers wrap.
  - The map's tools fit, and the Parent Corner's gear can be reached. In the "before" phone shot the Corner never opened.
  - The title screen's Pals fit.
  - The sea fills the whole map at every size.
- **Avatars:** all player avatars are drawn. I added a unicorn and a flask to the item library.
- **Pronouns:** comments say "the player" or "they" (about 45 files). Story art about Bible women is untouched.
- **Narrator choice:** it's now "Our narrator" (our recordings, then Grok) or "iPad voice". The iPad voice skips Grok too. Eve is folded into "Our narrator".
- **Screenshots** are in `docs/screens/wave11/`, as `before-*.jpg` and `after-*.jpg`:
  - `parent-landscape`, `parent-portrait` and `parent-phone`, plus `after-parent-voices-*`;
  - `treasure-*` and `treasure-puzzle-*` at all three sizes.
- **Scripts:** `scripts/film/layout-shots.mjs`, `screens-sweep.mjs` (every main screen at three sizes, noting overflow) and `sweep-flows.mjs` (the real-server flows).

### The fresh-eyes sweep
- Chromium at iPad size, on the real server (built app):
  - a new owner (password → name → first player → first Pal → treasure hunt → map), plus the sing-along, bedtime and the Parent Corner;
  - a new customer family from a start link, to the map.

  The only server errors were `/tts` answering 503 with no voice key, which is expected.
- **Covered by the playthroughs instead** (36 of 36 pass): one visit of each sea (all 27 islands), a battle, the kitchen and every learning exercise.
- **Fixed during the sweep:** selected buttons weren't showing as selected, and the role choice in the invite form was cut off.

**Left for later:**
- The sing-along's Pal sits far left of the words in landscape. It works, but it could be centred.
- On phones, the player rows in the Parent Corner wrap onto three lines.
- A grown-up's avatar in the Parent Corner is still the grown-up portrait, not an item drawing. That was already drawn, so it's fine.
- Not tried in WebKit locally; CI runs it.

**New spoken lines:** none, beyond lines now covered by Grok. Nothing for Blake to do in Stripe.

**For Blake:**
- Run the sound check once the Grok warm-up has run, and flag anything that sounds wrong.
- In the studio, rename the voices (wave 10) if not done yet.
