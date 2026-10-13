// A song sung along with the "I sing!" flute version (the studio's song mode; docs/CLOUD-BRIEF.md, wave 10).
// The singer hears the flute through headphones while the microphone records. The song's start is then found
// in the recording, so the voice can be laid onto the flute track exactly where it was sung, and the song's
// existing word timings light the words up in time: nothing has to be tapped along.

/**
 * Where the song starts in the recording (ms). `recordingStarted` and `songStarted` are on the same clock
 * (performance.now()); the singer hears the song `outputLatency` later than it starts, and their voice reaches the
 * recording `inputLatency` after the player sings.
 */
export function songStartInRecording({ recordingStarted, songStarted, outputLatency = 0, inputLatency = 0.02 }: {
  recordingStarted: number; songStarted: number; outputLatency?: number; inputLatency?: number
}): number {
  return Math.max(0, Math.round(songStarted - recordingStarted + (outputLatency + inputLatency) * 1000))
}

/**
 * The song with the voice laid on: each channel of the backing, plus the voice from `startMs` into the recording
 * at song time 0 (and onwards), at `gain`. Both at the same sample rate.
 */
export function mixVocal(backing: Float32Array[], vocal: Float32Array, rate: number, startMs: number, gain = 1): Float32Array<ArrayBuffer>[] {
  const skip = Math.round((startMs / 1000) * rate)
  return backing.map((ch) => {
    const out = new Float32Array(ch.length)
    out.set(ch)
    for (let i = 0; i < out.length; i++) {
      const j = i + skip
      if (j >= vocal.length) break
      out[i] = Math.max(-1, Math.min(1, out[i] + vocal[j] * gain))
    }
    return out
  })
}

/** The song as a mixed AudioBuffer (for the sing-along's Playback). */
export function mixedBuffer(c: BaseAudioContext, backing: AudioBuffer, vocal: AudioBuffer, startMs: number, gain = 1): AudioBuffer {
  const chans = Array.from({ length: backing.numberOfChannels }, (_, i) => backing.getChannelData(i))
  const mixed = mixVocal(chans, vocal.getChannelData(0), backing.sampleRate, startMs, gain)
  const out = c.createBuffer(backing.numberOfChannels, backing.length, backing.sampleRate)
  mixed.forEach((ch, i) => out.copyToChannel(ch, i))
  return out
}
