import Badge from "./Badge";
import { cn } from "@/lib/utils";

interface BadgeDisplayProps {
  badges: Array<'student' | 'mentor' | 'instructor' | 'graduate' | 'top_performer'>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export default function BadgeDisplay({
  badges,
  className,
  size = 'md',
  showLabels = true
}: BadgeDisplayProps) {
  if (!badges || badges.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 px-4 rounded-xl bg-card/50 border border-border/50", className)}>
        <div className="flex justify-center mb-3">
          <Badge type="student" size={size} showLabel={false} />
        </div>
        <p className="text-sm text-foreground-muted text-center font-medium">
          No badges earned yet
        </p>
        <p className="text-xs text-foreground-muted/70 mt-1">
          Complete courses and achievements to earn badges
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-start justify-center gap-6 md:gap-8", className)}>
      {badges.map((badgeType) => (
        <Badge
          key={badgeType}
          type={badgeType}
          size={size}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

