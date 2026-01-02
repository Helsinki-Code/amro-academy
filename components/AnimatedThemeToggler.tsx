"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "./ThemeProvider"

import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, toggleTheme: baseToggleTheme } = useTheme()
  const [isDark, setIsDark] = useState(theme === "dark")
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsDark(theme === "dark")
  }, [theme])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    const newTheme = !isDark
    setIsDark(newTheme)

    // Use view transition API if available
    if (document.startViewTransition) {
      await document.startViewTransition(() => {
        flushSync(() => {
          baseToggleTheme()
        })
      }).ready

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      // Fallback if view transition API is not supported
      baseToggleTheme()
    }
  }, [isDark, duration, baseToggleTheme])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-full transition-colors hover:bg-muted",
        "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      {...props}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
