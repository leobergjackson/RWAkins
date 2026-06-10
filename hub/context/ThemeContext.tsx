// Built by vsrupeshkumar
// Global light/dark theme. The app is authored in the light "hero" palette with
// hardcoded inline styles, so dark mode is achieved with a single root-level CSS
// filter (see globals.css `.dark-mode`) rather than re-theming every component.
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'rwakins-theme'

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  // Restore saved preference on mount
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Theme | null
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  // Apply the class to <html> + persist
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark-mode')
    else root.classList.remove('dark-mode')
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
