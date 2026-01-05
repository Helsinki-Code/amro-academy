'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function UpgradePrompt() {
  const { user, isLoaded } = useUser();

  // Check if user has active subscription
  const hasSubscription = user?.publicMetadata?.subscription === 'active' ||
                         user?.publicMetadata?.subscriptionStatus === 'active';

  // Don't show if user is not loaded, not authenticated, or already has subscription
  if (!isLoaded || !user || hasSubscription) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Unlock Unlimited Access</h2>
              <p className="text-sm text-foreground-secondary">Subscribe to create unlimited AI companions and unlock all features</p>
            </div>
          </div>

          <Link
            href="/subscription"
            className="flex-shrink-0 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all whitespace-nowrap"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
