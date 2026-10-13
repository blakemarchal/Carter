// When plans are enforced and this family has none (or the iPad hasn't been online for over a week): a calm
// screen for the grown-ups. Nothing is spoken and nothing says the child did anything: the Pals are resting.
// A grown-up holds the gear for the Parent Corner, where the family's plan is.
import { useState } from 'react'
import './Resting.css'
import PalArt from '../components/PalArt'
import { Arrow, BigButton, HoldButton } from '../components/ui'
import { palById } from '../data/pals'
import type { Access } from '../lib/billing'

export default function Resting({ why, onParent, onBack, onRetry }: {
  why: Extract<Access, { allowed: false }>['why']; onParent: () => void; onBack: () => void; onRetry: () => Promise<void>
}) {
  const [checking, setChecking] = useState(false)
  return (
    <div className="screen resting">
      <div className="resting-pals" aria-hidden>
        <PalArt pal={palById('zippy')} size={110} className="sleepy-pal" />
        <PalArt pal={palById('ember')} size={130} className="sleepy-pal" />
      </div>
      <h2>The Pals are resting</h2>
      <div className="resting-note">
        <p><b>For grown-ups:</b>{' '}
          {why === 'offline-too-long'
            ? 'Ark Pals checks your family’s plan once a week, and this device hasn’t been online for a while. Connect to the internet and it will open again.'
            : 'your family’s Ark Pals plan isn’t active right now. Hold the ⚙️ for 3 seconds to open the Parent Corner and choose a plan. Everyone’s progress is kept.'}
        </p>
      </div>
      <div className="leave-row">
        <BigButton color="white" onClick={onBack}><Arrow dir="left" /> Back</BigButton>
        <BigButton color="white" disabled={checking} onClick={async () => { setChecking(true); await onRetry(); setChecking(false) }}>
          {checking ? 'Checking…' : '🔄 Check again'}
        </BigButton>
        <HoldButton onHold={onParent} className="parent-gear">⚙️</HoldButton>
      </div>
    </div>
  )
}
