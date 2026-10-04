// The Lost Sheep: one picture per story page, both parts in order (see data/lost-sheep.ts for the words).
// Built from the kit (./kit.tsx) and people (../people.tsx). God is never drawn as a person: His
// presence is light.
import type { ComponentType } from 'react'
import { Emoji, Scene, Tap } from './kit'

// 1. "TODO page 1"
function Page1() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 2. "TODO page 2"
function Page2() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 3. "TODO page 3"
function Page3() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 4. "TODO page 4"
function Page4() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 5. "TODO page 5"
function Page5() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 6. "TODO page 6"
function Page6() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 7. "TODO page 7"
function Page7() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 8. "TODO page 8"
function Page8() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 9. "TODO page 9"
function Page9() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

// 10. "TODO page 10"
function Page10() {
  return (
    <Scene sky="day" ground="meadow">
      <Tap say="TODO">
        <Emoji e="🐑" x={400} y={380} size={90} />
      </Tap>
    </Scene>
  )
}

export const LOST_SHEEP_ART: ComponentType[] = [Page1, Page2, Page3, Page4, Page5, Page6, Page7, Page8, Page9, Page10]
