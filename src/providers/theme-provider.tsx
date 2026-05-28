import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // load client-side only
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(storageKey) as Theme | null
    if (stored) setThemeState(stored)
  }, [storageKey])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    root.classList.remove('light', 'dark')

    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    root.classList.add(resolved)
  }, [theme])

  const setTheme = (value: Theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, value)
    }
    setThemeState(value)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}