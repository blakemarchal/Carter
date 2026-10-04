// Grumbleshade's arc (docs/GAME-PLAN.md §3.3). He's the pouty shadow who hides inside the creature in
// every battle (activities/FriendlyBattle.tsx). Island by island, as kindness chases him off, the child
// hears why he's grumpy: he thinks nobody could love him. On Easter Morning he doesn't float away. He
// hears that God loves everyone, even him, and becomes Gladshade, a Pal (data/pals.ts). After that, a
// battle's shadow is just a little grumpy cloud, which pops into happy sparkles.
// Everything here is said by the narrator: no emoji or symbols (src/__tests__/shade.test.ts).

/** The island where Grumbleshade finds out God loves him too. */
export const FINALE_ISLAND = 'easter'
/** The Pal he becomes there. */
export const GLADSHADE = 'gladshade'

/** What Grumbleshade grumbles as he floats away from each island, in the order of the voyage. */
export const SHADE_LINES: Record<string, string> = {
  // In the Beginning
  creation: 'Grumbleshade grumbled as he floated away, "Everybody loves the sunshine. Nobody loves a shadow."',
  noah: 'Grumbleshade grumbled, "Everyone got to go on the big boat, two by two. Nobody wants a grumpy shadow on their boat."',
  abraham: 'Grumbleshade grumbled, "God has so many people to love, like the stars. He wouldn\'t count a little shadow like me."',
  joseph: 'Grumbleshade grumbled, "Joseph forgave his brothers. But nobody would ever forgive a grumpy shadow."',
  // Out of Egypt
  'baby-moses': 'Grumbleshade sniffed, "Baby Moses had his big sister watching over him. Nobody watches over me."',
  'burning-bush': 'Grumbleshade muttered, "God called Moses by his name. I bet God doesn\'t even know my name."',
  'red-sea': 'Grumbleshade grumbled, "God made a path through the sea for His people. He wouldn\'t make a path for me."',
  manna: 'Grumbleshade grumbled, "God gave everyone bread from heaven. Shadows never get anything."',
  // The Promised Land
  jericho: 'Grumbleshade muttered, "Everyone cheered when the walls fell down. Nobody ever cheers for me."',
  ruth: 'Grumbleshade sighed, "Ruth said, \'Where you go, I will go.\' I wish someone would say that to me."',
  samuel: 'Grumbleshade sighed, "God talked to Samuel in the night. I\'m always in the dark, and nobody talks to me."',
  david: 'Grumbleshade muttered, "God was with little David. But God isn\'t with a little shadow like me."',
  // Kings & Prophets
  elijah: 'Grumbleshade sighed, "God sent ravens to take care of Elijah. Nobody ever takes care of me."',
  esther: 'Grumbleshade sighed, "Queen Esther was so brave. I\'m just grumpy. Who could like a grumpy shadow?"',
  daniel: 'Grumbleshade mumbled, "God kept Daniel safe from the lions. God wouldn\'t keep me safe."',
  jonah: 'Grumbleshade said slowly, "God gave Jonah a second chance. Maybe… no. Nobody gives a grumpy shadow a second chance."',
  // Jesus Comes
  christmas: 'Grumbleshade whispered, "The angels said Jesus is good news for all people. All people… but not shadows. Right?"',
  'boy-jesus': 'Grumbleshade sighed, "Jesus was in His Father\'s house. I don\'t have a home anywhere."',
  fishers: 'Grumbleshade sniffed, "Jesus said, \'Come, follow Me.\' He would never say that to me."',
  storm: 'Grumbleshade said quietly, "Jesus made the wind and the waves calm down. I wish He would make me calm, too."',
  // Jesus' Stories & Miracles
  loaves: 'Grumbleshade sighed, "Jesus fed thousands and thousands of people. I wonder if there was any for me."',
  'lost-sheep': 'Grumbleshade whispered, "The shepherd looked and looked for one little lost lamb. Would anyone ever look for me?"',
  samaritan: 'Grumbleshade asked softly, "The kind man helped someone who wasn\'t even his friend. Would anyone be kind to me?"',
  zacchaeus: 'Grumbleshade whispered, "Jesus went to Zacchaeus\' house, even though everyone grumbled. Could Jesus love… a grumbly shadow, too?"',
  // Easter & Beyond (Easter Morning is the finale; after it, Pentecost has the little grumpy cloud)
  'palm-sunday': '"Hosanna," Grumbleshade whispered from far away. "I wish I could sing, too."',
}

/** Who hides inside the creature in a battle, and how it ends. */
export type ShadeTurn =
  /** Grumbleshade floats away, saying his line for this island (none: a birthday, or no line yet). */
  | { kind: 'grumble'; line?: string }
  /** Easter Morning: he stops and listens, and becomes Gladshade. */
  | { kind: 'finale' }
  /** After that: a little grumpy cloud, which pops into happy sparkles. */
  | { kind: 'cloud' }

/** `island`: the battle's island (none at a birthday party). `glad`: the child has Gladshade already. */
export function shadeFor(island: string | undefined, glad: boolean): ShadeTurn {
  if (glad) return { kind: 'cloud' }
  if (island === FINALE_ISLAND) return { kind: 'finale' }
  return { kind: 'grumble', line: island ? SHADE_LINES[island] : undefined }
}

/** The narrator's lines around the shadow. `foe` is the grumpy creature's name. */
export const SHADE_SAY = {
  /** Grumbleshade swoops in. */
  intro: (foe: string) => `It's Grumbleshade, the grumpy shadow! Grumbleshade is making ${foe} grumpy.`,
  /** After the finale, a little grumpy cloud. */
  cloudIntro: (foe: string) => `Oh! A little grumpy cloud is making ${foe} grumpy. Gladshade knows just how that feels!`,
  /** The shadow is chased out (then comes the island's line, or the finale). */
  chased: (foe: string) => `Kindness chased the shadow away! ${foe} is happy again!`,
  /** Where there's no line: a birthday party, or an island without one. */
  chasedPlain: (foe: string) => `Kindness chased the shadow away! Grumbleshade floated off, grumbling. ${foe} is happy again!`,
  /** After the finale: the little grumpy cloud pops. */
  cloudChased: (foe: string) => `Kindness chased the grumpy cloud away! It popped into happy sparkles. ${foe} is happy again!`,
  /** Easter Morning, after the shadow is chased out of the creature, in order. */
  finale: {
    listen: "But this time, Grumbleshade didn't float away. He heard the happy news: Jesus is alive, and God loves everyone.",
    whisper: '"Even… me?" he whispered.',
    smile: 'Yes! Even you! Grumbleshade smiled, for the very first time…',
    glad: "He's not Grumbleshade anymore. He's Gladshade, and he wants to join your Ark!",
  },
}

/** Said on the map once every island is done (components/VoyageComplete.tsx), in order. */
export const VOYAGE_DONE = [
  'You did it! You sailed all seven seas, from Creation all the way to Pentecost!',
  "God's love is for everyone: for you, for every Pal on your Ark, and even for Gladshade.",
  'You can sail back to any island, any time.',
]
