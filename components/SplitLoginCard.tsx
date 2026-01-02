"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function SplitLoginCard() {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden bg-card border border-border">
      
      {/* Left Side: Welcome + Illustration */}
      <div className="md:w-1/2 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex flex-col items-center justify-center p-8">
        <div className="mb-6">
          <Image
            src="/images/amro-ai-academy/amro-ai-academy-logo.png"
            alt="AMRO AI Academy Logo"
            width={180}
            height={60}
            className="object-contain"
            unoptimized
          />
        </div>
        <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
        <p className="mb-6 text-center text-white/90">Sign in to continue to your dashboard and enjoy seamless learning experience with AI companions.</p>
        <div className="mt-4">
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="md:w-1/2 p-8 flex flex-col justify-center bg-card">
        <h3 className="text-2xl font-semibold mb-6 text-foreground">Sign In</h3>
        
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" className="mt-1" />
          </div>
        </div>

        <Button className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          Login
        </Button>

        <p className="mt-4 text-sm text-muted-foreground text-center">
          Don't have an account? <a href="/sign-up" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">Sign up</a>
        </p>
      </div>
    </div>
  )
}
