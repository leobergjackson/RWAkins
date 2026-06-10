// Built by vsrupeshkumar
// Sun/Moon theme switch. Light mode shows the moon (tap → dark); dark mode shows
// the sun (tap → full-white/light). `.no-invert` keeps the button rendering its
// true colours even while the rest of the page is inverted in dark mode.
'use client'

import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ variant = 'inline' }: { variant?: 'inline' | 'floating' }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  const base: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '1px solid #E2E8F0',
    background: '#ffffff',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    fontSize: 17,
    lineHeight: 1,
    boxShadow: '0 2px 10px rgba(15,23,42,0.08)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    flexShrink: 0,
  }

  const floating: React.CSSProperties = variant === 'floating'
    ? { position: 'fixed', top: 16, right: 18, zIndex: 99999, width: 42, height: 42, fontSize: 19 }
    : {}

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="no-invert"
      style={{ ...base, ...floating }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
