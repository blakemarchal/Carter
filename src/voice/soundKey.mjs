// Spellings of a first name that sound alike get the same key, so the name is recorded once:
// "Aiden", "Aidan" and "Ayden"; "Sara" and "Sarah"; "Caden" and "Kaden"; "Riley" and "Rylee".
// It errs on the side of keeping names apart: two names left apart are just recorded twice, while two
// merged that sound different would have a child hear someone else's name.

/** Spellings that the rules below would merge, but that are said differently (Maria and Mariah). */
const OWN_SOUND = new Set(['mariah', 'anya', 'jayleen', 'aden', 'johan', 'haley', 'allie', 'ellie', 'eli', 'noa', 'ronin'])

/** The sound key of a first name (any case). */
export function soundKey(name) {
  const plain = String(name).toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')
  if (OWN_SOUND.has(plain)) return `=${plain}`
  return plain
    .replace(/ph/g, 'f')
    .replace(/^chr/, 'kr')
    .replace(/c(?=[aoulr])/g, 'k')
    .replace(/ck/g, 'k')
    .replace(/(?:eigh|ee|ie|ey|y)$/, 'Y') // (the "ee" sound at the end: Riley, Rylee, Ryleigh, Rylie)
    .replace(/(?<=[aeiou])h$/, '')
    .replace(/ks/g, 'x')
    .replace(/(.)\1+/g, '$1')
    .replace(/(?<=[^aeiouyh])[aeio]n$/, 'n') // (an unstressed last vowel: Aiden, Aidan; Jordan, Jorden)
    .replace(/(?<=[^aeiouyh])yn$/, 'n') // (Jordyn, Landyn)
    .replace(/ayd/g, 'aid') // (Ayden, Aiden; Jayden, Jaiden)
}
