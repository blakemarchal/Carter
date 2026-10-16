// Sets up the Python environment the music scripts use (outside the repo, in %LOCALAPPDATA%\ArkPals\musicenv):
// Demucs (takes the voice out of a song, for "I sing!"), librosa (the beat) and LAME (the mp3s). About 1 GB, once.
//   node scripts/music/setup.mjs
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { PY } from './lib.mjs'

try {
  const env = dirname(dirname(PY))
  if (!existsSync(PY)) {
    mkdirSync(dirname(env), { recursive: true })
    execFileSync('python', ['-m', 'venv', env], { stdio: 'inherit' })
  }
  const pip = (...a) => execFileSync(PY, ['-m', 'pip', 'install', '--quiet', ...a], { stdio: 'inherit' })
  pip('--upgrade', 'pip')
  pip('torch', 'torchaudio', '--index-url', 'https://download.pytorch.org/whl/cpu')
  pip('demucs', 'librosa', 'soundfile', 'lameenc', 'pyloudnorm')
  execFileSync(PY, ['-c', 'import demucs, librosa, torch, lameenc, pyloudnorm; print("Python: Demucs, librosa and LAME ready; torch", torch.__version__)'], { stdio: 'inherit' })
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
