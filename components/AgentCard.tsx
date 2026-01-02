"use client"

import { Star, MessageCircle, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

type AgentCardProps = {
  id: string
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string | React.ReactNode
  tags?: string[]
  isVerified?: boolean
  followers?: number
  sessionsCompleted?: number
  subject?: string
}

export function AgentCard({ 
  id,
  name, 
  role, 
  status, 
  avatar, 
  tags = [], 
  isVerified, 
  followers,
  sessionsCompleted,
  subject
}: AgentCardProps) {
  return (
    <Link href={`/companions/${id}`}>
      <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-6 w-80 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] dark:shadow-[12px_12px_24px_rgba(0,0,0,0.3),-12px_-12px_24px_rgba(255,255,255,0.1)] transition-all duration-500 hover:shadow-[20px_20px_40px_rgba(0,206,209,0.2),-20px_-20px_40px_rgba(255,255,255,1)] dark:hover:shadow-[20px_20px_40px_rgba(0,206,209,0.4),-20px_-20px_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2 cursor-pointer">
        {/* Status indicator with pulse animation */}
        <div className="absolute right-4 top-4 z-10">
          <div className="relative">
            <div
              className={cn(
                "h-3 w-3 rounded-full border-2 border-card transition-all duration-300 group-hover:scale-125",
                status === "online"
                  ? "bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                  : status === "away"
                    ? "bg-amber-500"
                    : "bg-gray-400",
              )}
            ></div>
            {status === "online" && (
              <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-30"></div>
            )}
          </div>
        </div>

        {/* Verified badge with bounce animation */}
        {isVerified && (
          <div className="absolute right-4 top-10 z-10">
            <div className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_15px_rgba(0,206,209,0.5)]">
              <Star className="h-3 w-3 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Profile Photo with enhanced hover effects */}
        <div className="mb-4 flex justify-center relative z-10">
          <div className="relative group-hover:animate-pulse">
            <div className="h-28 w-28 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-600/20 p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-8px_-8px_16px_rgba(255,255,255,1)] dark:group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.15)] group-hover:scale-110">
              {typeof avatar === 'string' ? (
                <Image
                  src={avatar}
                  alt={name}
                  width={112}
                  height={112}
                  className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center scale-50">
                  {avatar}
                </div>
              )}
            </div>
            {/* Glowing ring on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 dark:border-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
          </div>
        </div>

        {/* Profile Info with slide-up animation */}
        <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {role}
          </p>

          {subject && (
            <p className="mt-1 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
              {subject}
            </p>
          )}

          {followers !== undefined && (
            <p className="mt-2 text-xs text-muted-foreground transition-all duration-300 group-hover:text-cyan-500 group-hover:font-medium">
              {followers.toLocaleString()} followers
            </p>
          )}

          {sessionsCompleted !== undefined && (
            <p className="mt-2 text-xs text-muted-foreground transition-all duration-300 group-hover:text-blue-500 group-hover:font-medium">
              {sessionsCompleted} sessions completed
            </p>
          )}
        </div>

        {/* Tags with bounce animation */}
        {tags.length > 0 && (
          <div className="mt-4 flex justify-center gap-2 relative z-10">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block rounded-full bg-card border border-border px-3 py-1 text-xs font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] transition-all duration-300",
                  tag === "Premium" || tag === "Mentor" || tag === "Instructor"
                    ? "text-cyan-600 dark:text-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(0,206,209,0.3)]"
                    : "text-foreground group-hover:scale-105",
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons with enhanced hover effects */}
        <div className="mt-6 flex gap-2 relative z-10">
          <button 
            onClick={(e) => e.preventDefault()}
            className="flex-1 rounded-full bg-card border border-border py-4 text-sm font-medium text-cyan-600 dark:text-cyan-400 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/30"
          >
            <UserPlus className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </button>
          <button 
            onClick={(e) => e.preventDefault()}
            className="flex-1 rounded-full bg-card border border-border py-4 text-sm font-medium text-foreground shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-muted"
          >
            <MessageCircle className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
          </button>
        </div>

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-3xl border border-cyan-200 dark:border-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </Link>
  )
}
