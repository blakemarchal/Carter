# Ark Pals: Business Plan (v0.2)

The plan for turning Carter's Ark into a paid, faith-based learning game for families, starting with our church.

- **Owner:** Marchal Technologies LLC, alongside RegKnots and Bree Creative.
- **Mission:** a side income with a philanthropy core. **10% of gross revenue is tithed off the top**, the same as RegKnots.
- **Brand: "Ark Pals."** The trademark search and domain purchase come closer to launch. Until then, **spiritflow.church is the dev site.**
- **Launch rule: no public release until it's a full game with a lot of content** (§6). Carter and our family use it the whole way, and Carter is simply the first family on it, with no separate edition.

---

## 1. Pricing and generosity

**Full price from day one, and no family priced out.**

| Plan | Price | Notes |
|---|---|---|
| **Monthly** | **$9.99/mo** | About the same as secular learning apps (ABCmouse is $12.99/mo) and above most Christian kids' apps ($4–5/mo), which are mostly story or video apps without adaptive learning. A full content library justifies it. |
| **Yearly** | **$79/yr** | Kids' apps lose families month to month, so a yearly plan is the main defense. Push it at checkout. |
| **Grace price** | **$4.99/mo**, self-selected | A "this price helps our family right now" option at checkout. No proof and no questions asked, because dignity matters more than policing. |
| **Grace codes** | Free for 6 or 12 months | Given in batches to children's pastors or ministry leaders to hand out quietly. Built with Stripe promotion codes. |
| **Sponsor a family** | $9.99/mo add-on | A parent pays for one Grace code a month. This turns generosity into a feature, and it's the same spirit as the tithe. |
| **Church license** (after launch) | e.g. $199/yr for 25 families | Lets a church buy codes for all its families. |

- A **free trial** (e.g. 7 days, or the first island free forever) lets families try it before paying.
- **One login covers the whole family**, with up to 4 child profiles. Luke is included when he's old enough.

### Unit economics (per paying family, standard US card rates)

| | Monthly $9.99 | Yearly $79 |
|---|---|---|
| Stripe processing (2.9% + 30¢) | −$0.59 | −$2.59 |
| **Tithe, 10% of gross** | **−$1.00** | **−$7.90** |
| Voice cost once Mom's recordings replace Grok | $0 | $0 |
| Hosting (existing droplet, ~$0 extra until hundreds of families) | ~$0 | ~$0 |
| **Net to the LLC** | **≈ $8.40** | **≈ $68.50** |

- Sales tax on digital goods varies by state. Collect it on top of the price with Stripe Tax.
- A monthly Stripe report produces the tithe figure (10% of gross) automatically.

---

## 2. The voice plan: off paid Grok, onto Mom

The fallback order every line follows:

1. **Your family's recording** of that exact line (each family's own parents)
2. **House narrator:** Mom's recordings, shipped to every family
3. **Pre-made clip** generated once while building the game, as a temporary stand-in for lines Mom hasn't recorded yet (no per-play cost)
4. **The device's own voice**, last resort, which always works offline

**Changes needed:**
- **No live `/tts` endpoint in the public version.** Today the server will speak any text a signed-in user sends, at our cost. Instead, each new line gets one Grok clip made while building the game, stored with the game, and replaced the moment Mom records it. The live endpoint can stay on the dev site only.
- **Recording studio, for us only:** an admin screen that walks Mom through the script line by line, with record, play back and retake, trimming silence automatically. It shows progress ("412 of 1,030 lines recorded") and flags lines that changed since she recorded them. Recordings already match lines by a fingerprint of the text, so this builds on what exists.
- **Lines with changing parts** (numbers 1–130, letters, letter sounds, the word list, Pal names) are recorded once as short clips and stitched together.
- **The child's name:** each family's parent records their child's name once. The game stitches it into lines like "Great job, ___!", so every child hears their own name in a real voice at no cost.
- **Voice release:** a short written license from your wife to Marchal Technologies for her recordings. That's good practice even within the family, since it keeps the business clean if things ever change.

---

## 3. The custom experience for each family

This is what sets the game apart: it feels made for *your* child.

- **Child profile:** first name (or nickname), optional birthday (month and day only), favorite color/theme, and starter Pal.
- **Family cast:** names for Mom, Dad, siblings and pets appear in stories.
- **Family voices:** parents can record any line and the child's name.
- **Family songs:** parents add songs for the sing-along. These are private to that family, and the terms say parents only upload audio they have the right to use.
- **No child is written into the code.** Today's Carter-specific birthday island goes away, and its art and ideas are reused for the birthday surprises in §3.1. "Carter" comes out of every screen.

### 3.1 Birthday surprises (for any child whose parent adds a birthday)

| When | What happens |
|---|---|
| **The week before** | Balloons appear on the map, and their Pal counts down: "3 more sleeps until your birthday!" |
| **On the day** | A surprise party when the game opens: every Pal in a party hat, confetti, and the house narrator sings "Happy Birthday" (public domain) with the child's recorded name. |
| **Birthday gift** | A rare **birthday Pal outfit or sticker for that age** ("5 candles"), so it becomes a yearly collection. |
| **Birthday kitchen** | A birthday cake recipe unlocks in the Pal Kitchen that day. |
| **Birthday battle** | The grumpy foe turns out to be bringing a present. |
| **Thanksgiving moment** | "Thank you, God, for making ___!" with Psalm 139:14 (WEB): *"I will give thanks to you, for I am fearfully and wonderfully made."* |
| **Siblings** | On a brother's or sister's birthday, the other profiles see "Today is Luke's birthday! Tell him happy birthday!" |
| **All year** | The party can be replayed from the sticker book. |

Only the month and day are stored, never the year. Jan 8 is the first real test, with Carter's party.

---

## 4. Accounts, billing and data

- **Parent accounts only.** A parent signs up with their email and a one-time sign-in link, so there's no password to forget. Each device signs in once, the same cookie approach as today.
- **Family = the billing unit**, with up to 4 child profiles.
- **Stripe:**
  - Checkout handles new subscriptions, and the built-in billing page handles cancel, update card and receipts.
  - Stripe tells our server when someone subscribes, renews or cancels, or a payment fails, so the game knows who has paid.
  - Promotion codes power the Grace codes.
  - A **separate Stripe account under Marchal Technologies**, with its own statement descriptor (e.g. "ARK PALS"), keeps the books apart from RegKnots and Bree Creative. *(Still to decide: separate account, or the existing one with separate products.)*
- **Storage:**
  - A SQLite database on the droplet, the same pattern as Hilco.
  - Each family's files go in their own folder (`/var/lib/arkpals/families/<id>/` for recordings, songs and backups), with a storage limit of about 200 MB per family.
- **Offline first:** the game keeps working with no internet. It checks the subscription when online, with a 7-day grace period.
- **Two copies:** **dev on spiritflow.church** with Stripe in test mode, and **production on the new domain** at launch. They run as separate services with separate data on the same droplet.
- **Owner dashboard:** issue batches of Grace codes and see family counts and revenue. It never shows children's data.

---

## 5. Children's privacy and safety (COPPA): best effort now, legal review before launch

- **Only parents create accounts.** Children never type an email or anything personal.
- **Collect the minimum:**
  - parent email
  - child's first name or nickname
  - optional birthday month and day
  - recordings the parents choose to make
- **Parental consent:** the parent is the account holder and pays by card, which is one of the consent methods the FTC accepts. Free Grace-code families get a consent step too, such as an email confirmation plus a consent checkbox.
- **No ads, no third-party tracking or analytics tools, no chat, and nothing shared between families.**
- **Delete and export:** a button in the parent area deletes the family's data, and data is deleted 90 days after cancelling.
- **Written policies:**
  - a privacy policy
  - terms of service
  - a short written data-retention and security plan, which the FTC's updated COPPA rule expects
- **Legal review before launch** of the privacy policy, terms and consent flow.

---

## 6. Content: what "a full game" means at launch

*Proposed launch bar, to be adjusted as we go:*

- **24+ story islands** covering the Old and New Testaments, including Christmas and Easter. Each island has:
  - a narrated, illustrated story
  - 3–4 learning activities
  - a memory verse (WEB)
  - a friendly battle
  - a Pal to befriend

  Today there are 7: Noah, Creation, David, Jonah, Loaves & Fishes, Christmas, and the birthday island, which turns into §3.1.
- **Next candidates:**
  - Moses & the Red Sea
  - Daniel & the Lions
  - Joseph's Coat
  - Abraham's Stars
  - Elijah
  - Ruth
  - Esther
  - Zacchaeus
  - Jesus Calms the Storm
  - The Lost Sheep
  - The Good Samaritan
  - Easter
  - Pentecost
- **Ages 4 to 7**, so a family's kids grow with it:
  - **Reading:** up to short sentences and simple stories.
  - **Math:** up to adding and subtracting within 20, tens and ones, plus early time and money.
- **30+ Pals** with evolutions, and the full Ark side modes: Pal Kitchen, sticker book, coloring, sing-along, Ark care.
- **Mom's house narration recorded for every line.**
- **After launch:** a new island every month, plus seasonal events.

The faith approach in SPEC.md §4.4 applies throughout: grace first, and obedience as a loving response.

---

## 7. Rollout (gated by readiness, not dates)

| Phase | Done when |
|---|---|
| **1. Carter's birthday (Jan 8)** | "Carter" is out of the code and birthday surprises work for any profile. Carter's party on Jan 8 is the first real test. Deployed to spiritflow.church. |
| **2. Voice** | Recording studio built, Mom is recording, clips are pre-made during the build, and the live `/tts` endpoint is gone from the public build. |
| **3. Multi-family foundations** | Parent accounts, per-family data, delete/export, privacy policy and terms drafted. |
| **4. Content build-out** | The launch bar in §6 is met. A smooth way to add new islands is in place. |
| **5. Free church beta** | 5–10 church families on the dev site, invite-only. Watch what kids replay, where they get stuck, and what parents ask for. |
| **6. Paid launch** | Stripe, Grace codes, new domain, trademark checked, legal review done. Announce at church. |

---

## 8. Business setup checklist

- [ ] Trademark search for "Ark Pals" and buy the domain, closer to launch.
- [ ] Stripe account under Marchal Technologies, with products for monthly and yearly, the Grace price and Grace codes, Stripe Tax on, and a test mode for dev.
- [ ] A bookkeeping category for the game, plus a monthly tithe report (10% of gross).
- [ ] Voice release from your wife to the LLC.
- [ ] Privacy policy, terms, and data-retention/security plan, followed by the legal review.
- [ ] Support email at the new domain.
- [ ] Ask the children's pastor about the beta and the Grace-code partnership.

---

## 9. Decisions log

| Decision | Answer |
|---|---|
| Brand | **Ark Pals** (trademark search before launch) |
| Pricing | **Full price at launch**: $9.99/mo, $79/yr, plus the Grace options |
| Tithe | **10% of gross** |
| Launch timing | **Only once it's a full game** (§6) |
| COPPA | Best effort throughout, **legal review before launch** |
| Carter's edition | **None.** Carter is the first family, with no child-specific code. |
| Birthday | **Birthday surprises for every child who has a birthday on file**, replacing the hardwired birthday island |
| Dev site | **spiritflow.church** |
| Still open | Separate Stripe account vs. separate products. App Store ever? (Apple takes 15–30% and requires its own payment system inside the app.) |

---

## 10. Handoff notes for the build thread

Build in this order. Each step can ship to spiritflow.church on its own.

1. **Personalization cleanup:**
   - Remove every hardcoded "Carter".
   - Add birthday month/day and family-cast names to the child profile.
   - Turn the birthday island (`src/data/birthday.ts`, `src/art/scenes/birthday.tsx`) into the birthday surprises in §3.1.
   - Must be ready before Jan 8.
2. **Voice pipeline:**
   - A script export: every spoken line with its fingerprint.
   - The admin recording studio.
   - Clips pre-made during the build for unrecorded lines.
   - Stitching for the child's name and for numbers and letters.
   - The live `/tts` endpoint available on dev only.
3. **Multi-family server:**
   - Parent accounts with email sign-in links.
   - SQLite.
   - Per-family folders for recordings, songs and backups (these are single-family today).
   - Storage limits, plus delete and export.
4. **Content pipeline:** keep islands data-driven so a new island is mostly content, not code. Then build toward the §6 launch bar.
5. **Billing last:**
   - Stripe Checkout, the billing page, and payment notifications from Stripe that unlock access.
   - Grace codes, plus the owner dashboard.
   - Built in Stripe test mode on dev.
