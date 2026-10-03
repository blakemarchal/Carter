# Ark Pals: Business Plan (v0.1 draft)

The plan for turning Carter's Ark into a paid, faith-based learning game for families, starting with our church.

- **Owner:** Marchal Technologies LLC, alongside RegKnots and Bree Creative.
- **Mission:** a side income with a philanthropy core. **10% of revenue is tithed off the top**, the same as RegKnots.
- **Working brand: "Ark Pals"** (placeholder). It describes the game, and Carter's own game simply becomes the first family on it. Before buying a domain, check trademark and domain availability (§9).

---

## 1. Pricing and generosity

The goal is **$9.99/month as the standard price, and no family priced out.**

| Plan | Price | Notes |
|---|---|---|
| **Monthly** | **$9.99/mo** | The gut price is right: about the same as secular learning apps (ABCmouse is $12.99/mo) and above most Christian kids' apps ($4–5/mo), which are mostly story or video apps without adaptive learning. |
| **Yearly** | **$79/yr** (2 months free plus a bit) | Kids' apps lose families month to month, so a yearly plan is the main defense. Push it at checkout. |
| **Founding Family** | **$5.99/mo or $49/yr, locked for life** | For the first church families who join through the beta. It rewards early feedback and covers the stretch while the library is small. |
| **Grace price** | **$4.99/mo**, self-selected | A "this price helps our family right now" option at checkout. No proof and no questions asked, because dignity matters more than policing. |
| **Grace codes** | Free for 6 or 12 months | Given in batches to the children's pastor or ministry leaders to hand out quietly. Built with Stripe promotion codes. |
| **Sponsor a family** | $9.99/mo add-on | A parent pays for one Grace code a month. This turns generosity into a feature, and it's the same spirit as the tithe. |
| **Church license** (later) | e.g. $199/yr for 25 families | Lets a church buy codes for all its families. Only after launch. |

**Why not launch at $9.99 on day one?** Today the game has 7 islands. A child can finish that in a few weeks, and a family paying full price will cancel when it runs out. Founding pricing buys time to build the library. Full price starts once there are about 12 or more islands plus a **monthly new-island cadence** (§6).

**One login covers the whole family**, with up to 4 child profiles. Luke is included when he's old enough.

### Unit economics (per paying family, standard US card rates)

| | Monthly $9.99 | Yearly $79 |
|---|---|---|
| Stripe processing (2.9% + 30¢) | −$0.59 | −$2.59 |
| **Tithe, 10% of gross** | **−$1.00** | **−$7.90** |
| Voice cost once Mom's recordings replace Grok | $0 | $0 |
| Hosting (existing droplet, ~$0 extra until hundreds of families) | ~$0 | ~$0 |
| **Net to the LLC** | **≈ $8.40** | **≈ $68.50** |

- Sales tax on digital goods varies by state. Collect it on top of the price with Stripe Tax.
- "Off the top" is assumed here to mean 10% of gross. If you'd rather tithe after Stripe fees, it's $0.94 a month instead.
- A Stripe report can produce the monthly tithe figure automatically.

---

## 2. The voice plan: off paid Grok, onto Mom

The fallback order every line follows:

1. **Your family's recording** of that exact line (each family's own parents)
2. **House narrator:** Mom's recordings, shipped to every family
3. **Pre-made clip** generated once while building the game, as a temporary stand-in (no per-play cost)
4. **The device's own voice**, last resort, which always works offline

**Changes needed:**
- **No live `/tts` endpoint in the public version.** Today the server will speak any text a signed-in user sends, at our cost. Instead, each new line gets one Grok clip made while building the game, stored with the game, and replaced the moment Mom records it.
- **Recording studio, for us only:** an admin screen that walks Mom through the script line by line, with record, play back and retake, trimming silence automatically. It shows progress ("412 of 1,030 lines recorded") and flags lines that changed since she recorded them. Recordings already match lines by a fingerprint of the text, so this builds on what exists.
- **Lines with changing parts** (numbers 1–130, letters, letter sounds, the word list, Pal names) are recorded once as short clips and stitched together.
- **The child's name:** each family's parent records their child's name once ("Carter!"). The game stitches it into lines like "Great job, ___!", so every child hears their own name in a real voice at no cost.
- **Voice release:** a short written license from your wife to Marchal Technologies for her recordings. That's good practice even within the family, since it keeps the business clean if things ever change.

---

## 3. The custom experience for each family

This is what sets the game apart: it feels made for *your* child.

- **Child profile:** first name (or nickname), birthday (month and day only), favorite color/theme, and starter Pal.
- **Family cast:** names for Mom, Dad, siblings and pets appear in stories, and the birthday island stars the child.
- **Family voices:** parents can record any line and the child's name.
- **Family songs:** parents add songs for the sing-along. These are private to that family, and the terms say parents only upload audio they have the right to use.
- **Birthday surprise:** the birthday island unlocks on the child's real birthday.

*Code changes needed:* "Carter" is still written directly into the birthday island and a few screens. That needs to come from the profile. Recordings, songs and backups are stored for one family today and need to be stored per family (§4).

---

## 4. Accounts, billing and data

- **Parent accounts only.** A parent signs up with their email and a one-time sign-in link, so there's no password to forget. Each device signs in once, the same cookie approach as today.
- **Family = the billing unit**, with up to 4 child profiles.
- **Stripe:**
  - Checkout handles new subscriptions, and the built-in billing page handles cancel, update card and receipts.
  - Stripe tells our server when someone subscribes, renews or cancels, or a payment fails, so the game knows who has paid.
  - Promotion codes power Grace codes and Founding Family pricing.
  - A **separate Stripe account under Marchal Technologies**, with its own statement descriptor (e.g. "ARK PALS"), keeps the books apart from RegKnots and Bree Creative.
- **Storage:**
  - A SQLite database on the droplet, the same pattern as Hilco.
  - Each family's files go in their own folder (`/var/lib/arkpals/families/<id>/` for recordings, songs and backups), with a storage limit of about 200 MB per family.
- **Offline first:** the game keeps working with no internet. It checks the subscription when online, with a 7-day grace period.
- **Two copies:** **dev on spiritflow.church** with Stripe in test mode, and **production on the new domain**. They run as separate services with separate data on the same droplet.
- **Owner dashboard:** issue batches of Grace codes and see family counts and revenue. It never shows children's data.

---

## 5. Children's privacy and safety (COPPA)

Kids under 13 are using it, so this is required, not optional.

- **Only parents create accounts.** Children never type an email or anything personal.
- **Collect the minimum:**
  - parent email
  - child's first name or nickname
  - birthday month and day (no year)
  - recordings the parents choose to make
- **Parental consent:** the parent is the account holder and pays by card, which is one of the consent methods the FTC accepts. Free Grace-code families need a consent step too, such as an email confirmation plus a consent checkbox. **Have a lawyer confirm this.**
- **No ads, no third-party tracking or analytics tools, no chat, and nothing shared between families.**
- **Delete and export:** a button in the parent area deletes the family's data, and data is deleted 90 days after cancelling.
- **Written policies:**
  - a privacy policy
  - terms of service
  - a short written data-retention and security plan, which the FTC's updated COPPA rule expects
- **Before launch:** a one-time lawyer review of the privacy policy, terms and consent flow. It's worth the few hundred dollars.

---

## 6. Content roadmap

A subscription has to keep giving. The rhythm is **one new island a month**, plus smaller drops: new Pals, recipes, songs and seasonal events like Christmas and Easter.

**Library target before full price:** 12 islands, which is 5 more beyond today's 7. Candidates:
- Moses & the Red Sea
- Daniel & the Lions
- Joseph's Coat
- Zacchaeus
- Jesus Calms the Storm
- The Lost Sheep
- Easter

The faith approach in SPEC.md §4.4 still applies: grace first, and obedience as a loving response.

---

## 7. Rollout

| When | Phase |
|---|---|
| **Now → Jan 8** | **Carter's 5th birthday release.** Polish, Mom starts recording, and "Carter" moves out of the code into her profile. Deploys to spiritflow.church. |
| **Jan → mid-Feb** | **Multi-family foundations:** parent accounts, per-family data, recording studio, no live `/tts`, privacy policy and terms drafted. |
| **Mid-Feb → Mar** | **Free invite-only beta** for 5–10 church families on the dev site. Watch what kids replay, where they get stuck, and what parents ask for. |
| **Mar → Apr** | **Paid launch:** Stripe, Grace codes, new domain, lawyer review done. Beta families become Founding Families. Announce at church. |
| **Ongoing** | A new island monthly, and full price once the library reaches about 12 islands. |

---

## 8. Business setup checklist

- [ ] Pick the name. Do a USPTO trademark search and check the domain, plus Apple's App Store in case we ever go there.
- [ ] Buy the domain.
- [ ] Separate Stripe account under Marchal Technologies, with products for monthly, yearly and founding prices, Stripe Tax on, and a test mode for dev.
- [ ] A bookkeeping category for the game, plus a monthly tithe report.
- [ ] Voice release from your wife to the LLC.
- [ ] Privacy policy, terms, and data-retention/security plan, followed by the lawyer review.
- [ ] Support email at the new domain.
- [ ] Ask the children's pastor about the beta and the Grace-code partnership.

## 9. Open decisions

1. **Name:** Ark Pals, or something else? Other options: "Little Ark Adventures", "Ark Kids Academy".
2. **Is the tithe 10% of gross, or of what's left after Stripe fees?**
3. **Pricing:** OK with Founding Family pricing until the library reaches 12 islands?
4. **Stripe:** a separate account under the LLC, or the existing one with separate products?
5. **App Store, ever?** It's web-only for now. Apple would take 15–30% and require Apple's own payment system inside the app.
