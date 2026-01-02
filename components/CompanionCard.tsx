"use client";

import { removeBookmark, addBookmark } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bookmark, Clock, Play, Sparkles } from "lucide-react";
import { getAvatarByCompanionId } from "@/lib/utils/avatar";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const pathname = usePathname();
  
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      await removeBookmark(id, pathname);
    } else {
      await addBookmark(id, pathname);
    }
  };

  return (
    <Link href={`/companions/${id}`}>
      <article 
        className="companion-card group"
        style={{ '--card-gradient': `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` } as any}
      >
        {/* Top Gradient Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
        />

        {/* Avatar */}
        <div className="mb-4 flex justify-center pt-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-card border-2 border-border flex items-center justify-center">
            <div className="scale-150">
              {getAvatarByCompanionId(id).svg}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="companion-card-header">
          <div 
            className="subject-badge"
            style={{ 
              '--badge-color': color,
              '--badge-color-dark': `${color}dd`
            } as any}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={14}
              height={14}
              className="opacity-90"
            />
            {subject}
          </div>
          
          <button
            onClick={handleBookmark}
            className={cn(
              "companion-bookmark",
              bookmarked && "bg-amber-500/10 border-amber-500/30"
            )}
          >
            <Bookmark 
              className={cn(
                "w-4 h-4 transition-colors",
                bookmarked ? "fill-amber-500 text-amber-500" : "text-foreground-muted"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="companion-card-content">
          <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-foreground-secondary line-clamp-2">
            {topic}
          </p>
        </div>

        {/* Footer */}
        <div className="companion-card-footer">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <Clock className="w-4 h-4" />
              <span>{duration} min</span>
            </div>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Sparkles className="w-4 h-4" style={{ color }} />
            </div>
          </div>
          
          <button 
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
              boxShadow: `0 4px 14px ${color}40`
            }}
          >
            <Play className="w-4 h-4" />
            Start Lesson
          </button>
        </div>
      </article>
    </Link>
  );
};

export default CompanionCard;