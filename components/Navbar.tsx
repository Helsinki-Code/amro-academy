"use client"

import { Home, Users, BookOpen, User, Sparkles } from "lucide-react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { FloatingNavBar } from "./FloatingNavBar"
import { AnimatedThemeToggler } from "./AnimatedThemeToggler"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

export default function Navbar() {
  const { isSignedIn } = useUser()

  const navItems = [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Companions",
      url: "/companions",
      icon: Users,
    },
    {
      name: "My Journey",
      url: "/my-journey",
      icon: BookOpen,
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                alt="AMRO AI Academy"
                width={120}
                height={40}
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.url}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard: "bg-card border-border",
                  }
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <FloatingNavBar items={navItems} className="!relative !bottom-0 !translate-x-0 mb-0 pt-2" />
      </div>
    </nav>
  )
}