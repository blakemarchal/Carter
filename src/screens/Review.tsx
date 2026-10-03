// For grown-ups proofreading the game (open /#review, or /#review/noah): every story page beside its
// narration, and every activity's pictures with what the narrator says for each. Not linked from the
// game itself; it's how we check that the pictures and the words agree before an island ships.
import { STORY_ART } from '../art/scenes'
import Pic from '../components/Pic'
import PlayerArtProvider from '../components/PlayerArt'
import { ISLANDS, type Step, type Thing } from '../data/islands'
import { palById } from '../data/pals'

const say = (t: Thing) => (
  <span className="rv-thing"><span className="rv-pic"><Pic e={t.emoji} art={t.art} /></span><span>&ldquo;{t.say}&rdquo;</span></span>
)

function StepView({ s, n }: { s: Step; n: number }) {
  const head = (title: string) => <h3>{n}. {title}</h3>
  switch (s.kind) {
    case 'story': return null
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
      return <section>{head(`Count: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo;</p><div className="rv-row">{say(s.item)} into <span className="rv-pic"><Pic e={s.basket} /></span> ({s.into ?? 'the basket'}), rounds {s.rounds.join(', ')}</div>{s.done && <p>Then: &ldquo;{s.done}&rdquo;</p>}</section>
    case 'trace':
      return <section>{head(`Trace: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo; Letters: {s.letters.join(' ')}</p></section>
    case 'maze':
      return <section>{head(`Maze: ${s.title}`)}<p>&ldquo;{s.intro}&rdquo;</p><div className="rv-row">{say(s.hero)} to {say(s.goal)}{s.trail && <> trail <span className="rv-pic"><Pic e={s.trail} /></span></>}{s.theme && <> ({s.theme})</>}</div></section>
    case 'verse':
      return <section>{head(`Memory verse (${s.ref})`)}<p>&ldquo;{s.chunks.join(' ')}&rdquo;</p></section>
    case 'battle':
      return <section>{head(`Battle: ${palById(s.foe).stages[0].name}`)}<p>&ldquo;{s.intro}&rdquo;</p></section>
    case 'pause':
      return <section>{head('End of a visit')}<p>&ldquo;{s.line}&rdquo;</p></section>
    case 'reward':
      return <section>{head(`Reward: ${palById(s.pal).stages[0].name}`)}<div className="rv-row">sticker {say({ emoji: s.sticker, say: s.stickerName })}</div></section>
  }
}

export default function Review({ route }: { route: string }) {
  const only = route.split('/')[1]
  const islands = ISLANDS.filter((i) => !only || i.id === only)
  return (
    <PlayerArtProvider>
      <div className="review">
        <h1>Review {only ? `· ${islands[0]?.name ?? only}` : ''}</h1>
        <p className="muted">Each picture beside what the narrator says. Islands: {ISLANDS.map((i) => <a key={i.id} href={`#review/${i.id}`} onClick={() => setTimeout(() => location.reload())}>{i.name} </a>)}</p>
        {islands.map((isl) => {
          const story = isl.steps?.find((s) => s.kind === 'story')
          const art = STORY_ART[isl.id] ?? []
          return (
            <article key={isl.id}>
              <h2>{isl.emoji} {isl.name}</h2>
              {story?.kind === 'story' && story.pages.map((pg, i) => {
                const Art = art[i]
                return (
                  <div key={i} className="rv-page">
                    <div className="rv-art">{Art ? <Art /> : <div className="rv-scene">{pg.scene}</div>}</div>
                    <div className="rv-text"><b>Page {i + 1}</b><p>{i === 0 ? `${story.title}. ` : ''}{pg.text}</p></div>
                  </div>
                )
              })}
              {isl.steps?.map((s, i) => <StepView key={i} s={s} n={i + 1} />)}
            </article>
          )
        })}
      </div>
    </PlayerArtProvider>
  )
}
