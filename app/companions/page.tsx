import { getAllCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { Users, Search, Filter } from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

const CompanionsLibrary = async ({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) => {
  try {
    const filters = await searchParams;
    const subject = filters?.subject ? String(filters.subject) : '';
    const topic = filters?.topic ? String(filters.topic) : '';

    const companions = await getAllCompanions({ subject, topic }) || [];

  return (
    <main className="max-w-7xl mx-auto">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
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

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-cyan-400/20">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Companion Library
            </h1>
            <p className="text-foreground-secondary mt-1">
              Explore {companions.length} AI learning companions
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <div className="flex-1 relative">
            <SearchInput />
          </div>
          <div className="sm:w-48">
            <SubjectFilter />
          </div>
        </div>
      </div>

      {/* Companions Grid */}
      <section className="home-section">
        {companions.length > 0 ? (
          companions.map((companion, index) => (
            <div 
              key={companion.id}
              className="animate-slide-up"
              style={{ 
                opacity: 0, 
                animationFillMode: 'forwards',
                animationDelay: `${index * 50}ms`
              }}
            >
              <CompanionCard
                {...companion}
                color={getSubjectColor(companion.subject)}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-foreground-muted/10 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-foreground-muted" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No companions found</h3>
            <p className="text-foreground-secondary max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </section>
    </main>
    );
  } catch (error) {
    console.error('Error in CompanionsLibrary:', error);
    return (
      <main className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-center">
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
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-foreground-muted/10 flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-foreground-muted" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Unable to load companions</h3>
          <p className="text-foreground-secondary max-w-md">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </main>
    );
  }
};

export default CompanionsLibrary;