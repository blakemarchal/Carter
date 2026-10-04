// Makes a link that starts a new family (for the site owner: families join by invitation for now).
// Run on the server, as the user the game runs as, so the database stays its own:
//   runuser -u www-data -- env STATE_DIRECTORY=/var/lib/carter node server/new-family-link.mjs https://spiritflow.church
// The link works once, for 30 days. Whoever opens it names their family and becomes its first parent.
import { join } from 'node:path'
import { openFamilies } from './families.mjs'

const site = (process.argv[2] ?? 'https://spiritflow.church').replace(/\/$/, '')
const state = process.env.STATE_DIRECTORY
if (!state) throw new Error('Set STATE_DIRECTORY to the game\'s data folder (the server uses /var/lib/carter)')
const families = openFamilies(join(state, 'arkpals.db'))
const link = families.makeLink({ kind: 'family', madeBy: 'site owner' })
console.log(`${site}/start/${link.token}`)
console.log(`(works once, until ${new Date(link.expires).toDateString()})`)
families.close()
