import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

const Cta = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-500 hover:border-primary/50 group">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-400/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse" />
      </div>

      <div className="relative space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Create & Learn
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold leading-tight">
            Build Your Perfect
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Companion
            </span>
          </h3>
          <p className="text-foreground-secondary text-sm leading-relaxed">
            Customize a personalized learning companion with your preferred subject, voice, and teaching style.
          </p>
        </div>

        {/* Logo */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 blur-xl opacity-30" />
            <Image
              src="/images/amro-ai-academy/amro-ai-academy-logo.png"
              alt="AMRO Academy"
              width={120}
              height={40}
              className="relative object-contain"
              unoptimized
            />
          </div>
        </div>

        {/* Button */}
        <Link href="/companions/new" className="block">
          <button className="group/btn w-full relative px-6 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Build New Companion
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Cta;