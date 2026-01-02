"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { cn } from "@/lib/utils"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  className?: string
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#00CED1",
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Simple CSS-based highlighting (fallback if rough-notation is not available)
    const baseClasses = "relative inline-block"
    
    // Apply different styles based on action
    const actionClasses = {
      highlight: "bg-cyan-200/50 dark:bg-cyan-900/30 px-1 rounded",
      underline: "border-b-2 border-cyan-500 dark:border-cyan-400 pb-0.5",
      box: "border-2 border-cyan-500 dark:border-cyan-400 px-1 rounded",
      circle: "relative before:content-[''] before:absolute before:inset-0 before:rounded-full before:border-2 before:border-cyan-500 dark:before:border-cyan-400 before:p-1",
      "strike-through": "line-through decoration-cyan-500 dark:decoration-cyan-400 decoration-2",
      "crossed-off": "line-through decoration-red-500 dark:decoration-red-400 decoration-2",
      bracket: "before:content-['['] after:content-[']'] before:text-cyan-500 after:text-cyan-500 dark:before:text-cyan-400 dark:after:text-cyan-400 font-bold",
    }

    element.className = cn(baseClasses, actionClasses[action], className)

    // Apply custom color if provided
    if (color && action === "highlight") {
      element.style.backgroundColor = `${color}40`
    }

    return () => {
      // Cleanup if needed
    }
  }, [action, color, className])

  return (
    <span 
      ref={elementRef} 
      className={cn("relative inline-block", className)}
      style={action === "highlight" ? { backgroundColor: `${color}40` } : {}}
    >
      {children}
    </span>
  )
}
