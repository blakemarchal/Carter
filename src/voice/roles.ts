// Who speaks which lines (docs/CLOUD-BRIEF.md, wave 10). A line has a role; the role says which house voice
// reads it, and which to try next when that voice hasn't recorded the line. Change the table to recast a part.
// The voices are the owner's own family, recorded once for every family (server/house.mjs); their names
// (labels) live on the server, never in the code. `grok` is Grok's "Ara" voice, made ahead of time on the server
// for every line and piece (scripts/warm-house-grok.mjs): last in every list, so our own recordings replace it
// line by line, and before the device's voice.

/** The house voices there are to begin with (the owner can add more on the server). */
export const VOICES = ['mom', 'dad', 'child', 'grok'] as const
export type Voice = (typeof VOICES)[number] | (string & {})

/** The parts lines are spoken in. */
export type Role = 'narrator' | 'shade' | 'pals'

/**
 * Each role's voices, first choice first (Grok last).
 * - narrator: story pages, prompts, praise and learning.
 * - shade: Grumbleshade's lines and the battle foe.
 * - pals: short Pal cheers and reactions.
 */
export const ROLE_VOICES: Record<Role, Voice[]> = {
  narrator: ['mom', 'grok'],
  shade: ['dad', 'mom', 'grok'],
  pals: ['child', 'mom', 'grok'],
}

export const voicesFor = (role: Role = 'narrator'): Voice[] => ROLE_VOICES[role] ?? ROLE_VOICES.narrator
