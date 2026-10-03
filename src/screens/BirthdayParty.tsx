// The birthday party: the surprise when a child opens the game on their birthday (and replayable from
// the sticker book). Surprise! Every Pal in a party hat and confetti. "How old are you today?", a
// candle on the cake for each year, Ara sings Happy Birthday with their name, a wish and blowing out
// the candles. Then the birthday story, "Thank you, God, for making ___!" and Psalm 139:14, a battle
// where the grumpy balloon was hiding a present, and the gifts: a sticker for their age ("5 candles"),
// party hats for their Pals, Sprinkles (at their first party) and a birthday cake in the Pal Kitchen.
// Styles: styles.css, "Birthday party".
import { useEffect, useMemo, useRef, useState } from 'react'
import DressedPal from '../components/DressedPal'
import PlayerArtProvider from '../components/PlayerArt'
import StickerFace from '../components/StickerFace'
import { BlowOut, CandlesOnCake, PartyCake } from '../components/PartyCake'
import { BackButton, BigButton, Confetti, StepDots } from '../components/ui'
import StoryBook from '../activities/StoryBook'
import VerseBuilder from '../activities/VerseBuilder'
import FriendlyBattle from '../activities/FriendlyBattle'
import { BIRTHDAY_ART } from '../art/scenes/birthday'
import { BIRTHDAY_VERSE, PARTY_FOE, PARTY_PAL, partyFoeIntro, partyStory, presentLine, storyTitle, thanksLine } from '../data/birthday'
import { palById, palIntro, stageFor } from '../data/pals'
import { SONGS, withName } from '../data/songs'
import { ageSticker, castFor, hasAgeSticker } from '../lib/party'
import { addPalXp, addSticker, getFamily, getProgress, today, update, useProfiles, useProgress, type Progress } from '../lib/progress'
import { loadSong, Playback, useNameSlot } from '../lib/songs'
import { setMood } from '../lib/music'
import { pauseNarration, preload, speak, stopSpeaking } from '../lib/speech'
import { numberWords } from '../lib/spoken'
import { sfx } from '../lib/sfx'
import { useAlive } from '../lib/useAlive'
import { wait } from '../lib/util'

/** On the day itself; again from the sticker book (age known); or a grown-up trying it (changes nothing). */
export type PartyMode = 'day' | 'replay' | 'preview'

type Phase = 'surprise' | 'age' | 'candles' | 'song' | 'blow' | 'story' | 'thanks' | 'verse' | 'battle' | 'gift'
const STEPS: Phase[][] = [['surprise'], ['age', 'candles', 'song', 'blow'], ['story'], ['thanks', 'verse'], ['battle'], ['gift']]
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const candles = (n: number) => `${numberWords(n)} ${n === 1 ? 'candle' : 'candles'}`

/** Their Pals (their buddy first), all in party hats. */
function usePartyPals(p: Progress, max: number) {
  const owned = Object.keys(p.pals)
  const buddy = p.battler ?? p.starter
  const ids = buddy && owned.includes(buddy) ? [buddy, ...owned.filter((id) => id !== buddy)] : owned
  return ids.slice(0, max).map((id) => { const pal = palById(id); return { pal, stage: stageFor(pal, p.pals[id] ?? 0) } })
}

function PartyPals({ p, max = 6, size = 120, dancing }: { p: Progress; max?: number; size?: number; dancing?: number }) {
  const pals = usePartyPals(p, max)
  return (
    <div className={`party-pals ${dancing !== undefined ? `beat-${dancing % 2}` : ''}`}>
      {pals.map(({ pal, stage }, i) => (
        <span key={pal.id} className="party-pal" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
          <DressedPal pal={pal} stage={stage} size={size} outfit="partyhat" className="bob" />
        </span>
      ))}
    </div>
  )
}

function Surprise({ name, p, onDone }: { name: string; p: Progress; onDone: () => void }) {
  const [ready, setReady] = useState(false)
  const alive = useAlive()
  useEffect(() => {
    sfx.fanfare()
    ;(async () => {
      await speak(`Surprise! Happy birthday, ${name}! All your Pals came to your birthday party!`)
      if (alive.current) setReady(true)
    })()
  }, [])
  return (
    <div className="party-surprise">
      <Confetti count={50} />
      <div className="party-balloons" aria-hidden>{['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'].map((b, i) => <span key={i} style={{ '--i': i } as React.CSSProperties}>{b}</span>)}</div>
      <h1 className="party-shout">Surprise!</h1>
      <div className="party-name">Happy birthday, {name}!</div>
      <PartyPals p={p} />
      <BigButton color="pink" className={ready ? 'pulse' : ''} onClick={onDone}>🎉 Let&rsquo;s party!</BigButton>
    </div>
  )
}

function AgePick({ onPick }: { onPick: (n: number) => void }) {
  useEffect(() => { speak('How old are you today? Tap your number!') }, [])
  return (
    <div className="party-age">
      <h2>How old are you today?</h2>
      <div className="age-grid">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
          <button key={n} className="age-btn" onClick={() => { sfx.pop(); onPick(n) }}>{n}</button>
        ))}
      </div>
    </div>
  )
}

/** Ara sings Happy Birthday (the game says their name where it goes), with the words lighting up. */
function Song({ name, age, p, onDone }: { name: string; age: number; p: Progress; onDone: () => void }) {
  const alive = useAlive()
  const base = SONGS.find((s) => s.id === 'happy-birthday')
  const song = useMemo(() => (base ? withName(base, name) : null), [base, name])
  const [state, setState] = useState<'loading' | 'playing' | 'done' | 'error'>('loading')
  const [pos, setPos] = useState({ line: -1, word: -1, beat: -1 })
  const play = useRef<Playback | null>(null)
  const nameSlot = useNameSlot(song ?? SONGS[0], name, () => true)

  useEffect(() => {
    setMood(null) // the song brings its own music
    ;(async () => {
      try {
        if (!song) throw new Error('no song')
        preload([`${name}!`])
        const buf = await loadSong(song.audio.ara)
        if (!alive.current) return
        const pb = new Playback(buf)
        pb.onEnd = () => { if (alive.current) { setState('done'); onDone() } }
        play.current = pb
        await speak(`Let's sing Happy Birthday to ${name}! Everybody sing!`)
        if (!alive.current) return
        pb.play(0)
        setState('playing')
      } catch {
        if (!alive.current) return
        setState('error')
        await speak(`Happy birthday to you! Happy birthday, dear ${name}! Happy birthday to you!`)
        if (alive.current) onDone()
      }
    })()
    return () => { play.current?.stop(); setMood('home') }
  }, [])

  useEffect(() => {
    if (state !== 'playing' || !song) return
    let raf = 0
    const tick = () => {
      const pb = play.current
      if (pb) {
        const t = pb.time()
        let line = -1
        song.lines.forEach((l, i) => { if (l.start <= t + 0.25) line = i })
        let word = -1
        song.lines[line]?.words.forEach(([, at], k) => { if (at <= t + 0.05) word = k })
        let beat = -1
        song.beats?.forEach((b, k) => { if (b <= t) beat = k })
        if (pb.playing) nameSlot(t)
        setPos((x) => (x.line === line && x.word === word && x.beat === beat ? x : { line, word, beat }))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state, song])

  const line = song?.lines[pos.line]
  return (
    <div className="party-song">
      <div className="party-cake lit"><PartyCake slots={age} placed={age} lit /></div>
      <div className="party-words">
        {state === 'loading' && <p className="sing-now ready">🎵 Getting the song ready…</p>}
        {state !== 'loading' && (line
          ? <p className="sing-now" key={pos.line}>{line.words.map(([w], k) => <span key={k} className={`w ${k <= pos.word ? 'sung' : ''} ${k === pos.word ? 'now' : ''} ${w.startsWith(name) ? 'their-name' : ''}`}>{w} </span>)}</p>
          : <p className="sing-now ready">🎶 Happy Birthday!</p>)}
      </div>
      <PartyPals p={p} max={5} size={96} dancing={state === 'playing' ? Math.max(0, pos.beat) : undefined} />
      {state === 'playing' && <button className="party-skip" onClick={() => { play.current?.stop(); onDone() }}>Skip ⏭</button>}
    </div>
  )
}

function Thanks({ name, onDone }: { name: string; onDone: () => void }) {
  const alive = useAlive()
  const [said, setSaid] = useState(false)
  useEffect(() => { speak(`Let's thank God for making you! Tap the heart and say it with me.`) }, [])
  const tap = async () => {
    if (said) return
    setSaid(true)
    sfx.sparkle()
    await speak(thanksLine(name))
    if (!alive.current) return
    await wait(400)
    if (alive.current) onDone()
  }
  return (
    <div className="party-thanks">
      <button className={`thanks-heart ${said ? 'said' : ''}`} onClick={tap} aria-label="Say thank you">
        <span className="thanks-big">💗</span>
        {said && <span className="thanks-burst" aria-hidden>{['💖', '💗', '✨', '💕', '💖', '✨'].map((h, i) => <i key={i} style={{ '--i': i } as React.CSSProperties}>{h}</i>)}</span>}
      </button>
      <p className="thanks-line">{thanksLine(name)}</p>
    </div>
  )
}

function Gift({ name, age, again, gifts, onOpen, onDone }: {
  name: string; age: number; again: boolean; gifts: { hat: boolean; pal: boolean; cake: boolean }; onOpen: () => void; onDone: () => void
}) {
  const alive = useAlive()
  const p = useProgress()
  const [open, setOpen] = useState(false)
  const buddy = palById(p.battler ?? p.starter ?? 'zippy')
  const sprinkles = palById(PARTY_PAL)
  useEffect(() => { speak('A present, just for you! Tap it to open it!') }, [])
  const unwrap = async () => {
    if (open) return
    setOpen(true)
    onOpen()
    sfx.fanfare()
    const lines = [
      again ? `What a wonderful party! Happy birthday, ${name}!` : `Happy birthday, ${name}! Here's your ${candles(age)} sticker, for your sticker book!`,
      gifts.hat ? 'And your Pals can wear party hats now! Dress them up on your Ark.' : '',
      gifts.pal ? `And look who came to your party! ${palIntro(sprinkles)}` : '',
      gifts.cake ? "And there's a birthday cake to bake in the Pal Kitchen, just for today!" : '',
    ].filter(Boolean)
    for (const l of lines) {
      if (!alive.current) return
      await speak(l, { interrupt: false })
    }
  }
  return (
    <div className="party-gift">
      {open && <Confetti count={60} />}
      {!open ? (
        <button className="gift-box" onClick={unwrap} aria-label="Open your present">🎁</button>
      ) : (
        <div className="gift-open">
          <div className="gift-sticker"><StickerFace s={ageSticker(age)} /><span>{cap(candles(age))}!</span></div>
          <div className="gift-row">
            {gifts.hat && <div className="gift-item"><DressedPal pal={buddy} stage={stageFor(buddy, p.pals[buddy.id] ?? 0)} size={120} outfit="partyhat" className="bob" /><span>Party hats!</span></div>}
            {gifts.pal && <div className="gift-item"><DressedPal pal={sprinkles} size={120} className="bob" /><span>{sprinkles.stages[0].name}</span></div>}
            {gifts.cake && <div className="gift-item"><span className="gift-cake">🎂</span><span>Bake a cake today!</span></div>}
          </div>
        </div>
      )}
      {open && <BigButton color="pink" onClick={onDone}>💖 Thank you!</BigButton>}
    </div>
  )
}

export default function BirthdayParty({ mode, age: knownAge, onDone }: { mode: PartyMode; age?: number; onDone: () => void }) {
  const p = useProgress()
  const { active, list } = useProfiles()
  const me = list.find((x) => x.id === active)!
  const name = me.name.trim() || 'friend'
  const [phase, setPhase] = useState<Phase>('surprise')
  const [age, setAge] = useState<number | undefined>(knownAge)
  const [leaving, setLeaving] = useState(false)
  // What's new this time (worked out before anything is given).
  const [gifts] = useState(() => {
    const pp = getProgress()
    return { hat: mode !== 'replay' && !hasAgeSticker(pp.stickers), pal: !(PARTY_PAL in pp.pals), cake: mode === 'day' }
  })
  // A grown-up's preview changes nothing: put everything back afterwards.
  const [before] = useState(() => getProgress())
  useEffect(() => {
    if (mode === 'day') update((x) => ({ ...x, partyShown: today() }))
    return () => { if (mode === 'preview') update(() => before) }
  }, [])
  // (The song brings its own music.)
  useEffect(() => { setMood(phase === 'song' ? null : phase === 'battle' ? 'battle' : phase === 'story' || phase === 'thanks' || phase === 'verse' ? 'story' : 'home') }, [phase])

  const story = useMemo(() => {
    const cast = castFor(me, list, getFamily())
    return partyStory({
      name, birthday: me.birthday, age,
      grownups: cast.grownups.map((g) => g.name), siblings: cast.siblings, pets: cast.pets.map((x) => x.name),
    })
  }, [age])
  useEffect(() => { if (phase === 'story') preload(story.map((pg, i) => (i === 0 ? `${storyTitle(name)}. ${pg.text}` : pg.text))) }, [phase])

  const go = (next: Phase) => setPhase(next)
  const pickAge = (n: number) => {
    setAge(n)
    if (mode !== 'replay') {
      addSticker(ageSticker(n))
      update((x) => ({ ...x, partyAge: n }))
    }
    go('candles')
  }
  const finish = () => {
    stopSpeaking()
    onDone()
  }
  const exit = () => { stopSpeaking(); pauseNarration(false); onDone() }
  const askToLeave = () => {
    setLeaving(true)
    stopSpeaking()
    speak('Leave the party?', { important: true })
    pauseNarration(true)
  }

  let body
  switch (phase) {
    case 'surprise': body = <Surprise name={name} p={p} onDone={() => go(age ? 'candles' : 'age')} />; break
    case 'age': body = <AgePick onPick={pickAge} />; break
    case 'candles': body = <CandlesOnCake n={age!} intro={`${cap(numberWords(age!))}! Put ${candles(age!)} on your cake! Drag them on.`} onDone={() => go('song')} />; break
    case 'song': body = <Song name={name} age={age!} p={p} onDone={() => go('blow')} />; break
    case 'blow': body = <BlowOut n={age!} onDone={() => go('story')} />; break
    case 'story': body = <StoryBook title={storyTitle(name)} pages={story} art={BIRTHDAY_ART} onDone={() => go('thanks')} />; break
    case 'thanks': body = <Thanks name={name} onDone={() => go('verse')} />; break
    case 'verse': body = <VerseBuilder chunks={BIRTHDAY_VERSE.chunks} reference={BIRTHDAY_VERSE.ref} onDone={() => go('battle')} />; break
    case 'battle': body = <FriendlyBattle foeId={PARTY_FOE} foeIntro={partyFoeIntro(name)} present={presentLine(palById(PARTY_FOE).stages[0].name, name)} onDone={() => go('gift')} />; break
    case 'gift': body = <Gift name={name} age={age ?? 1} again={mode === 'replay'} gifts={gifts} onOpen={() => { if (gifts.pal) addPalXp(PARTY_PAL, 0) }} onDone={finish} />; break
  }

  return (
    <PlayerArtProvider age={age}>
      <div className="screen island-screen party">
        <header className="island-head">
          <BackButton onClick={phase === 'gift' ? finish : askToLeave} />
          <StepDots total={STEPS.length} current={STEPS.findIndex((s) => s.includes(phase))} />
          <span className="party-tag">{mode === 'preview' ? 'Preview' : '🎂'}</span>
        </header>
        <div className="island-body" key={phase}>{body}</div>
        {leaving && (
          <div className="overlay">
            <h2>Leave the party?</h2>
            {age !== undefined && mode !== 'preview' && <p>You can play it again from your sticker book.</p>}
            <div className="leave-row">
              <BigButton color="white" onClick={() => { setLeaving(false); pauseNarration(false) }}>🎉 Keep partying</BigButton>
              <BigButton color="pink" onClick={exit}>🗺️ Map</BigButton>
            </div>
          </div>
        )}
      </div>
    </PlayerArtProvider>
  )
}
