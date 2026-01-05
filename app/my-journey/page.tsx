import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import { getUserBadges, checkAndAwardBadges } from "@/lib/actions/badge.actions";
import { getUserCertificates } from "@/lib/actions/certificate.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";
import BadgeDisplay from "@/components/BadgeDisplay";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

const Profile = async () => {
  try {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    let companions: any[] = [];
    let sessionHistory: any[] = [];
    let bookmarkedCompanions: any[] = [];
    let certificates: any[] = [];
    let userBadges: string[] = [];

    try {
      companions = await getUserCompanions(user.id) || [];
    } catch (error) {
      console.error('Error fetching companions:', error);
      companions = [];
    }

    try {
      sessionHistory = await getUserSessions(user.id) || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      sessionHistory = [];
    }

    try {
      bookmarkedCompanions = await getBookmarkedCompanions(user.id) || [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      bookmarkedCompanions = [];
    }

    try {
      certificates = await getUserCertificates(user.id) || [];
    } catch (error) {
      console.error('Error fetching certificates:', error);
      certificates = [];
    }
    
    try {
      await checkAndAwardBadges(user.id);
    } catch (error) {
      console.error('Error checking badges:', error);
    }

    try {
      userBadges = await getUserBadges(user.id) || [];
    } catch (error) {
      console.error('Error fetching badges:', error);
      userBadges = [];
    }
    
    try {
      if (!userBadges.includes('student')) {
        const { awardBadge } = await import("@/lib/actions/badge.actions");
        const result = await awardBadge(user.id, 'student');
        if (result.success) {
          userBadges = await getUserBadges(user.id) || [];
        }
      }
    } catch (error) {
      console.error('Error awarding student badge:', error);
    }

  return (
    <main>
      {/* Logo Section */}
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

      <section className="mb-12 pb-8 border-b border-border">
        <div className="flex justify-between gap-6 max-lg:flex-col items-start">
          <div className="flex gap-5 items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary shadow-lg">
              <Image
                src={user.imageUrl}
                alt={user.firstName!}
                width={110}
                height={110}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
          <div className="flex gap-6 max-sm:flex-col w-full max-lg:w-auto">
            <div className="profile-stat-card">
              <div className="flex gap-3 items-center mb-2">
                <div className="bg-primary bg-opacity-10 p-2.5 rounded-lg">
                  <Image
                    src="/icons/check.svg"
                    alt="checkmark"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-3xl font-bold text-primary">{sessionHistory.length}</p>
              </div>
              <div className="text-sm font-medium">Lessons Completed</div>
            </div>
            <div className="profile-stat-card">
              <div className="flex gap-3 items-center mb-2">
                <div className="bg-primary bg-opacity-10 p-2.5 rounded-lg">
                  <Image src="/icons/cap.svg" alt="cap" width={24} height={24} />
                </div>
                <p className="text-3xl font-bold text-primary">{companions.length}</p>
              </div>
              <div className="text-sm font-medium">Companions Created</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AMRO Academy Badges Section */}
      <section className="section-card">
        <h2 className="font-bold text-2xl mb-4">AMRO Academy Badges</h2>
        <BadgeDisplay badges={userBadges} size="md" showLabels={true} />
        <p className="text-sm text-muted-foreground mt-4">
          Earn badges by creating companions, completing sessions, and achieving milestones!
        </p>
      </section>

      {/* Certificates Section */}
      <section className="section-card">
        <h2 className="font-bold text-2xl mb-4">My Certificates</h2>
        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/${cert.id}`}
                className="certificate-card"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={
                      cert.certificate_type === 'top_performer'
                        ? '/images/amro-ai-academy/top_performer_certificate.png'
                        : '/images/amro-ai-academy/course_completion_certificate.png'
                    }
                    alt={cert.certificate_type}
                    width={60}
                    height={45}
                    className="object-contain"
                    unoptimized
                  />
                  <div>
                    <h3 className="font-bold text-lg">
                      {cert.certificate_type === 'top_performer' ? 'Top Performer' : 'Course Completion'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cert.course_name}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Completed: {new Date(cert.completion_date).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Certificate #: {cert.certificate_number}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You haven't earned any certificates yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Complete courses and sessions to earn certificates!
            </p>
          </div>
        )}
      </section>

      <Accordion type="multiple">
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            Bookmarked Companions {`(${bookmarkedCompanions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              companions={bookmarkedCompanions}
              title="Bookmarked Companions"
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            Recent Sessions
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              title="Recent Sessions"
              companions={sessionHistory}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            My Companions {`(${companions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList title="My Companions" companions={companions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
    );
  } catch (error) {
    console.error('Error in Profile component:', error);
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Unable to load your journey</h3>
          <p className="text-foreground-secondary max-w-md mb-4">
            An error occurred while loading your profile. Please try refreshing the page.
          </p>
          <Link
            href="/"
            className="btn-primary px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }
};
export default Profile;
