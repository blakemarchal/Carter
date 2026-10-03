import { createRoot } from 'react-dom/client'
import App from './App'
import '@fontsource/baloo-2/latin-500.css'
import '@fontsource/baloo-2/latin-700.css'
import '@fontsource/baloo-2/latin-800.css'
import './styles.css'
import { watchForUpdates } from './lib/update'

// No StrictMode: its double-run effects would make narration start twice.
const root = createRoot(document.getElementById('root')!)
if (import.meta.env.DEV && location.hash.startsWith('#gallery')) {
  // Development only: every picture and Pal on one page (src/dev/Gallery.tsx).
  import('./dev/Gallery').then(({ default: Gallery }) => root.render(<Gallery route={location.hash.slice(1)} />))
} else if (location.hash.startsWith('#review')) {
  // For grown-ups proofreading: every page beside its narration (src/screens/Review.tsx).
  import('./screens/Review').then(({ default: Review }) => root.render(<Review route={location.hash.slice(1)} />))
} else {
  root.render(<App />)
  watchForUpdates()
}
