// "Think about it" (docs/GAME-PLAN.md, the learning wave of Oct 2026): one question at the end of each story part
// that asks for a reason, a feeling or what the story shows, not something a page said outright ("Why did Jonah
// get on the boat?"). The narrator asks it and reads the three answers in order (so the pictures are only
// reminders), and after the right one says why (`why`): the story's point in a sentence or two. THINK[island][k]
// goes with the island's k-th story step (StoryBook plays it; IslandScreen looks it up). The answers stay in the
// order written here, so the line the narrator says is fixed and can be recorded; `answer` moves around instead.
// Nothing here changes a reading level.
import type { Thing } from './islands'

export interface ThinkQ { ask: string; choices: Thing[]; answer: number; why: string }

export const INTRO = 'Think about it!'

const t = (ask: string, choices: [string, string][], answer: number, why: string): ThinkQ =>
  ({ ask, choices: choices.map(([emoji, say]) => ({ emoji, say })), answer, why })

export const THINK: Record<string, ThinkQ[]> = {
  noah: [
    t('Why did Noah build the big boat?', [['🙏', 'Because God told him to'], ['🎣', 'To go fishing'], ['🏁', 'To win a race']], 0,
      'Noah trusted God, so he obeyed, even before the rain came. Trusting God means doing what He says.'),
    t('Why did God put a rainbow in the sky?', [['🎨', 'To paint the clouds'], ['🌈', 'To show His promise'], ['🐦', 'For the birds to sit on']], 1,
      "The rainbow is God's promise that He would never flood the whole earth again. God always keeps His promises."),
  ],
  creation: [
    t('How do you think God felt when He looked at what He made?', [['😨', 'Scared'], ['😡', 'Cross'], ['😊', 'Happy']], 2,
      'God saw that everything He made was good. He was glad, and He still loves the world He made.'),
    t('Why did God make you?', [['❤️', 'To be His friend'], ['🤖', 'To be a robot'], ['🪨', 'To sit still like a rock']], 0,
      'God made Adam and Eve to be His friends, and He made you to be His friend, too. You are wonderfully made!'),
  ],
  david: [
    t('Why did God pick David to be king one day?', [['🦒', 'He was the tallest'], ['❤️', 'God looks at the heart'], ['👑', 'He had a crown']], 1,
      "David's brothers were tall and strong, but God looks at the heart. David loved God, and that is what God saw."),
    t('Why was David not afraid of the giant?', [['🗡️', 'He had a big sword'], ['🏃', 'He could run fast'], ['🙏', 'He trusted God']], 2,
      'David knew God had helped him before, so God would help him again. God is bigger than any giant.'),
  ],
  jonah: [
    t('Why did Jonah get on the boat?', [['🏃', 'To run away from God'], ['🎣', 'To catch fish'], ['🏖️', 'To go to the beach']], 0,
      'Jonah did not want to do what God said, so he ran the other way. But no one can hide from God, and God still loved Jonah.'),
    t('Why did God give Jonah a second chance?', [['🐟', 'Because the fish asked'], ['❤️', 'Because God loves us'], ['🎂', 'Because it was his birthday']], 1,
      'Jonah said sorry, and God forgave him and sent him again. When we say sorry, God forgives us, too.'),
  ],
  loaves: [
    t('Why did the boy give Jesus his lunch?', [['🤢', "He didn't like it"], ['😴', 'He was too sleepy to eat'], ['❤️', 'To share and help']], 2,
      'The boy only had a little, but he shared it with Jesus. When we share, Jesus can do big things with it.'),
    t('What does the story show us about Jesus?', [['🍞', 'He gives us what we need'], ['🏃', 'He runs very fast'], ['🎨', 'He likes to paint']], 0,
      'One little lunch fed thousands, with baskets left over. Jesus cares for us and gives us what we need.'),
  ],
  christmas: [
    t('Why did Mary and Joseph sleep where the animals sleep?', [['🐑', 'They loved sheep best'], ['🏠', 'There was no room anywhere else'], ['⛺', 'It was a fun camp-out']], 1,
      "The town was full, so there was no room. God's Son was born in a humble place, for everyone, not just for kings."),
    t("Why is Jesus God's best gift?", [['🎁', 'He came in a shiny box'], ['🍬', 'He is sweet like candy'], ['💝', 'He came to rescue us']], 2,
      'Jesus is our Savior. God sent Him to rescue us, because God loves us so much.'),
  ],
  abraham: [
    t('Why did Abraham leave his home?', [['🙏', 'Because he trusted God'], ['🏠', 'His house was too small'], ['🐪', 'The camels wanted a walk']], 0,
      'Abraham did not know where he was going, but he trusted God and went. Trusting God means going where He leads.'),
    t('Why did Sarah laugh when she heard about the baby?', [['🐒', 'A monkey was there'], ['😮', 'She thought she was too old'], ['🎉', 'It was a party']], 1,
      'Sarah thought it was impossible. But nothing is too hard for God, and He kept His promise. Then she laughed for joy!'),
  ],
  joseph: [
    t("Why were Joseph's brothers unkind to him?", [['😴', 'They were sleepy'], ['🎁', 'They wanted to give him a gift'], ['😠', 'They were jealous']], 2,
      'Jealousy made the brothers do a very wrong thing. Being jealous can make us unkind, so we can ask God for a kind heart.'),
    t('How did Joseph treat his brothers when they came to Egypt?', [['🤗', 'He forgave them'], ['😡', 'He sent them away'], ['😂', 'He laughed at them']], 0,
      'Joseph forgave his brothers, even after they hurt him. God turned something bad into something good.'),
  ],
  'red-sea': [
    t('How did the people feel when the chariots came?', [['😄', 'Silly'], ['😨', 'Scared'], ['😴', 'Sleepy']], 1,
      'They were scared, but Moses said, do not be afraid, God will help us. When we are scared, we can trust God, too.'),
    t('Why did everyone sing and dance after they crossed the sea?', [['🎂', 'There was cake'], ['🎵', 'They heard a band'], ['🎉', 'God had saved them']], 2,
      'God made a way through the sea and kept His people safe. When God helps us, we can thank Him with songs.'),
  ],
  daniel: [
    t('Why did Daniel keep praying when it was against the rule?', [['❤️', 'He loved God most of all'], ['😴', 'He forgot the rule'], ['🤪', 'He liked to be silly']], 0,
      'Daniel loved God more than anything, even more than being safe. Praying to God was the most important thing to him.'),
    t('Why did the king not sleep that night?', [['⚽', 'He was playing ball'], ['😟', 'He was worried about Daniel'], ['🍕', 'He ate too much pizza']], 1,
      'The king loved Daniel and was worried for him. But God kept Daniel safe all night long. God is always with us.'),
  ],
  'baby-moses': [
    t("Why did Moses' mom put him in a basket?", [['🫧', 'To give him a bubble bath'], ['⛵', 'To play boats'], ['🛡️', 'To keep him safe']], 2,
      "Pharaoh's rule was unkind, so she hid her baby to keep him safe. And God was watching over him the whole time."),
    t('How did the princess feel when she saw the baby?', [['🥰', 'Kind and loving'], ['😡', 'Cross'], ['😂', 'Silly']], 0,
      'The princess felt kind and loving, and she took care of him. God used the princess to keep baby Moses safe. God had a plan!'),
  ],
  'burning-bush': [
    t('Why did Moses help the sisters at the well?', [['💰', 'They paid him'], ['💧', 'He was kind'], ['🏆', 'To win a prize']], 1,
      'Moses saw that it was not kind to push them away, so he helped. God wants us to be kind, like Moses was.'),
    t('Why did God tell Moses to take off his sandals?', [['💦', 'His feet were wet'], ['🩴', 'His sandals were dirty'], ['✨', 'Because God was there']], 2,
      'The ground was holy because God was there. When we talk to God, we remember He is great, and He is with us.'),
  ],
  manna: [
    t('Why did God send bread even after the people grumbled?', [['❤️', 'Because He still loved them'], ['💥', 'Because they made the loudest noise'], ['🍞', 'Because He had too much bread']], 0,
      'God heard the grumbling, but He still loved His people and fed them. God is kind to us even when we grumble.'),
    t('Why did God say to gather just enough for today?', [['🐜', 'So the ants could eat'], ['🙏', 'So they would trust Him every day'], ['🧺', 'So their baskets would stay light']], 1,
      'God wanted His people to trust Him for each new day. God gives us what we need, every single day.'),
  ],
  jericho: [
    t('Why did Rahab hide the two men?', [['🙈', 'She liked hide and seek'], ['🍪', 'They brought cookies'], ['🙏', 'She believed in God']], 2,
      'Rahab said, I know your God is the real God. She trusted God, and God kept her family safe.'),
    t('Why did the walls fall down?', [['🙏', 'God made them fall'], ['💪', 'The people pushed them'], ['🐘', 'An elephant bumped them']], 0,
      'The people did just what God said, and God made the walls fall. God keeps His promises, and He gives the victory.'),
  ],
  ruth: [
    t('Why did Ruth stay with Naomi?', [['🎂', 'Naomi had cake'], ['❤️', 'She loved her'], ['🗺️', 'She lost her way']], 1,
      "Ruth loved Naomi, and she chose Naomi's God, too. Real love stays close, no matter what."),
    t('Why did Boaz tell his workers to drop extra barley?', [['😴', 'He was sleepy'], ['⚽', 'It was a game'], ['🤗', 'To be kind to Ruth']], 2,
      'Boaz was kind, and he helped Ruth without being asked. God takes care of us through kind people.'),
  ],
  samuel: [
    t('How did Hannah feel after she prayed?', [['😌', 'Not sad anymore'], ['😡', 'Cross'], ['😨', 'Scared']], 0,
      'Hannah told God what she wanted, and she felt peace. God hears us when we pray.'),
    t('Why did Samuel run to Eli?', [['🍪', 'He wanted a snack'], ['👂', 'He thought Eli called him'], ['🏃', 'He loved running']], 1,
      "Samuel did not know God's voice yet. Eli taught him to say, Speak, Lord, I am listening. We can listen to God in the Bible."),
  ],
  elijah: [
    t('Why did the widow share her last bread with Elijah?', [['🤢', "She didn't like bread"], ['🐦', 'The ravens told her to'], ['🙏', "She trusted God's promise"]], 2,
      'Elijah said God would make her flour and oil last, and she trusted God. God took care of her family every day.'),
    t('Why did Elijah pour water all over the altar?', [['✨', 'So everyone would know God did it'], ['🔥', 'To put out the fire'], ['🫧', 'To wash the stones']], 0,
      'Wet wood cannot burn, so when fire came, everyone knew it was God. The Lord is God, and He answers prayer.'),
  ],
  esther: [
    t('Why would Mordecai not bow down to Haman?', [['🩹', 'His knees hurt'], ['🙏', 'He bowed only to God'], ['😴', 'He was asleep']], 1,
      'Mordecai bowed only to God. And God made Esther queen for a time just like this.'),
    t('Why did Esther pray for three days before seeing the king?', [['🎂', 'It was her birthday'], ['🛏️', 'She was sleepy'], ['😨', "She was afraid and needed God's help"]], 2,
      'Esther was afraid, so she asked God and her friends to pray. Then she was brave. God takes care of His people.'),
  ],
  'boy-jesus': [
    t("Why did Jesus' family go to Jerusalem?", [['🙏', 'To praise God at the feast'], ['🚲', 'To ride a bike'], ['🩴', 'To buy new sandals']], 0,
      "The Passover feast was a time to remember how God set His people free. Jesus loved to go to God's house."),
    t("Why was Jesus in God's house?", [['🙈', 'He was hiding'], ['📜', 'He loved to learn about God'], ['🍦', 'He wanted ice cream']], 1,
      "Jesus wanted to be in His Father's house, listening and asking questions. Then He went home and obeyed Mary and Joseph."),
  ],
  fishers: [
    t('Why did Peter let down the nets again?', [['🐟', 'He saw a fish jump'], ['😴', 'He was bored'], ['🙏', 'Because Jesus said so']], 2,
      'Peter had worked all night and caught nothing. But he did what Jesus said. Obeying Jesus brings good things.'),
    t('Why did Peter and his friends leave their boats?', [['❤️', 'To follow Jesus'], ['🌊', 'To go swimming'], ['🛏️', 'To go to bed']], 0,
      'Jesus said, come, follow Me. They left everything to go with Him. Jesus wants you to follow Him, too.'),
  ],
  storm: [
    t('Why was Jesus asleep in the boat?', [['🙈', 'He was hiding'], ['😴', 'He was tired after a long day'], ['🥱', 'He was bored']], 1,
      "Jesus was tired after teaching all day. Jesus is God's Son, and He was a real person, too, who got tired like us."),
    t('Why did the friends wake Jesus up?', [['🍽️', 'It was dinner time'], ['🎉', 'They wanted a party'], ['😨', 'They were scared']], 2,
      'They were scared, but Jesus was with them the whole time. When we are scared, Jesus is with us, and He takes care of us.'),
  ],
  'lost-sheep': [
    t('Why did the shepherd go looking for just one lamb?', [['❤️', 'He loved every one of them'], ['😡', 'He was cross with it'], ['🍕', 'He wanted pizza']], 0,
      'The shepherd loved every sheep, even the littlest lamb. God loves every one of us like that.'),
    t('Why did the shepherd have a party?', [['🎂', 'It was his birthday'], ['🎉', 'He found his lost lamb'], ['🌧️', 'It was raining']], 1,
      'The shepherd was so happy to find his lamb. When one of us comes home to God, heaven is full of joy!'),
  ],
  samaritan: [
    t('Why did the Samaritan stop?', [['🐴', 'His donkey was tired'], ['💰', 'He wanted to buy something'], ['❤️', 'He felt sorry for the hurt man']], 2,
      'The priest and the helper walked by, but the Samaritan stopped because he cared. A neighbor is anyone who needs our help.'),
    t('What did Jesus want the man to learn?', [['🤗', 'To be kind to everyone'], ['🏃', 'To hurry past'], ['🐴', 'To buy a donkey']], 0,
      'Jesus said, go and do the same. God wants us to be kind to everyone, even people who are different from us.'),
  ],
  zacchaeus: [
    t('Why did Zacchaeus climb the tree?', [['🍎', 'To pick apples'], ['👀', 'He wanted to see Jesus'], ['🐒', 'He was playing monkey']], 1,
      'Zacchaeus was short, but he wanted to see Jesus so much. Jesus saw him, too, and He knew his name.'),
    t('Why did Zacchaeus give the money back?', [['👑', 'The king made him'], ['💰', 'He had too much'], ['❤️', "Jesus' love changed his heart"]], 2,
      'Jesus loved Zacchaeus, and that love changed his heart. Jesus loves everyone, and His love changes hearts.'),
  ],
  'palm-sunday': [
    t('Why did the owners let the friends take the donkey?', [['🙏', 'The Lord needed it'], ['💰', 'They were paid'], ['😴', 'They were asleep']], 0,
      'The friends said, the Lord needs it, and the owners let it go. Jesus knew just what would happen. He is the King.'),
    t('Why did the people shout Hosanna?', [['😠', 'They were cross'], ['🎉', 'To praise Jesus the King'], ['🐴', 'To call the donkey']], 1,
      'Hosanna is a happy shout that praises God. The people welcomed Jesus as their King, and He is our King, too.'),
  ],
  easter: [
    t("How did Jesus' friends feel after He died?", [['😄', 'Happy'], ['😴', 'Sleepy'], ['😢', 'Very sad']], 2,
      'They were very sad, and they missed Him. But that was not the end of the story!'),
    t('Why were the women so happy at the garden?', [['🎉', 'Jesus was alive'], ['🌸', 'The flowers were pretty'], ['🥞', 'They found pancakes']], 0,
      'Jesus was alive! He is alive forever, and He loves you, too.'),
  ],
  pentecost: [
    t('Why did the friends wait and pray in Jerusalem?', [['🌧️', 'It was raining'], ['🙏', 'Jesus told them to wait for the Helper'], ['🚌', 'They missed the bus']], 1,
      'Jesus promised to send the Holy Spirit, the Helper. They trusted Jesus and waited, just like He said.'),
    t('How did Peter become so brave?', [['🥕', 'He ate his carrots'], ['🏆', 'He won a race'], ['✨', 'The Holy Spirit filled him']], 2,
      "The Holy Spirit made Peter brave to tell everyone about Jesus. God's Helper is with God's family today, too."),
  ],
}

/** A name that keeps its capital in the middle of a sentence. */
const KEEP = /^(God|Jesus|Lord)\b/
const lower = (s: string) => (KEEP.test(s) ? s : s[0].toLowerCase() + s.slice(1))

/** A question with its three answers read out in order: "Why…? This, that, or the other?" */
export function askWith(ask: string, says: string[]): string {
  const [a, b, c] = says
  return `${ask} ${a[0].toUpperCase()}${a.slice(1)}, ${lower(b)}, or ${lower(c)}?`
}

/** What the narrator asks: the question, then the three answers in order (the pictures are only reminders). */
export const thinkSay = (q: ThinkQ) => `${INTRO} ${askWith(q.ask, q.choices.map((x) => x.say))}`

/** Every line "Think about it" says, for the voice script: each question as asked, each answer, and each why. */
export function thinkLines(): string[] {
  const out = new Set<string>()
  for (const qs of Object.values(THINK)) {
    for (const q of qs) {
      out.add(thinkSay(q))
      for (const c of q.choices) out.add(`${c.say}!`)
      out.add(q.why)
    }
  }
  return [...out]
}
