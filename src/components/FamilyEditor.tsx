// Parent Corner: each player's birthday and look, and the family cast (the names in the stories).
// Only a birthday's month and day are kept, never the year.
import { useState } from 'react'
import { MONTHS, type Birthday } from '../lib/birthday'
import { FAVORITE_COLORS, HAIR_COLORS, HAIR_STYLES, SKIN_TONES } from '../lib/look'
import { isGrownup } from '../lib/party'
import { DEFAULT_LOOK, editProfile, setFamily, useFamily, type FamilyCast, type KidLook, type Profile } from '../lib/progress'
import { kidLook, Person, SKIN } from '../art/people'

const DAYS_IN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/** Month and day pickers ("no birthday" is the first month choice). */
export function BirthdayPicker({ value, onChange }: { value?: Birthday; onChange: (b: Birthday | undefined) => void }) {
  return (
    <span className="bday-pick">
      <select aria-label="Birthday month" value={value?.month ?? 0}
        onChange={(e) => {
          const month = Number(e.target.value)
          onChange(month ? { month, day: Math.min(value?.day ?? 1, DAYS_IN[month - 1]) } : undefined)
        }}>
        <option value={0}>No birthday set</option>
        {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
      </select>
      {value && (
        <select aria-label="Birthday day" value={value.day} onChange={(e) => onChange({ ...value, day: Number(e.target.value) })}>
          {Array.from({ length: DAYS_IN[value.month - 1] }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
        </select>
      )}
    </span>
  )
}

const HAIR_LABEL: Record<KidLook['hair'], string> = { short: 'Short', ponytail: 'Ponytail', pigtails: 'Pigtails', curly: 'Curly', long: 'Long' }

/** How a child looks in the story pictures, with a preview. */
function LookPicker({ look, onChange }: { look: KidLook; onChange: (l: KidLook) => void }) {
  const set = (k: Partial<KidLook>) => onChange({ ...look, ...k })
  return (
    <div className="look-pick">
      <svg className="look-preview" viewBox="-60 -128 120 134" aria-label="How they look in the stories">
        <ellipse cx={0} cy={2} rx={34} ry={6} fill="#00000014" />
        <Person x={0} y={0} s={1} look={kidLook(look)} pose="wave" />
      </svg>
      <div className="look-rows">
        <div className="look-row"><span>Skin</span>
          {SKIN_TONES.map((t) => <button key={t} className={`swatch ${look.skin === t ? 'on' : ''}`} style={{ background: SKIN[t] }} aria-label={t} onClick={() => set({ skin: t })} />)}
        </div>
        <div className="look-row"><span>Hair</span>
          {HAIR_STYLES.map((h) => <button key={h} className={`chip ${look.hair === h ? 'on' : ''}`} onClick={() => set({ hair: h })}>{HAIR_LABEL[h]}</button>)}
        </div>
        <div className="look-row"><span>Hair color</span>
          {HAIR_COLORS.map((c) => <button key={c} className={`swatch ${look.hairColor === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Hair color ${c}`} onClick={() => set({ hairColor: c })} />)}
        </div>
        <div className="look-row"><span>Favorite color</span>
          {FAVORITE_COLORS.map((c) => <button key={c} className={`swatch ${look.color === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Favorite color ${c}`} onClick={() => set({ color: c })} />)}
        </div>
      </div>
    </div>
  )
}

/** One player's details: birthday, grown-up or child, and their look. */
export function PlayerDetails({ profile }: { profile: Profile }) {
  const grown = isGrownup(profile)
  return (
    <div className="player-details">
      <div className="detail-row">
        <span>Birthday</span>
        <BirthdayPicker value={profile.birthday} onChange={(birthday) => editProfile(profile.id, { birthday })} />
      </div>
      <div className="detail-row">
        <span>This player is</span>
        <button className={`chip ${!grown ? 'on' : ''}`} onClick={() => editProfile(profile.id, { grownup: false })}>a child</button>
        <button className={`chip ${grown ? 'on' : ''}`} onClick={() => editProfile(profile.id, { grownup: true })}>a grown-up</button>
      </div>
      <p className="muted">
        {grown
          ? 'Grown-ups can play too, but they’re not in the children’s stories.'
          : 'On their birthday, a surprise party starts when they open the game. The week before, their Pal counts the sleeps.'}
      </p>
      {!grown && <LookPicker look={profile.look ?? DEFAULT_LOOK} onChange={(look) => editProfile(profile.id, { look })} />}
    </div>
  )
}

// (Each of these is drawn in the birthday pictures: art/items, or the hamster and turtle in art/scenes/birthday.tsx.)
const PETS = ['🐶', '🐱', '🐰', '🐹', '🐠', '🐦', '🐢']

/** The family cast: what the children call their grown-ups, brothers and sisters, and pets. */
export function FamilyCastEditor() {
  const family = useFamily()
  const [draft, setDraft] = useState<FamilyCast | null>(null)
  const f = draft ?? family
  // Typing edits a draft; it's saved when a field loses focus (and right away for buttons).
  const edit = (next: FamilyCast, now = false) => {
    if (now) {
      setDraft(null)
      setFamily(next)
    } else setDraft(next)
  }
  const save = () => {
    if (!draft) return
    setFamily({
      ...draft,
      mom: draft.mom.trim(), dad: draft.dad.trim(),
      siblings: draft.siblings.map((s) => ({ ...s, name: s.name.trim() })).filter((s) => s.name),
      pets: draft.pets.map((p) => ({ ...p, name: p.name.trim() })).filter((p) => p.name),
    })
    setDraft(null)
  }
  return (
    <div className="family-cast" onBlur={save}>
      <div className="detail-row">
        <span>Grown-ups</span>
        <input value={f.mom} maxLength={16} placeholder="(none)" aria-label="What the children call their mom" onChange={(e) => edit({ ...f, mom: e.target.value })} />
        <input value={f.dad} maxLength={16} placeholder="(none)" aria-label="What the children call their dad" onChange={(e) => edit({ ...f, dad: e.target.value })} />
      </div>
      <p className="muted">What the children call you, like &ldquo;Mommy&rdquo; or &ldquo;Papa&rdquo;. Leave one blank to leave it out of the stories.</p>
      <div className="detail-row top">
        <span>Brothers &amp; sisters</span>
        <div className="cast-list">
          {f.siblings.map((s, i) => (
            <div key={i} className="cast-row">
              <input value={s.name} maxLength={16} placeholder="Name" aria-label="Brother or sister's name"
                onChange={(e) => edit({ ...f, siblings: f.siblings.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} />
              <label className="check"><input type="checkbox" checked={!!s.baby}
                onChange={(e) => edit({ ...f, siblings: f.siblings.map((x, k) => (k === i ? { ...x, baby: e.target.checked } : x)) }, true)} /> baby</label>
              <BirthdayPicker value={s.birthday} onChange={(birthday) => edit({ ...f, siblings: f.siblings.map((x, k) => (k === i ? { ...x, birthday } : x)) }, true)} />
              <button className="danger" onClick={() => edit({ ...f, siblings: f.siblings.filter((_, k) => k !== i) }, true)}>Remove</button>
            </div>
          ))}
          <button onClick={() => edit({ ...f, siblings: [...f.siblings, { name: '' }] })}>+ Add a brother or sister</button>
        </div>
      </div>
      <p className="muted">Only ones who don&rsquo;t have a player of their own (players are brothers and sisters already). With a birthday set, the others hear &ldquo;Today is ___&rsquo;s birthday!&rdquo; that day.</p>
      <div className="detail-row top">
        <span>Pets</span>
        <div className="cast-list">
          {f.pets.map((pet, i) => (
            <div key={i} className="cast-row">
              <button className="emoji-pick" aria-label="Change animal"
                onClick={() => edit({ ...f, pets: f.pets.map((x, k) => (k === i ? { ...x, emoji: PETS[(PETS.indexOf(x.emoji) + 1) % PETS.length] } : x)) }, true)}>{pet.emoji}</button>
              <input value={pet.name} maxLength={16} placeholder="Name" aria-label="Pet's name"
                onChange={(e) => edit({ ...f, pets: f.pets.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} />
              <button className="danger" onClick={() => edit({ ...f, pets: f.pets.filter((_, k) => k !== i) }, true)}>Remove</button>
            </div>
          ))}
          <button onClick={() => edit({ ...f, pets: [...f.pets, { name: '', emoji: PETS[0] }] })}>+ Add a pet</button>
        </div>
      </div>
    </div>
  )
}
