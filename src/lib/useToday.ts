// Today's date, kept current: it changes at midnight even if the app was left open, and is checked
// again whenever the app comes back on screen.
import { useEffect, useState } from 'react'
import { today } from './progress'

export function useToday() {
  const [day, setDay] = useState(today)
  useEffect(() => {
    const check = () => setDay(today())
    const t = setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', check) }
  }, [])
  return day
}
