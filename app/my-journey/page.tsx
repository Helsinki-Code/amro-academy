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

export const dynamic = 'force-dynamic';

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);
  const certificates = await getUserCertificates(user.id);
  
  // Check and award badges based on user progress
  await checkAndAwardBadges(user.id);
  let userBadges = await getUserBadges(user.id);
  
  // Ensure student badge exists (awarded on signup)
  if (!userBadges.includes('student')) {
    const { awardBadge } = await import("@/lib/actions/badge.actions");
    const result = await awardBadge(user.id, 'student');
    if (result.success) {
      userBadges = await getUserBadges(user.id);
    }
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
};
export default Profile;
