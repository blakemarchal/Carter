// A sticker as it shows in the sticker book: its emoji, or for a birthday, a cake with the age on it
// ("5 candles": one from each birthday party, a yearly collection).
import { stickerAge } from '../lib/party'

export default function StickerFace({ s }: { s: string }) {
  const age = stickerAge(s)
  if (age === null) return <>{s}</>
  return <span className="age-sticker" aria-label={`${age} candles`}><span className="age-cake">🎂</span><b>{age}</b></span>
}
