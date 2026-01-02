import CompanionForm from "@/components/CompanionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { newCompanionPermissions } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Lock, ArrowRight, Wand2 } from "lucide-react";

export const dynamic = 'force-dynamic';

const NewCompanion = async () => {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const canCreateCompanion = await newCompanionPermissions();

  return (
    <main className="max-w-3xl mx-auto py-8">
      {canCreateCompanion ? (
        <article className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                alt="AMRO Academy"
                width={140}
                height={50}
                className="object-contain h-12 w-auto"
                priority
                unoptimized
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30">
              <Wand2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Create Mode</span>
            </div>
            <h1 className="text-4xl font-bold">
              Build Your AI Companion
            </h1>
            <p className="text-foreground-secondary max-w-lg mx-auto">
              Design a personalized learning companion tailored to your unique educational needs and preferences.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative p-8 sm:p-10 rounded-2xl bg-card border border-border overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/5 to-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/5 to-cyan-500/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <CompanionForm />
            </div>
          </div>
        </article>
      ) : (
        <article className="companion-limit">
          {/* Logo */}
          <Image
            src="/images/amro-ai-academy/amro-ai-academy-logo.png"
            alt="AMRO Academy"
            width={140}
            height={50}
            className="object-contain h-12 w-auto"
            priority
            unoptimized
          />

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 blur-3xl" />
            <Image
              src="/images/limit.svg"
              alt="Companion limit reached"
              width={280}
              height={180}
              className="relative"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-500">Limit Reached</span>
          </div>

          <h1 className="text-2xl font-bold">You've Reached Your Limit</h1>

          <p className="text-foreground-secondary">
            Upgrade your plan to create more companions and unlock premium features.
          </p>

          <Link href="/subscription" className="w-full">
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade My Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewCompanion;