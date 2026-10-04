// Catch it: catch what falls (manna into a basket, rain into a jar, fish into a net). See types.ts, CatchKit.
// (Not built yet: GamePlaceholder shows the kit's backdrop and a button to go on.)
import type { CatchKit } from './types'
import { GamePlaceholder } from './Placeholder'

export default function CatchIt({ title, intro, done, kit, onDone }: {
  title: string; intro: string; done: string; plural: string; kit: CatchKit; onDone: () => void
}) {
  return <GamePlaceholder title={title} intro={intro} done={done} onDone={onDone} backdrop={<kit.Backdrop caught={0} />} />
}
