// Sets up Grok's "Ara" narration voice. Run on the server:
//   cd /opt/Carter && npm run set-voice-key            paste a new xAI API key (tested before saving)
//   cd /opt/Carter && npm run set-voice-key -- --check  test the saved key, without showing it
//   cd /opt/Carter && npm run set-voice-key -- --remove go back to the device voice
// Get a key at https://console.x.ai (API Keys). The key is stored only in .env (root-only).
import { ask, readEnv, writeEnv } from './env.mjs'
import { synthesize } from './tts.mjs'

const env = readEnv()

async function test(key) {
  const mp3 = await synthesize('Hi! Welcome to the Ark!', 'ara', '1', key)
  console.log(`Voice works: Ara said hello (${mp3.length} bytes of audio).`)
}

try {
  if (process.argv.includes('--remove')) {
    delete env.XAI_API_KEY
    writeEnv(env)
    console.log('Removed. The game will use the device voice after:  systemctl restart carter-web')
  } else if (process.argv.includes('--check')) {
    if (!env.XAI_API_KEY) throw new Error('No XAI_API_KEY saved yet. Run: npm run set-voice-key')
    await test(env.XAI_API_KEY)
  } else {
    const key = (await ask('xAI API key: ')).trim()
    if (!key) throw new Error('No key entered. Nothing changed.')
    await test(key)
    env.XAI_API_KEY = key
    writeEnv(env)
    console.log('Saved. Restart the app to use it:  systemctl restart carter-web')
  }
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
