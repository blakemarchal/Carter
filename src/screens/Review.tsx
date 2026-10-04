// For grown-ups proofreading the game (open /#review, or /#review/noah): every story page beside its
// narration, and every activity's pictures with what the narrator says for each. Not linked from the
// game itself; it's how we check that the pictures and the words agree before an island ships.
import type { ReactNode } from 'react'
import Pic from '../components/Pic'
import PlayerArtProvider from '../components/PlayerArt'
import { ISLANDS, type Island, type Step, type Thing } from '../data/islands'
import { useAllIslands } from '../lib/useIsland'
import { palById } from '../data/pals'
import { SONGS } from '../data/songs'
import { Board, BoardLayer } from '../activities/games/Board'

const say = (t: Thing) => (
  <span className="rv-thing"><span className="rv-pic"><Pic e={t.emoji} art={t.art} /></span><span>&ldquo;{t.say}&rdquo;</span></span>
)

/** A mini-game's kit with everything in place (the parts built, the people ready, the hidden things hidden). */
function KitPicture({ s }: { s: Step }) {
  let layers: ReactNode = null
  if (s.kind === 'build') {
    const k = s.kit
    layers = <><k.Backdrop /><BoardLayer>{k.parts.map((p) => <g key={p.id} transform={`translate(${p.at[0]} ${p.at[1]})`}><p.Draw /></g>)}{k.Finished && <k.Finished />}</BoardLayer></>
  } else if (s.kind === 'spot') {
    const k = s.kit
    layers = <><k.Picture /><BoardLayer>{k.targets.map((t) => <g key={t.id} transform={`translate(${t.at[0]} ${t.at[1]})`}><t.Draw found={false} /></g>)}{k.Front && <k.Front />}</BoardLayer></>
  } else if (s.kind === 'paint') {
    const k = s.kit
    layers = <k.Picture fills={Object.fromEntries(k.regions.map((r) => [r.id, k.palette.find((c) => c.n === r.n)?.color ?? '#fff']))} />
  } else if (s.kind === 'steer') {
    const k = s.kit
    const [x, y] = k.path[0]
    layers = (
      <><k.Backdrop progress={0} /><BoardLayer>
        {k.collect?.map((c, i) => <g key={i} transform={`translate(${c.at[0]} ${c.at[1]})`}><c.Draw taken={false} /></g>)}
        <g transform={`translate(${k.path[k.path.length - 1].join(' ')})`}><k.Goal /></g>
        <g transform={`translate(${x} ${y})`}><k.Hero moving={false} facing={1} /></g>
        {k.Front && <k.Front progress={0} />}
      </BoardLayer></>
    )
  } else if (s.kind === 'rhythm') {
    const k = s.kit
    layers = <k.Backdrop beat={0} hits={0} />
  } else if (s.kind === 'catch') {
    const k = s.kit
    layers = (
      <><k.Backdrop caught={0} /><BoardLayer>
        {k.falling.map((F, i) => <g key={i} transform={`translate(${k.lane.from + ((i + 1) * (k.lane.to - k.lane.from)) / (k.falling.length + 1)} 120)`}><F /></g>)}
        <g transform={`translate(${(k.lane.from + k.lane.to) / 2} ${k.lane.y})`}><k.Catcher fill={0.5} /></g>
        {k.Front && <k.Front />}
      </BoardLayer></>
    )
  } else if (s.kind === 'share') {
    const k = s.kit
    layers = <BoardLayer><rect width={800} height={450} fill="#fff4e0" />{k.people.map((p, i) => <g key={p.id} transform={`translate(${130 + i * (540 / Math.max(1, k.people.length - 1))} 250)`}><p.Draw /></g>)}</BoardLayer>
  }
  return <div className="rv-art rv-kit"><Board>{layers}</Board></div>
}

const q = (t: string) => <>&ldquo;{t}&rdquo;</>

function StepView({ s, n }: { s: Step; n: number }) {
  const head = (title: string) => <h3>{n}. {title}</h3>
  const game = (kind: string, title: string, intro: string, done: string, more: ReactNode) => (
    <section>{head(`Mini-game (${kind}): ${title}`)}
      <div className="rv-page"><KitPicture s={s} /><div className="rv-text"><p>{q(intro)}</p><p>{more}</p><p>Then: {q(done)}</p></div></div>
    </section>
  )
  switch (s.kind) {
    case 'story': return null
    case 'build':
      return game('build it', s.title, s.intro, s.done, <>Parts: {s.kit.parts.map((p) => p.say).join(', ')}</>)
    case 'spot':
      return game('spot it', s.title, s.intro, s.done, <>{s.kit.targets.length} {s.plural}{s.kit.targets.some((t) => t.say) ? `: ${s.kit.targets.map((t) => t.say ?? '').join(' / ')}` : ', counted aloud'}</>)
    case 'paint':
      return game('paint it', s.title, s.intro, s.done, <>{s.kit.regions.length} places to paint. Paints: {s.kit.palette.map((c) => `${c.n} ${c.name}`).join(', ')}</>)
    case 'steer':
      return game('steer it', s.title, s.intro, s.done, <>{s.kit.followers?.length ?? 0} following, {s.kit.collect?.length ?? 0} to pick up on the way</>)
    case 'rhythm':
      return game('rhythm', s.title, s.intro, s.done, <>{s.kit.instrument}, {s.kit.notes.length} notes at {s.kit.bpm} beats a minute</>)
    case 'share':
      return game('share it', s.title, s.intro, s.done, <>{say(s.kit.item)} ({s.kit.plural}) among {s.kit.people.map((p) => p.say).join(', ')}; rounds {s.kit.rounds.map((r) => `${r.items} for ${r.people}`).join(', ')}</>)
    case 'catch':
      return game('catch it', s.title, s.intro, s.done, <>Catch {s.kit.goal} {s.plural}</>)
    case 'song': {
      const song = SONGS.find((x) => x.id === s.song)
      return (
        <section>{head(`Song: ${song?.title ?? `${s.song} (not made yet)`}`)}<p>{q(s.intro)}</p>
          {song && <p className="muted">{song.lines.map((l) => l.words.map(([w]) => w).join(' ')).join(' / ')}</p>}
        </section>
      )
    }
    case 'pairs':
      return <section>{head('Memory match (two by two)')}<div className="rv-row">{s.animals.map((a) => <span key={a}>{say({ emoji: a, say: s.names[a] ?? '?' })}</span>)}</div></section>
    case 'practice':
      return <section>{head(`Practice: ${s.title} (${s.skill})`)}<p>&ldquo;{s.intro}&rdquo;</p>{s.theme && <div className="rv-row">counts: {say({ emoji: s.theme, say: '' })}</div>}</section>
    case 'sequence':
      return <section>{head(`Put in order: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo;</p><div className="rv-row">{s.items.map((t, i) => <span key={i}>{i + 1}. {say(t)}</span>)}</div></section>
    case 'sort':
      return (
        <section>{head(`Sort: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo;{s.hint && <> Hint: &ldquo;{s.hint}&rdquo;</>}</p>
          <div className="rv-row">groups: {s.groups.map((g) => <span key={g.id}>{say(g)}</span>)}</div>
          <div className="rv-row">{s.items.map((t, i) => <span key={i}>{say(t)} → {s.groups.find((g) => g.id === t.group)?.say}</span>)}</div>
        </section>
      )
    case 'quiz':
      return (
        <section>{head(`Quiz: ${s.title}`)}
          {s.questions.map((q, i) => (
            <div key={i} className="rv-q"><p>&ldquo;{q.say}&rdquo;</p><div className="rv-row">{q.choices.map((c, k) => <span key={k} className={k === q.answer ? 'rv-right' : ''}>{say(c)}</span>)}</div></div>
          ))}
        </section>
      )
    case 'count':
      return <section>{head(`Count: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo;</p><div className="rv-row">{say(s.item)} into <span className="rv-pic"><Pic e={s.basket} art={s.basketArt} /></span> ({s.into ?? 'the basket'}), rounds {s.rounds.join(', ')}</div>{s.done && <p>Then: &ldquo;{s.done}&rdquo;</p>}</section>
    case 'trace':
      return <section>{head(`Trace: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo; Letters: {s.letters.join(' ')}</p></section>
    case 'maze':
      return <section>{head(`Maze: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo;</p><div className="rv-row">{say(s.hero)} to {say(s.goal)}{s.trail && <> trail <span className="rv-pic"><Pic e={s.trail} /></span></>}{s.theme && <> ({s.theme})</>}</div></section>
    case 'verse':
      return <section>{head(`Memory verse (${s.ref})`)}<p>&ldquo;{s.chunks.join(' ')}&rdquo;</p></section>
    case 'battle':
      return <section>{head(`Battle: ${palById(s.foe)?.stages[0].name ?? `${s.foe} (not a Pal yet)`}`)}<p>&ldquo;{s.intro}&rdquo;</p></section>
    case 'pause':
      return <section>{head('End of the visit ("To be continued")')}<p>&ldquo;{s.line}&rdquo;</p></section>
    case 'reward':
      return <section>{head(`Reward: ${palById(s.pal)?.stages[0].name ?? `${s.pal} (not a Pal yet)`}`)}<div className="rv-row">sticker {say({ emoji: s.sticker, art: s.sticker, say: s.stickerName })}</div></section>
  }
}

/** An island step by step, visit by visit; story pages are numbered as story cards count them. */
function IslandView({ isl }: { isl: Island }) {
  const art = isl.art
  let visit = 1
  return (
    <article>
      <h2>{isl.emoji} {isl.name}</h2>
      <h3 className="rv-visit">Visit 1</h3>
      {isl.steps.map((s, i) => {
        const out: ReactNode[] = []
        if (s.kind === 'story') {
          const first = s.first ?? 0
          out.push(<h3 key={`h${i}`}>{i + 1}. Story: {s.title}</h3>)
          s.pages.forEach((pg, k) => {
            const Art = art[first + k]
            out.push(
              <div key={`${i}-${k}`} className="rv-page">
                <div className="rv-art">{Art ? <Art /> : <div className="rv-scene">{pg.scene}</div>}</div>
                <div className="rv-text"><b>Page {first + k + 1}</b><p>{k === 0 ? `${s.title}. ` : ''}{pg.text}</p></div>
              </div>,
            )
          })
        } else {
          out.push(<StepView key={i} s={s} n={i + 1} />)
        }
        if (s.kind === 'pause') out.push(<h3 key={`v${i}`} className="rv-visit">Visit {++visit}</h3>)
        return out
      })}
    </article>
  )
}

export default function Review({ route }: { route: string }) {
  const only = route.split('/')[1]
  const shown = ISLANDS.filter((i) => !only || i.id === only)
  const islands = useAllIslands(shown.map((i) => i.id))
  return (
    <PlayerArtProvider>
      <div className="review">
        <h1>Review {only ? `· ${shown[0]?.name ?? only}` : ''}</h1>
        <p className="muted">Each picture beside what the narrator says. Islands: {ISLANDS.map((i) => <a key={i.id} href={`#review/${i.id}`} onClick={() => setTimeout(() => location.reload())}>{i.name} </a>)}</p>
        {!islands && <p className="muted">Getting the islands…</p>}
        {islands?.map((isl) => <IslandView key={isl.id} isl={isl} />)}
      </div>
    </PlayerArtProvider>
  )
}
