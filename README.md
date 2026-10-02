# Carter's Ark Adventure

A faith-based learning game for Carter: Bible stories, reading, numbers, and Pokémon-style Ark Pals.
See [SPEC.md](SPEC.md) for the full plan.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (also on your LAN, so the iPad can open it)
npm run build      # production files in dist/
```

To try it on the iPad before deployment, run `npm run dev` on a computer on the same Wi-Fi network and open the "Network" URL in Safari.
Narration uses the device's built-in voice. On iPad, Settings → Accessibility → Spoken Content → Voices lets you download a nicer "Enhanced" English voice.

## Layout

- `src/data/`: story text, Pals, word lists, islands (most content edits happen here)
- `src/lib/`: narration, sounds, adaptive questions, saved progress
- `src/activities/`: story book, Two by Two, practice rounds, memory verse, friendly battle, reward
- `src/screens/`: title, starter choice, map, Ark, parent corner, Noah island flow

Parent Corner: on the map, **press and hold ⚙️ for 3 seconds**.
