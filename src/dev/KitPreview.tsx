// Development only (#gallery/kit/<island>): every piece of an island's mini-game kit, drawn where it
// goes, as gallery tiles (scripts/film/gallery.mjs pictures each one). Dashed circles show where a tap
// finds a hidden thing; a dashed line shows the way to steer.
import type { ReactNode } from 'react'
import { Board, BoardLayer } from '../activities/games/Board'
import { islandById } from '../data/islands'
import Pic from '../components/Pic'

function Tile({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div data-name={name} style={{ width: 560, height: 315, position: 'relative', display: 'flex' }}>
      <Board>{children}</Board>
    </div>
  )
}

export default function KitPreview({ island }: { island: string }) {
  const steps = islandById(island)?.steps ?? []
  const tiles: ReactNode[] = []
  steps.forEach((s, n) => {
    const at = `${island} step ${n + 1} (${s.kind})`
    if (s.kind === 'build') {
      const k = s.kit
      tiles.push(
        <Tile key={`${n}a`} name={`${at}: outlines`}>
          <k.Backdrop />
          <BoardLayer>{k.parts.map((p) => <g key={p.id} transform={`translate(${p.at[0]} ${p.at[1]})`} opacity={0.3}><p.Draw /></g>)}</BoardLayer>
        </Tile>,
        <Tile key={`${n}b`} name={`${at}: built`}>
          <k.Backdrop />
          <BoardLayer>
            {k.parts.map((p) => <g key={p.id} transform={`translate(${p.at[0]} ${p.at[1]})`}><p.Draw /></g>)}
            {k.Finished && <k.Finished />}
          </BoardLayer>
        </Tile>,
      )
    }
    if (s.kind === 'spot') {
      const k = s.kit
      for (const found of [false, true]) {
        tiles.push(
          <Tile key={`${n}${found}`} name={`${at}: ${found ? 'all found' : 'hidden'}`}>
            <k.Picture />
            <BoardLayer>
              {k.targets.map((t) => <g key={t.id} transform={`translate(${t.at[0]} ${t.at[1]})`}><t.Draw found={found} /></g>)}
              {k.Front && <k.Front />}
              {!found && k.targets.map((t) => <circle key={t.id} cx={t.at[0]} cy={t.at[1]} r={t.r} fill="none" stroke="#ff2d7a" strokeWidth={2} strokeDasharray="6 5" />)}
            </BoardLayer>
          </Tile>,
        )
      }
    }
    if (s.kind === 'paint') {
      const k = s.kit
      const color = (num: number) => k.palette.find((p) => p.n === num)?.color ?? '#000'
      tiles.push(
        <Tile key={`${n}a`} name={`${at}: numbers`}>
          <k.Picture fills={{}} />
          <BoardLayer>{k.regions.map((r) => <text key={r.id} x={r.at[0]} y={r.at[1] + 9} textAnchor="middle" fontSize={26} fontWeight={800} fill="#5a3a24">{r.n}</text>)}</BoardLayer>
        </Tile>,
        <Tile key={`${n}b`} name={`${at}: painted`}>
          <k.Picture fills={Object.fromEntries(k.regions.map((r) => [r.id, color(r.n)]))} />
        </Tile>,
      )
    }
    if (s.kind === 'steer') {
      const k = s.kit
      for (const end of [false, true]) {
        const [hx, hy] = end ? k.path[k.path.length - 1] : k.path[0]
        tiles.push(
          <Tile key={`${n}${end}`} name={`${at}: ${end ? 'at the goal' : 'start'}`}>
            <k.Backdrop progress={end ? 1 : 0} />
            <BoardLayer>
              <polyline points={k.path.map((p) => p.join(',')).join(' ')} fill="none" stroke="#ff2d7a" strokeWidth={3} strokeDasharray="8 6" />
              {k.collect?.map((c, i) => <g key={i} transform={`translate(${c.at[0]} ${c.at[1]})`}><c.Draw taken={end} /></g>)}
              <g transform={`translate(${k.path[k.path.length - 1].join(' ')})`}><k.Goal /></g>
              {k.followers?.map((F, i) => <g key={i} transform={`translate(${hx - (i + 1) * 60} ${hy})`}><F /></g>)}
              <g transform={`translate(${hx} ${hy})`}><k.Hero moving={false} facing={1} /></g>
              {k.Front && <k.Front progress={end ? 1 : 0} />}
            </BoardLayer>
          </Tile>,
        )
      }
    }
    if (s.kind === 'rhythm') {
      const k = s.kit
      tiles.push(
        <Tile key={`${n}a`} name={`${at}: start`}><k.Backdrop beat={0} hits={0} /></Tile>,
        <Tile key={`${n}b`} name={`${at}: playing`}><k.Backdrop beat={6.5} hits={6} /></Tile>,
      )
    }
    if (s.kind === 'share') {
      const k = s.kit
      tiles.push(
        <Tile key={`${n}a`} name={`${at}: people`}>
          <BoardLayer>
            <rect width={800} height={450} fill="#fff4e0" />
            {k.people.map((p, i) => <g key={p.id} transform={`translate(${130 + i * (540 / Math.max(1, k.people.length - 1))} 250)`}><p.Draw /></g>)}
          </BoardLayer>
          <div style={{ position: 'absolute', left: 16, top: 12, fontSize: 48, width: 'auto', height: 'auto' }}><Pic e={k.item.emoji} art={k.item.art} /></div>
        </Tile>,
      )
    }
  })
  return (
    <div className="gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: '#fff', height: '100%', overflow: 'auto', alignContent: 'flex-start' }}>
      {tiles.length ? tiles : <p>No mini-game on {island} yet.</p>}
    </div>
  )
}
