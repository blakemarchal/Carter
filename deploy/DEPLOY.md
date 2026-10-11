# Deploying Carter's Ark to spiritflow.church

**Target:** the existing droplet `spiritflow-prod-01` (`68.183.130.3`), running Ubuntu 24.04 with Caddy and one systemd unit per app.

**Carter's Ark gets port 3004 and the folder `/opt/Carter`.** The other sites on the droplet (regknots, merch, bree, hilco) are not touched. The only shared file is `/etc/caddy/Caddyfile`, so always run `caddy validate` before reloading it.

Run these steps from the Windows laptop, which already has SSH access to the droplet. Use Git Bash for `.sh` or PowerShell for `.ps1`.

---

## Step 0: Archive the current spiritflow.church app (data kept, then taken offline)

**Do this before anything else.** Nothing in this step deletes anything.

1. **Find out what serves spiritflow.church today:**

   ```bash
   ssh root@68.183.130.3 'grep -n -A8 "spiritflow.church" /etc/caddy/Caddyfile; echo; systemctl list-units --type=service --no-pager | grep -Ei "web|spirit|node"; echo; docker ps --format "{{.Names}}\t{{.Image}}\t{{.Ports}}" 2>/dev/null'
   ```

   - The Caddy block shows the port (e.g. `reverse_proxy 127.0.0.1:300X`).
   - `ss -ltnp | grep 300X` shows which process owns that port.
   - `systemctl cat <unit>` shows its folder (`WorkingDirectory`) and its `.env`, which says which database it uses.

2. **Back it up on the droplet.** Fill in the three values you found:

   ```bash
   ssh root@68.183.130.3 'set -e
     UNIT=<unit-name>; DIR=<app-folder>; STAMP=$(date -u +%Y%m%dT%H%M%SZ)
     mkdir -p /var/backups/spiritflow-archive
     tar czf /var/backups/spiritflow-archive/files-$STAMP.tgz -C "$(dirname $DIR)" "$(basename $DIR)"
     cp /etc/caddy/Caddyfile /var/backups/spiritflow-archive/Caddyfile-$STAMP
     systemctl cat $UNIT > /var/backups/spiritflow-archive/$UNIT-$STAMP.service
     ls -la /var/backups/spiritflow-archive'
   ```

   - **SQLite:** the database file is inside the folder, so the tarball already has it.
   - **Postgres in Docker:** also run:

     ```bash
     ssh root@68.183.130.3 'docker exec <pg-container> pg_dump -U <user> <db> | gzip > /var/backups/spiritflow-archive/db-$(date -u +%Y%m%dT%H%M%SZ).sql.gz'
     ```

3. **Copy the archive to the laptop**, so you have a copy off the server:

   ```bash
   scp -r root@68.183.130.3:/var/backups/spiritflow-archive ./spiritflow-archive
   ```

   Also consider a DigitalOcean snapshot of the droplet (Droplet → Snapshots).

4. **Take it offline.** This stops the app but deletes nothing:

   ```bash
   ssh root@68.183.130.3 'systemctl disable --now <unit-name>'
   ```

   Its database container (if any) can keep running or be stopped with `docker stop <name>`.

## Step 1: Ship the files

```bash
./deploy/deploy.sh          # Git Bash
.\deploy\deploy.ps1         # PowerShell
```

The script builds the game and copies it to `/opt/Carter`. On this first run it reports that the service isn't installed yet, which is expected.

## Step 2: Set the family password

```bash
ssh root@68.183.130.3 -t 'cd /opt/Carter && npm run set-password'
```

- It asks twice and hides what you type.
- Only a salted hash is stored, in `/opt/Carter/.env` (root-only, mode 600).
- The password never appears in shell history.

**No interactive terminal?** For example, when Claude Code runs the commands for you, generate a password instead. It is printed once, so write it down:

```bash
ssh root@68.183.130.3 'cd /opt/Carter && npm run set-password -- --generate'
```

You can change it any time later by running the interactive command above.

## Step 3: Install and start the service

```bash
ssh root@68.183.130.3 'cp /opt/Carter/deploy/carter-web.service /etc/systemd/system/ && systemctl daemon-reload && systemctl enable --now carter-web && sleep 1 && systemctl --no-pager status carter-web | head -5 && curl -s -o /dev/null -w "HTTP %{http_code}\n" -H "Accept: text/html" http://127.0.0.1:3004/'
```

Expect `active (running)` and `HTTP 200`. That response is the login page.

## Step 4: Point spiritflow.church at it

Edit `/etc/caddy/Caddyfile`:

1. **Remove** the old `spiritflow.church` site block. You backed it up in Step 0.
2. Paste in `deploy/Caddyfile.snippet`. Caddy refuses two blocks with the same address, so step 1 is required.
3. Then validate and reload:

```bash
ssh root@68.183.130.3 'cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date -u +%Y%m%dT%H%M%SZ) && nano /etc/caddy/Caddyfile'
ssh root@68.183.130.3 'sudo -u caddy caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy'
```

- Use **reload, not restart.** A restart drops connections for every site.
- A failed reload keeps the old config serving, so it is not an outage. Check `journalctl -u caddy -n 50`.

## Step 4b: Narrator voice (Grok "Ara")

The narrator uses Grok's Ara voice, the same voice as Grok in the Tesla, through the xAI text-to-speech API. Until a key is set, the game uses the iPad's built-in voice.

**Upgrading from the first version?** The service file gained a cache folder. After `deploy.ps1`, run:

```bash
ssh root@68.183.130.3 'cp /opt/Carter/deploy/carter-web.service /etc/systemd/system/ && systemctl daemon-reload && systemctl restart carter-web'
```

1. Get an API key at https://console.x.ai (API Keys → Create). Add a little credit; narration costs about $15 per million characters, and every line is generated only once, so the whole game costs cents.
2. Save the key on the server. It asks for the key (hidden), checks it with xAI, and only then saves it:

   ```bash
   ssh root@68.183.130.3 -t 'cd /opt/Carter && npm run set-voice-key && systemctl restart carter-web'
   ```

- `npm run set-voice-key -- --check` tests the saved key without showing it. `-- --remove` goes back to the device voice.
- The key lives only in `/opt/Carter/.env` (root-only). The game never sees it; it asks the server at `/tts`, which requires the family login.
- Clips are cached in `/var/cache/carter`. New narration is capped at 200,000 characters a day (about $3), set by `TTS_DAILY_CHARS` in `.env`.
- The Parent Corner can switch each player between Ara, Eve (another Grok voice), and the iPad voice.

## Step 5: Install on Carter's iPad

1. Open **Safari** and go to `https://spiritflow.church`.
2. Enter the family password. The login lasts a year on that device.
3. Tap **Share → Add to Home Screen**.
4. Open it from the Home Screen icon. It runs full-screen, and **sign in once more there**, because the Home Screen app keeps its own cookies and saved progress, separate from Safari.
5. Always play from the icon, so her progress stays in one place. On the title screen she taps her own name; grown-ups test as **Dad** (or add a player in the Parent Corner) so her progress is never touched.
6. Optional, only matters without the Grok voice: go to Settings → Accessibility → Spoken Content → Voices → English, and download an "Enhanced" voice such as Samantha or Ava.

## Later deploys

Run `./deploy/deploy.sh` (or `.\deploy\deploy.ps1`) again. It rebuilds, swaps the files, restarts `carter-web`, and prints a health check.

**On the iPad:** the app checks for a new version when it opens, when it comes back to the screen, and every 10 minutes. When there is one, the title screen shows **✨ Update ready: tap to update**. Tapping it loads the new version and keeps everyone's progress and the saved narration. The Parent Corner also has **Check for updates** and **Reload app** (which also fixes a stuck screen).

## Families: grandparents and other grown-ups

Grown-ups sign in with one-time links, not passwords (`server/families.mjs`). The family password still
works: it signs a device in as the first family's parents. Devices signed in before families carried on as
those parents.

- **Inviting someone:** in the Parent Corner, under "Grown-ups who can sign in", a parent types the name
  (Nana), taps **Make their link**, and texts it. The link works once, for 7 days. Opening it and tapping
  **Join** signs that device in. Grown-ups can add their other devices with **Sign in another device as
  me** (a link that works once, for a day). Parents can remove people and sign devices out.
- **iPhone and iPad Home Screen apps** keep their own sign-in, apart from Safari's. Add Ark Pals to the
  Home Screen first, open it, and paste the link into its sign-in page. Someone who already joined in
  Safari gets a fresh link there with **Sign in another device as me**.
- **A new family** (each family sees only its own backups, recordings and songs) starts from a link that
  works once, for 30 days:
  ```bash
  ssh root@68.183.130.3 'cd /opt/Carter && runuser -u www-data -- env STATE_DIRECTORY=/var/lib/carter node server/new-family-link.mjs https://spiritflow.church'
  ```
- **Where it's kept:** `/var/lib/carter/arkpals.db` (SQLite). The first family's files stay in
  `/var/lib/carter`; other families' are in `/var/lib/carter/families/<id>/`. Back the folder up before a
  risky deploy: `tar czf /root/carter-state-$(date +%F).tgz -C /var/lib carter`.

## Email: sign-in links and invitations (optional)

With email set up, a grown-up who added their email in the Parent Corner can tap **Email me a link** on
the sign-in page of a new device, and parents can send an invitation straight to someone's inbox. Without
it, everything works as before: links are shared by hand. Emails are sent through Resend, and replies to
`hello@spiritflow.church` are forwarded by ImprovMX to a Gmail inbox. spiritflow.church's DNS is at
Namecheap (Domain List → spiritflow.church → Advanced DNS; "Mail Settings" must be **Custom MX**).

1. **Resend (sending):** in Resend → Domains, add `spiritflow.church` (the free plan allows one domain per
   account, so Ark Pals has its own Resend account; RegKnot's `mail.regknots.com` lives in another). Add
   the records it lists at Namecheap: in Oct 2026 that was a TXT at `resend._domainkey` (DKIM), and CNAMEs
   at `send` and `rsend` (→ `send.forge.rmta.net`, `rsend.forge.rmta.net`). Skip its "Enable Receiving"
   records: ImprovMX receives. Then press **Verify DNS Records** in Resend. Leave tracking off, so sign-in
   links aren't rewritten. *(Done Oct 6, 2026: verified.)*
2. **ImprovMX (receiving):** add `spiritflow.church` with an alias `hello` → your Gmail address. At
   Namecheap, add MX `@` → `mx1.improvmx.com` (priority 10) and `mx2.improvmx.com` (priority 20), and a
   TXT at `@`: `v=spf1 include:spf.improvmx.com ~all`. *(Done Oct 6, 2026: active, with a catch-all too.)*
   - The `resend._domainkey.mail` and `send.mail` records at Namecheap are left over from an earlier
     `mail.spiritflow.church` setup that no Resend account holds now. Nothing uses them, so they can be removed.
3. **The key:** in Resend → API Keys, create a key with **Sending access** for spiritflow.church. Then:
   ```bash
   ssh root@68.183.130.3
   cd /opt/Carter && npm run set-email-key     # paste the key (it isn't shown), keep the From address, send a test
   systemctl restart carter-web
   ```
   `npm run set-email-key -- --check` sends another test; `-- --remove` turns email off again.

## Billing: Stripe, in test mode

Families pay through Stripe (`server/billing.mjs`). For now it runs in the **"Ark Pals sandbox"** of the
separate "Ark Pals" account in our Stripe organization, so no real money moves. **Nothing is blocked**:
`BILLING_ENFORCED` is off until you decide to turn it on. The first family, and any family you mark as
comped on the billing dashboard, always plays free.

1. **The Stripe library on the server** is installed by every deploy (`deploy.sh` / `deploy.ps1` send
   `package-lock.json` and run `npm ci --omit=dev` on the server). To check it:
   ```bash
   ssh root@68.183.130.3 'cd /opt/Carter && npm ls stripe'
   ```
   Expect `stripe@22.6.0`. Without it the server still runs; billing is just off.
2. **Make a restricted key in the sandbox.** In the Stripe Dashboard, switch to the **Ark Pals** account,
   then to **Ark Pals sandbox**. Go to Developers → API keys → **Create restricted key**, name it
   "Ark Pals server", and give it only these permissions (everything else **None**):

   | Permission | Access | Used for |
   |---|---|---|
   | Customers | Write | a family's Customer, made at its first checkout; deleted when the family is deleted |
   | Checkout Sessions | Write | starting a plan |
   | Customer portal | Write | the billing page (its sessions, and its settings made by `stripe-setup`) |
   | Subscriptions | Read | reading a plan right after checkout |
   | Products | Write | `stripe-setup`: the three products |
   | Prices | Write | `stripe-setup`; finding prices by lookup key at checkout |
   | Coupons | Write | `stripe-setup`: the 6- and 12-month Grace coupons |
   | Promotion Codes | Write | Grace code batches, and Sponsor a Family codes |
   | Webhook Endpoints | Write | `stripe-setup`: the webhook |

   Copy the key (`rk_test_…`) straight into the next step. Don't paste it anywhere else (chat, email,
   notes): the server's `.env` is the only place it lives.
3. **Save the key.** It's checked with Stripe, saved to `/opt/Carter/.env` as `STRIPE_KEY`, and never shown:
   ```bash
   ssh root@68.183.130.3 -t 'cd /opt/Carter && npm run set-stripe-key'
   ```
   It refuses a key that isn't restricted (`rk_`), and a live key while we're in test mode.
   `-- --check` checks the saved key again; `-- --remove` turns billing off.
4. **Optional: the tax code.** Pick the products' tax code from Stripe's list (Stripe docs → Tax → Tax
   codes; nothing is hardcoded) and add it to `.env` (it isn't a secret):
   ```bash
   ssh root@68.183.130.3 'cd /opt/Carter && echo STRIPE_TAX_CODE=txcd_XXXXXXXX >> .env'
   ```
   Without it, the products use the account's default tax code. Prices are tax-exclusive (tax is added
   on top). **No tax is collected** until you add a head office address in Stripe (Settings → Tax), have
   an active tax registration there, **and** set `STRIPE_TAX=1` in `.env`. Until then `STRIPE_TAX` stays off.
5. **Make everything in Stripe**, then restart:
   ```bash
   ssh root@68.183.130.3 -t 'cd /opt/Carter && npm run stripe-setup && systemctl restart carter-web'
   ```
   It makes (or brings up to date) the products "Ark Pals Family" ($9.99/mo, $79/yr), "Ark Pals Grace"
   ($4.99/mo) and "Sponsor a Family" ($9.99/mo), found again by their lookup keys; the 100%-off coupons
   for 6 and 12 months; the billing page's settings; and the webhook `https://spiritflow.church/stripe/webhook`.
   It saves the webhook's signing secret to `.env` as `STRIPE_WEBHOOK_SECRET` (never shown). It's safe to
   run again. `-- --new-webhook-secret` makes the webhook again with a new secret.
6. **Try it** (a second family, since the first one is always free):
   - Make a new-family link (see "Families" above) and open it on another device or a private window.
   - Parent Corner → **Your family's plan** → **Choose yearly**. On Stripe's page pay with the test card
     **4242 4242 4242 4242**, any future date, any CVC, any ZIP.
   - Back in Ark Pals, the plan shows "free week until …". **Billing page** opens Stripe's page to cancel,
     change the card or plan, and see receipts.
   - Stripe → Developers → Webhooks → the endpoint: every delivery should say 200.
   - A Grace code: in the first family's Parent Corner, **📒 Billing, all families** (or
     `https://spiritflow.church/billing/owner`) → Make codes. Use one at checkout with "Add promotion code".
   - Test cards for other cases (declined, needs authentication) are on Stripe's "Testing" docs page.
7. **The owner's dashboard** (`/billing/owner`, parents in the first family only) shows how many families
   are on each plan, makes batches of single-use Grace codes (6 or 12 months free) to print or copy, lists
   the codes made (Sponsor a Family adds one 6-month code for each month a sponsor pays), and comps a family
   (always free, like the church beta). It never shows anything about children.
8. **Later, when you decide:** `BILLING_ENFORCED=1` in `.env` (then restart) closes the game for families
   without a plan: they see a calm "The Pals are resting" screen for grown-ups, and the Parent Corner stays
   open. A device keeps playing for 7 days offline after its last check. Going live needs a live restricted
   key (`npm run set-stripe-key -- --live`), `npm run stripe-setup` again, and the new domain in `SITE_URL`.

Deleting a family (Parent Corner) deletes its Stripe Customer first, which cancels its plan at once; if
Stripe can't be reached, the family isn't deleted, so try again later. The family's download includes its
billing (plan, status, paid-through date, Stripe Customer ID).

## If something goes wrong

```bash
ssh root@68.183.130.3 'journalctl -u carter-web -n 80 --no-pager'
ssh root@68.183.130.3 'systemctl restart carter-web'
```

**To sign out every device:** delete the `CARTER_SESSION_SECRET` line from `/opt/Carter/.env`, run Step 2 again, then restart.
