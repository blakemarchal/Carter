// Science moments (docs/GAME-PLAN.md, the learning wave of Oct 2026): a "Did you know?" at the end of each island's
// story about something real in it (the rainbow, the whale, the dew, the waves…): one fact, picked by the child's
// reading level like the animal book's, a thing to try at home with a grown-up, and later a question in the
// "Remember?" round (learn/remember.ts), its three answers read out in order (the pictures are reminders), so the
// answers stay in the order written here and `answer` moves around. StoryBook shows the card after the last story
// part's "Think about it"; IslandScreen looks it up by island.
import { askWith } from './think'

export interface Science {
  title: string
  emoji: string
  /** One fact each for readers at levels 1 to 3, 4 to 6, and 7 to 10: a sentence or two, said aloud. */
  facts: [string, string, string]
  /** Something to try at home, with a grown-up. */
  tryIt: string
  ask: string
  choices: { emoji: string; say: string }[]
  answer: number
}

const s = (title: string, emoji: string, facts: [string, string, string], tryIt: string, ask: string, choices: [string, string][], answer: number): Science =>
  ({ title, emoji, facts, tryIt, ask, choices: choices.map(([emoji, say]) => ({ emoji, say })), answer })

export const SCIENCE: Record<string, Science> = {
  noah: s('Rainbows', '🌈', [
    'A rainbow comes out when the sun shines through raindrops.',
    'Sunlight looks white, but it is really made of many colors. Raindrops spread the colors out into a bow.',
    'A rainbow always has its colors in the same order: red, orange, yellow, green, blue, indigo and violet. You can only see one when the sun is behind you.',
  ], 'Stand with your back to the sun and spray water from a hose into the air. Look for a little rainbow!',
  'What makes a rainbow?', [['🎨', 'paint in the clouds'], ['🌈', 'sunlight shining through raindrops'], ['🐦', 'birds carrying colors']], 1),
  creation: s('Day and Night', '🌍', [
    'The sun lights up the day. At night, our side of the earth turns away from the sun.',
    'The earth is a giant ball that spins around once every day. When your side faces the sun, it is day. When it turns away, it is night.',
    'The moon does not make its own light. It shines because sunlight bounces off it, the way a mirror shines.',
  ], 'Shine a flashlight on a ball in a dark room and slowly turn the ball. Watch day and night move around it!',
  'Why does night come?', [['☀️', 'the sun goes to sleep'], ['☁️', 'the clouds cover the sun'], ['🌍', 'our side of the earth turns away from the sun']], 2),
  david: s('Falling Down', '🪨', [
    'When you let go of a stone, it falls down. That pull is called gravity.',
    "Gravity pulls everything toward the ground: stones, balls, raindrops, and you! That is why David's stone came back down.",
    'Gravity is what keeps us on the earth and keeps the moon going around us. The bigger something is, the stronger its pull.',
  ], 'Drop a small stone and a big stone at the same time. Which one lands first? They land together!',
  'What pulls a stone back down to the ground?', [['💨', 'the wind'], ['🧲', 'gravity'], ['🐦', 'a bird']], 1),
  jonah: s('Whales', '🐋', [
    'A whale is not a fish. It breathes air, like you do, through a hole on top of its head.',
    'A big fish breathes under water with gills. A whale has to come up for air, and it blows a spout of mist when it breathes out.',
    'The blue whale is the biggest animal that has ever lived, bigger than any dinosaur. Its heart is as big as a small car.',
  ], 'Take a big breath and hold it. Count how long you can hold it. A whale can hold its breath for more than an hour!',
  'How does a whale breathe?', [['🐋', 'it comes up and breathes air'], ['🫧', 'it breathes water with gills'], ['🌿', 'it eats seaweed']], 0),
  loaves: s('Bread', '🍞', [
    'Bread is made from wheat, a plant with tiny seeds called grain.',
    'To make bread, flour from the grain is mixed with water and yeast. The yeast makes tiny bubbles, and the dough puffs up.',
    'Yeast is alive! It is a tiny living thing that eats the sugar in the dough and breathes out gas. The gas makes the holes you see in a slice of bread.',
  ], 'Look at a slice of bread up close. Can you see the little holes the yeast bubbles made?',
  'What makes bread puff up?', [['🔥', 'the fire'], ['🫧', 'tiny bubbles from yeast'], ['🧂', 'salt']], 1),
  christmas: s('Snug and Warm', '🧣', [
    'A blanket keeps you warm by holding in the heat your own body makes.',
    'Your body makes heat all the time. A blanket or coat traps that heat close to you, like a cozy pocket of warm air.',
    "Animals do the same with fur, feathers and wool. A sheep's wool traps warm air, which is why wool blankets keep us so warm.",
  ], 'Put one hand under a blanket and keep the other out. After a minute, which hand feels warmer?',
  'How does a blanket keep you warm?', [['🔥', 'it makes its own heat'], ['🧣', 'it holds in the heat your body makes'], ['❄️', 'it melts the snow']], 1),
  abraham: s('Stars', '⭐', [
    'Stars are like our sun, but very, very far away.',
    "Stars shine all day long too, but the sun's light is so bright that we only see them at night.",
    'Light from a star takes so long to reach us that when you look at a star, you see light that left it years ago.',
  ], 'On a clear night, go outside and count the stars you can see. Look for the brightest one!',
  'What is a star?', [['💡', 'a lamp in the sky'], ['🪁', 'a kite on a string'], ['⭐', 'a sun that is very far away']], 2),
  joseph: s('Mixing Colors', '🎨', [
    'Red, yellow and blue are the three colors you can mix to make all the others.',
    'Mix yellow and blue and you get green. Mix red and yellow and you get orange. Mix red and blue and you get purple.',
    'Long ago, colors for cloth came from plants, berries, bugs and shells. A coat of many colors was very hard to make, which is why it was so special.',
  ], 'Mix two colors of paint and see what new color you make!',
  'What do you get when you mix yellow and blue?', [['🟢', 'green'], ['🟠', 'orange'], ['🟣', 'purple']], 0),
  'red-sea': s('Wind', '💨', [
    'Wind is air that is moving. You cannot see it, but you can feel it push.',
    'Wind can push sailboats, spin windmills and pile up waves. A very strong wind can even push water out of the way, like at the Red Sea.',
    'Wind happens because the sun warms some air more than other air. Warm air rises, and cooler air rushes in to take its place. That rush is the wind.',
  ], 'Blow on a little paper boat in a bowl of water. Can your wind make it sail?',
  'What is wind?', [['🌊', 'water that is moving'], ['💨', 'air that is moving'], ['☁️', 'a cloud falling down']], 1),
  daniel: s('Sleep', '😴', [
    'Everybody needs sleep. While you sleep, your body grows and your brain tidies up what you learned.',
    'Children need about ten to twelve hours of sleep a night. Lions sleep even more: up to twenty hours a day!',
    "When you sleep, your body makes the things it needs to grow and fixes little hurts, and your brain sorts the day's memories, so you remember better tomorrow.",
  ], 'Tonight, notice how your body feels when it is sleepy: heavy eyes, big yawns. That is your body asking for rest!',
  'Why do we need sleep?', [['🍕', 'so we can eat more pizza'], ['😴', 'so our bodies can grow and our brains can rest'], ['🏃', 'so we can run faster right now']], 1),
  'baby-moses': s('Floating', '🧺', [
    'Some things float and some things sink. A basket full of air floats on top of the water.',
    'Water pushes up on everything in it. If a thing is light for its size, like a basket of reeds, the push is strong enough to hold it up.',
    'A heavy ship floats because it is shaped like a big hollow bowl, full of air. The water pushes up on the whole bottom, and that holds the ship up.',
  ], 'Put a spoon, a cork, a coin and a leaf in a bowl of water. Guess first: which ones will float?',
  'Why did the basket float?', [['🪨', 'it was heavy like a rock'], ['🐟', 'the fish held it up'], ['🧺', 'it was light and full of air']], 2),
  'burning-bush': s('Fire', '🔥', [
    'Fire needs three things: something to burn, air, and heat.',
    "When wood burns, it turns into ash and smoke. Moses' bush was on fire but did not burn up, which is how he knew God was there.",
    'A flame is hot gas that glows. Blue flames are the hottest. Fire needs the oxygen in the air, which is why a candle goes out under a jar.',
  ], 'With a grown-up, put a jar over a lit candle. Watch the flame go out when the air inside is used up!',
  'What does a fire need to keep burning?', [['🔥', 'something to burn, air and heat'], ['🧊', 'ice and snow'], ['🌊', 'lots of water']], 0),
  manna: s('Dew', '💧', [
    'In the morning, tiny drops of water sit on the grass. That is dew.',
    'Air has water in it that you cannot see. At night the ground gets cold, and the water in the air turns into drops on the grass, like the manna in the story.',
    'Warm air can hold more water than cold air. When the air cools at night, it cannot hold all its water, so the extra turns into dew. The same thing makes drops on a cold glass.',
  ], 'Early in the morning, touch the grass. Is it wet with dew, even if it did not rain?',
  'Where does morning dew come from?', [['🌧️', 'a tiny rain cloud'], ['💧', 'water in the air turning into drops when it gets cold'], ['🚿', 'a sprinkler']], 1),
  jericho: s('Sound', '🎺', [
    'Sound is made when something shakes very fast. A trumpet makes the air inside it shake.',
    "When you shout, the air in your throat shakes, and the shaking travels through the air to someone's ears. Loud sounds shake the air harder.",
    'Sound travels in waves through the air, about a mile every five seconds. Very loud sounds can shake walls and windows, though it took God to knock a city wall down!',
  ], 'Put your hand on your throat and hum. Can you feel the buzz? That is sound!',
  'What makes a sound?', [['💡', 'something shining bright'], ['❄️', 'something very cold'], ['🎺', 'something shaking very fast']], 2),
  ruth: s('Seeds', '🌾', [
    'Barley grows from a seed. Each seed grows into a plant with many new seeds.',
    'A plant needs sunshine, water and soil to grow. Farmers plant the seeds, wait for the rain and sun, and then harvest the grain.',
    'One barley seed can grow into a plant with dozens of seeds. That is how a field planted from a basket of seeds can fill a barn at harvest.',
  ], 'Put a dry bean on a wet paper towel in a jar by the window. Check it every day. Does a root come out?',
  'What does a seed need to grow?', [['🌱', 'sunshine, water and soil'], ['🍬', 'candy'], ['📺', 'a television']], 0),
  samuel: s('Ears', '👂', [
    'Your ears catch sounds from the air, even when you are asleep.',
    'Inside your ear is a tiny skin called the eardrum. Sounds make it shake, and your brain turns the shaking into words and music.',
    'You have two ears so you can tell where a sound comes from: it reaches one ear a tiny bit before the other. That is how Samuel knew the voice was near.',
  ], 'Close your eyes and have someone clap somewhere in the room. Point to where the clap came from!',
  'What do your ears catch?', [['🌈', 'colors'], ['👂', 'sounds from the air'], ['🍎', 'smells']], 1),
  elijah: s('Rain', '☁️', [
    'Rain comes from clouds. Clouds are made of tiny drops of water.',
    'The sun warms the sea, and water rises into the air as a mist you cannot see. Up high it cools into clouds. When the drops get heavy, they fall as rain.',
    "Water goes round and round: sea to cloud to rain to river to sea again. That is the water cycle. Elijah's little cloud over the sea was the first sign of the rain.",
  ], 'Breathe on a cold window. See the little drops? That is water from your breath turning back into drops, just like a cloud.',
  'What are clouds made of?', [['🧁', 'cotton candy'], ['🐑', 'wool'], ['☁️', 'tiny drops of water']], 2),
  esther: s('Shiny Things', '👑', [
    'Shiny things, like a gold crown, bounce light back to your eyes.',
    'Smooth, shiny things bounce light the way a ball bounces off a wall. A mirror is so smooth that the light bounces straight back, and you see yourself.',
    'Gold is a metal that never rusts or goes dull, so it stays shiny for thousands of years. That is one reason kings and queens wore it.',
  ], 'Shine a flashlight at a mirror in a dark room. Where does the light go?',
  'Why does a gold crown shine?', [['👑', 'it bounces light back to your eyes'], ['🔥', 'it is on fire'], ['💡', 'it has a light bulb inside']], 0),
  'boy-jesus': s('Growing', '🌱', [
    'You grow when you sleep, eat good food and play.',
    'Your bones get longer a tiny bit at a time. That is why your shoes get too small! Milk, vegetables and running around help your bones grow strong.',
    'You will keep growing until you are about eighteen. Your brain grows too: every time you learn something new, it builds new paths inside.',
  ], 'Have a grown-up mark your height on a door frame. Check it again in a few months!',
  'What helps you grow?', [['📺', 'watching television all day'], ['🥦', 'good food, sleep and play'], ['🍭', 'only candy']], 1),
  fishers: s('Fish', '🐟', [
    'A fish breathes under water with gills, the little slits on the sides of its head.',
    'Water has air mixed in it. The gills take the air out of the water as it flows through, so a fish never has to come up to breathe.',
    "Fish swim in big groups called schools to stay safe. A net catches a whole school at once, which is why Peter's nets were so full.",
  ], 'Watch a fish in a tank or a pond. Can you see its gills opening and closing as it breathes?',
  'How does a fish breathe?', [['👃', 'with a nose, above the water'], ['🐟', 'with gills, under the water'], ['🌬️', 'it holds its breath all day']], 1),
  storm: s('Waves', '🌊', [
    'Waves are made by the wind blowing across the water.',
    'The harder and longer the wind blows, the bigger the waves get. A storm has strong wind, so it makes big waves that can splash into a boat.',
    'A wave carries energy from the wind across the water, but the water itself mostly goes up and down. When the wind stops, the waves settle, though never as fast as when Jesus said, be still!',
  ], 'Blow across a bowl of water. Blow softly, then hard. Watch the waves get bigger!',
  'What makes waves on a lake?', [['🌬️', 'the wind blowing across the water'], ['🐟', 'the fish swimming'], ['🌙', 'the moon singing']], 0),
  'lost-sheep': s('A Sheep’s Ears', '🐑', [
    "Sheep know their shepherd's voice and come when he calls.",
    "A sheep's ears can turn to catch sounds from all around. A lamb's bleat is how it calls its mother, and the mother knows her own lamb's voice.",
    'Sheep have eyes on the sides of their heads, so they can see almost all the way around without turning. That helps them spot danger, but they still get lost!',
  ], 'Close your eyes and listen. Can you tell who is talking just by their voice?',
  'How does a sheep know its shepherd?', [['👃', 'it smells his shoes'], ['📖', 'it reads his name'], ['👂', 'it knows his voice']], 2),
  samaritan: s('Getting Better', '🩹', [
    'A bandage keeps a hurt clean so it can heal.',
    'Your body fixes itself! New skin grows under a scab, and the scab falls off when the new skin is ready.',
    'Blood has tiny helpers in it. When you get a cut, some of them make a plug to stop the bleeding, and others fight germs. Washing a cut and covering it helps them work.',
  ], 'Next time you get a little scrape, watch it over a few days. Can you see the new skin growing?',
  'Why do we cover a cut?', [['🎨', 'to make it pretty'], ['🩹', 'to keep it clean so it can heal'], ['😴', 'to put it to sleep']], 1),
  zacchaeus: s('Trees', '🌳', [
    'A tree grows up tall toward the sun, with roots going down into the ground.',
    "A tree drinks water through its roots, and its leaves use sunlight to make food. A sycamore's branches grow wide and low, which made it easy to climb.",
    'Trees give us the air we breathe. Leaves take in the air we breathe out and give back fresh oxygen. One big tree can make enough oxygen for four people.',
  ], 'Hug a tree and look up. Can you see how its branches reach for the sun?',
  'What does a tree drink water with?', [['🍃', 'its leaves'], ['🐿️', 'its squirrels'], ['🌱', 'its roots']], 2),
  'palm-sunday': s('Palm Trees', '🌴', [
    'A palm tree has big leaves called fronds that grow at the very top.',
    'Palm trees grow in warm places. Their leaves can be as long as a car! People waved them like flags for Jesus.',
    'A palm tree does not have branches like other trees. Its trunk grows straight up, and dates, a sweet fruit, grow in bunches under the leaves.',
  ], 'Find the biggest leaf you can outside. Wave it like a flag!',
  "Where do a palm tree's leaves grow?", [['🌴', 'at the very top'], ['🌱', 'at the bottom'], ['🪨', 'under the ground']], 0),
  easter: s('Sunrise', '🌅', [
    'The sun comes up in the morning in the east, and goes down at night in the west.',
    'The sun is not really moving up. The earth is turning, and our side slowly turns to face the sun. The sky turns pink and orange before the sun appears.',
    'Sunrise is pink and orange because the sunlight travels through a lot of air when the sun is low, and the air scatters away the blue light, leaving the warm colors.',
  ], 'Wake up early one morning and watch the sunrise. What colors do you see?',
  'Why does the sun seem to come up in the morning?', [['🚀', 'the sun flies up'], ['🌍', 'the earth turns to face the sun'], ['🎈', 'a balloon lifts it']], 1),
  pentecost: s('Your Voice', '🗣️', [
    'Your voice is made by air from your lungs shaking two little strings in your throat.',
    'When you talk, air from your lungs passes over your vocal cords and makes them shake. Your tongue and lips shape the shaking air into words.',
    "People around the world speak about seven thousand different languages, but every baby is born able to learn any of them. Peter's friends spoke languages they had never learned, which was a miracle.",
  ], "Put your fingers on your throat and say ahhh. Feel the buzz of your voice!",
  'Where does your voice come from?', [['👂', 'your ears'], ['🦶', 'your feet'], ['🗣️', 'air from your lungs shaking strings in your throat']], 2),
}

/** The fact a reader at this level hears (as the animal book picks facts). */
export const factFor = (sc: Science, readingLevel: number) => sc.facts[readingLevel >= 7 ? 2 : readingLevel >= 4 ? 1 : 0]

export const DID_YOU_KNOW = 'Did you know?'
export const TRY_IT = 'Try it at home:'
/** What the card says: the fact, then the thing to try. */
export const scienceSay = (sc: Science, readingLevel: number) => `${DID_YOU_KNOW} ${factFor(sc, readingLevel)} ${TRY_IT} ${sc.tryIt}`
/** The round's question: the question, then the three answers in order. */
export const scienceAsk = (sc: Science) => askWith(sc.ask, sc.choices.map((c) => c.say))

/** Every line the science moments say, for the voice script: each card at each level, and the round's questions and answers. */
export function scienceLines(): string[] {
  const out = new Set<string>()
  for (const sc of Object.values(SCIENCE)) {
    for (const level of [1, 4, 7]) out.add(scienceSay(sc, level))
    out.add(scienceAsk(sc))
    for (const c of sc.choices) out.add(`${c.say}!`)
  }
  return [...out]
}
