# Carter's Ark Adventure

A faith-based learning game for Carter: Bible stories, reading, numbers, and Pokémon-style Ark Pals.
See [SPEC.md](SPEC.md) for the full plan.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also on your LAN, so the iPad can open it)
npm run build      # production files in dist/
```

**Quick playtest without the server:** on the Windows laptop run `npm install` then `npm run dev`. Open the "Network" URL it prints (e.g. `http://192.168.1.20:5173`) in Safari on the iPad, on the same Wi-Fi. If Windows asks, allow Node through the firewall on private networks.

**Deploy to spiritflow.church:** see [deploy/DEPLOY.md](deploy/DEPLOY.md).
Narration uses the device's built-in voice. On iPad, Settings → Accessibility → Spoken Content → Voices lets you download a nicer "Enhanced" English voice.

## Layout

- `src/data/`: story text, Pals, word lists, islands (most content edits happen here)
- `src/lib/`: narration, sounds, adaptive questions, saved progress
- `src/activities/`: story book, Two by Two, practice rounds, memory verse, friendly battle, reward
- `src/screens/`: title, starter choice, map, Ark, parent corner, Noah island flow
- `server/`: tiny password-protected server for production
- `deploy/`: systemd unit, Caddy block, deploy scripts and runbook

Parent Corner: on the map, **press and hold ⚙️ for 3 seconds**.
