// Family voices: Mom or Dad can record story lines in the Parent Corner. When a line has a
// recording, the narrator plays it instead of the Grok voice. Stored on the family server.

let known: Set<string> | null = null
const listeners = new Set<() => void>()

/** A line's id: the first 16 hex characters of SHA-256 of its text. */
export async function lineId(text: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text.trim()))
  return [...new Uint8Array(bytes)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Fetches which lines have recordings (once; call again to refresh). */
export async function loadRecordings() {
  try {
    const r = await fetch('/recordings', { cache: 'no-store' })
    if (r.ok) known = new Set(await r.json())
  } catch {
    /* offline: no recordings this time */
  }
  listeners.forEach((l) => l())
}

export const hasRecording = (id: string) => !!known?.has(id)
export const onRecordingsChange = (l: () => void) => (listeners.add(l), () => { listeners.delete(l) })

const audio = new Map<string, Promise<ArrayBuffer | null>>()

/** The recording for this line, if there is one. */
export async function recordingFor(text: string): Promise<ArrayBuffer | null> {
  if (!known?.size) return null
  const id = await lineId(text)
  if (!known.has(id)) return null
  if (!audio.has(id)) {
    audio.set(id, fetch(`/recording/${id}`).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null))
  }
  return audio.get(id)!
}

// ---------- Recording (Parent Corner) ----------

let recorder: MediaRecorder | null = null
let chunks: Blob[] = []

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
  const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported(t))
  recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined)
  chunks = []
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
  recorder.start()
}

/** Stops recording and returns the audio. */
export function stopRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    const r = recorder
    if (!r) return resolve(null)
    r.onstop = () => {
      r.stream.getTracks().forEach((t) => t.stop())
      recorder = null
      resolve(chunks.length ? new Blob(chunks, { type: r.mimeType || 'audio/webm' }) : null)
    }
    r.stop()
  })
}

export async function saveRecording(text: string, blob: Blob) {
  const id = await lineId(text)
  const r = await fetch(`/recording/${id}`, { method: 'PUT', headers: { 'Content-Type': blob.type }, body: blob })
  if (r.status === 507) throw new Error("Your family's recordings are full. Delete some old ones to make room.")
  if (!r.ok) throw new Error(`save failed (${r.status})`)
  audio.delete(id)
  await loadRecordings()
}

export async function deleteRecording(text: string) {
  const id = await lineId(text)
  await fetch(`/recording/${id}`, { method: 'DELETE' })
  audio.delete(id)
  await loadRecordings()
}
