import { cn } from "@/lib/utils";
import Image from "next/image";

interface BadgeProps {
  type: 'student' | 'mentor' | 'instructor' | 'graduate' | 'top_performer';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const badgeConfig = {
  student: {
    label: 'STUDENT',
    color: '#00CED1',
    icon: '/images/amro-ai-academy/student_badge.png',
  },
  mentor: {
    label: 'MENTOR',
    color: '#00CED1',
    icon: '/images/amro-ai-academy/mentor_badge.png',
  },
  instructor: {
    label: 'INSTRUCTOR',
    color: '#20B2AA',
    icon: '/images/amro-ai-academy/instructor_badge.png',
  },
  graduate: {
    label: 'GRADUATE',
    color: '#00BFFF',
    icon: '/images/amro-ai-academy/graduate_badge.png',
  },
  top_performer: {
    label: 'TOP PERFORMER',
    color: '#FFD700',
    icon: '/images/amro-ai-academy/top_performer_badge.png',
  },
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export default function Badge({ type, size = 'md', className, showLabel = false }: BadgeProps) {
  const config = badgeConfig[type];
  const sizeClass = sizeClasses[size];

  return (
    <div className={cn("flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105", className)}>
      <div
        className={cn(
          "rounded-full border-4 flex items-center justify-center",
          sizeClass,
          "relative overflow-hidden transition-all duration-300 hover:shadow-xl"
        )}
        style={{
          borderColor: config.color,
          backgroundColor: `${config.color}15`,
          boxShadow: `0 8px 16px ${config.color}30, inset 0 1px 2px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Badge Image */}
        <Image
          src={config.icon}
          alt={config.label}
          width={size === 'sm' ? 48 : size === 'md' ? 80 : 120}
          height={size === 'sm' ? 48 : size === 'md' ? 80 : 120}
          className="w-full h-full object-contain"
          unoptimized
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-bold uppercase px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 shadow-md hover:shadow-lg"
          style={{
            backgroundColor: config.color,
            color: type === 'top_performer' ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${config.color}dd`,
          }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}

