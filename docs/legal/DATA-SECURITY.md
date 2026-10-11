# Ark Pals: data retention and security plan

> **DRAFT** (docs/BUSINESS-PLAN.md §5: the FTC's updated COPPA rule expects a written information security
> program and a data-retention policy). For Marchal Technologies' own use; review yearly and before launch.
> Items in [brackets] are still to do.

## Responsible person

[Owner's name], for Marchal Technologies LLC: keeps this plan, decides who may reach the server (only
the owner today), and handles requests and incidents (hello@spiritflow.church).

## What we hold, and where

| Data | Where | Kept |
|---|---|---|
| Family, grown-ups (names, roles, avatars, emails), devices, links | `/var/lib/carter/arkpals.db` (SQLite) | until the family deletes it; used and expired links [purge after 30 days] |
| Progress backups | `/var/lib/carter` (first family), `/var/lib/carter/families/<id>/backups` | the newest 60 per family |
| Family voice recordings, family songs | `…/recordings`, `…/songs` beside them | until deleted by the family; limited to 300 MB and 400 MB |
| Narration audio (by line text) | `/var/cache/carter` | until cleared; [stop sending names to the voice service, then clear the clips that contain names] |
| Play totals (opt-in, counts only, all families together) | `/var/lib/carter/stats` | [keep 13 months] |
| Snapshots of `/var/lib/carter` before updates | `/root/carter-state-*.tgz` | [delete after 30 days: add a daily cleanup] |

A deleted family is removed from the database and its folder at once.

## How it's protected

- **Encryption in transit:** HTTPS only (Caddy, automatic certificates). Cookies are Secure, HttpOnly and
  SameSite=Lax, and signed (HMAC-SHA256) with a secret kept on the server.
- **Sign-in:** one-time links of 24 random bytes, stored only as SHA-256 hashes, which expire after 30
  minutes to 30 days. Failed sign-ins and dead links are rate-limited per address, and sign-in emails to
  one person are limited to three an hour. The old family password is stored as an scrypt hash.
- **Separation:** every request is tied to one family's sign-in, and each family's files are in their own
  folder. Tests check that one family can't reach another's data, devices or people.
- **The server:** a DigitalOcean droplet reached only by the owner over SSH with a key. The game runs as an
  unprivileged user under systemd hardening (read-only system, no new privileges, private temp).
  Secrets (`/opt/Carter/.env`) are readable by root only. SSH takes keys only (no passwords), the
  firewall (ufw) lets in only SSH and the web (80, 443), and security updates install automatically
  (unattended-upgrades), all checked October 4, 2026.
- **The app:** a strict Content Security Policy (scripts from our own site only), no frames, no sniffing,
  and no referrer sent. It loads nothing from anyone else's servers.
- **Service providers** (DigitalOcean, xAI, Resend, ImprovMX, and Stripe at launch) get only what they
  need for their part (see the Privacy Policy). [Keep their data-processing terms on file.]

## If something goes wrong

1. Stop the leak: sign out every device (rotate `CARTER_SESSION_SECRET`), revoke keys, take the service down
   if needed.
2. Work out what was reached, and whose.
3. Tell the affected families by email within 72 hours of knowing, with what happened and what to do.
4. Write down what happened and change this plan so it can't happen the same way again.

## Review

Look over this plan, the Privacy Policy and what the code actually does every year, before launch, and
whenever the data we keep changes. [First review: before the church beta.]
