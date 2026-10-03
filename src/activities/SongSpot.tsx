// The song spot at the end of an island (its third visit): the island's song to sing along with.
// Once the island is done, the song is in the sing-along on the Ark too (screens/SingAlong.tsx).
import { useEffect } from 'react'
import { SONGS } from '../data/songs'
import { Player } from '../screens/SingAlong'

export default function SongSpot({ song: id, intro, onDone }: { song: string; intro: string; onDone: () => void }) {
  const song = SONGS.find((s) => s.id === id)
  // (A song that hasn't been made yet is skipped.)
  useEffect(() => { if (!song) onDone() }, [])
  if (!song) return null
  return (
    <div className="song-spot">
      <Player song={song} onDone={onDone} inIsland say={intro} />
    </div>
  )
}
