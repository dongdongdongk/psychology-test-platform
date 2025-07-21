'use client'

import { useState, useEffect } from 'react'

export type Theme = 'cute' | 'modern' | 'dark' | 'vibrant' | 'minimal' | 'retro' | 'medical' | 'soft' | 'green' | 'values'

export function useTheme(initialTheme: Theme = 'modern') {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    // DOM에 테마 적용
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return {
    theme,
    setTheme,
    themes: ['cute', 'modern', 'dark', 'vibrant', 'minimal', 'retro', 'medical', 'soft', 'green', 'values'] as Theme[]
  }
}