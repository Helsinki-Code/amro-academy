'use client';

export default function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated loader */}
        <div className="relative w-32 h-32">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary/80 border-r-primary/40 rounded-full animate-spin" 
               style={{ animationDuration: '2s' }} />
          
          {/* Middle ring */}
          <div className="absolute inset-2 border-4 border-transparent border-b-cyan-400/80 border-l-cyan-400/40 rounded-full animate-spin" 
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          
          {/* Inner ring */}
          <div className="absolute inset-4 border-4 border-transparent border-t-blue-500/60 border-r-blue-500/30 rounded-full animate-spin" 
               style={{ animationDuration: '1s' }} />
          
          {/* Center pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-pulse shadow-lg shadow-cyan-500/50" />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        </div>
        
        {/* Loading text with animated dots */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-base font-semibold text-foreground flex items-center gap-2">
            <span>Loading</span>
            <span className="flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

