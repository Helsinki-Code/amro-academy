"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Stars for dark mode */}
      <div className="theme-toggle-stars">
        <div className="theme-toggle-star" />
        <div className="theme-toggle-star" />
        <div className="theme-toggle-star" />
      </div>
      
      {/* Orb */}
      <div className="theme-toggle-orb">
        {theme === "dark" ? (
          <Moon className="w-3.5 h-3.5" />
        ) : (
          <Sun className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  );
}