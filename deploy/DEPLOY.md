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

## If something goes wrong

```bash
ssh root@68.183.130.3 'journalctl -u carter-web -n 80 --no-pager'
ssh root@68.183.130.3 'systemctl restart carter-web'
```

**To sign out every device:** delete the `CARTER_SESSION_SECRET` line from `/opt/Carter/.env`, run Step 2 again, then restart.
