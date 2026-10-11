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
   - **Where it runs.** A separate "Ark Pals" Stripe account in Blake's organization, using a **sandbox** named "Ark Pals dev", not the shared test mode.
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
   - **Tests.** Signed test events for every webhook, the access rules, and the offline grace period. Add a DEPLOY.md section with exactly what Blake does: make the sandbox, make the restricted key, `set-stripe-key`, `stripe-setup`, and test card 4242 4242 4242 4242.
7. **Hand back.** Update `docs/GAME-PLAN.md` §9. Then write a short note at the end of this file: what changed, any new spoken lines, anything the local thread must do (warm-up, voice-script pages, server changes) and anything that needs Blake's decision.

## Later (not now)

Church licenses, and turning on `BILLING_ENFORCED` and `STRIPE_TAX`: Blake decides these closer to launch.
