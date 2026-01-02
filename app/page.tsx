import Link from "next/link";
import Image from "next/image";
import CompanionCard from "@/components/CompanionCard";
import { getAllCompanions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { ArrowRight, Play } from "lucide-react";

export const dynamic = 'force-dynamic';

const Page = async () => {
  let companions = [];
  try {
    companions = await getAllCompanions({ limit: 6 });
  } catch (error) {
    console.error('Failed to load companions:', error);
    // Continue with empty array if database query fails
  }

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-12 pb-16 overflow-hidden">
        {/* Minimal background gradient */}
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Logo - Large and Visible */}
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                  alt="AMRO Academy"
                  width={400}
                  height={136}
                  className="object-contain h-32 sm:h-40 w-auto"
                  priority
                  unoptimized
                />
              </div>

              {/* Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Voice-First AI Learning
                  </span>
                </div>
              </div>

              {/* Heading - Professional size */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  <span className="text-foreground">Learn Through</span>
                  <br />
                  <span className="text-gradient">Voice</span>
                  <br />
                  <span className="text-foreground">With AI Companions</span>
                </h1>
              </div>

              {/* Subheading */}
              <div>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience personalized education through natural voice conversations
                  with AI tutors that adapt to your unique learning style.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/companions/new"
                  className="btn-premium px-8 py-3 rounded-lg text-primary-foreground font-semibold flex items-center justify-center gap-2 group"
                >
                  <span className="relative z-10">Start Learning</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/companions"
                  className="btn-outline-premium px-8 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  <span>Explore Companions</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="pt-6">
                <div className="grid grid-cols-3 gap-6 sm:gap-8">
                  {[
                    { value: '6+', label: 'Companions' },
                    { value: 'Any', label: 'Subject' },
                    { value: '24/7', label: 'Available' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-display font-bold text-gradient">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              {/* Main card */}
              <div className="glass-card rounded-2xl p-10 space-y-8">
                {/* Logo Circle */}
                <div className="flex justify-center">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--gradient-primary)',
                      boxShadow: '0 4px 20px hsl(186 100% 50% / 0.15)'
                    }}
                  >
                    <Image
                      src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                      alt="AI"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Voice wave visualization */}
                <div className="flex justify-center h-16 items-end gap-1">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = 20 + Math.sin((i / 12) * Math.PI) * 30;
                    return (
                      <div
                        key={i}
                        className="voice-wave-bar w-1.5 rounded-full origin-bottom"
                        style={{
                          height: `${height}%`,
                          animation: `voice-wave 0.8s ease-in-out infinite`,
                          animationDelay: `${Math.sin((i / 12) * Math.PI) * 0.3}s`
                        }}
                      />
                    );
                  })}
                </div>

                {/* Simulated conversation */}
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-muted px-4 py-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">Explain neural networks in simple terms.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div
                      className="px-4 py-3 rounded-lg max-w-[80%] text-primary-foreground"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      <p className="text-sm">
                        Think of neural networks like a brain made of tiny decision-makers...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companions */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neural opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary mb-4">
              Featured Companions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Explore <span className="text-gradient">Popular Companions</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Start learning with our most popular AI tutors, or create your own personalized companion.
            </p>
            <div className="section-divider mt-8" />
          </div>

          {/* Companions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map((companion) => (
              <div
                key={companion.id}
                className="glass-card rounded-xl p-6 companion-card"
              >
                <CompanionCard
                  {...companion}
                  color={getSubjectColor(companion.subject)}
                />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/companions"
              className="btn-premium px-8 py-3 rounded-lg text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 group"
            >
              <span className="relative z-10">View All Companions</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neural opacity-20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary mb-4">
              Why Choose AMRO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Everything You Need to <span className="text-gradient">Learn Better</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              A comprehensive learning platform that combines AI technology with proven educational methods.
            </p>
            <div className="section-divider mt-8" />
          </div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎤',
                title: 'Voice-First Learning',
                description: 'Natural conversations with AI tutors using advanced voice technology.',
              },
              {
                icon: '🧠',
                title: 'Adaptive Intelligence',
                description: 'AI that learns your style and personalizes its teaching approach.',
              },
              {
                icon: '📚',
                title: 'Any Subject',
                description: 'Create companions for science, languages, coding, and everything else.',
              },
              {
                icon: '✨',
                title: 'Real-Time Interaction',
                description: 'Low-latency conversations that feel like talking to a real tutor.',
              },
              {
                icon: '🏆',
                title: 'Gamified Learning',
                description: 'Earn badges and certificates to track your progress and achievements.',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Detailed analytics and insights into your learning journey.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-xl p-6 group hover:shadow-elevated transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-display font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neural opacity-20" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-10 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to Transform Your <span className="text-gradient">Learning Journey</span>?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of learners who have discovered the power of voice-first AI education.
              Start your personalized learning experience today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/companions/new"
                className="btn-premium px-8 py-3 rounded-lg text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 group"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button className="btn-outline-premium px-8 py-3 rounded-lg font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;