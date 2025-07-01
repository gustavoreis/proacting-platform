"use client"

import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const { theme, setTheme } = useNextTheme()

  return {
    theme: theme as "dark" | "light" | "system" | undefined,
    setTheme: setTheme as (theme: "dark" | "light" | "system") => void,
  }
} 