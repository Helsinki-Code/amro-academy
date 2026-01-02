import {getCompanion} from "@/lib/actions/companion.actions";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getSubjectColor} from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";

export const dynamic = 'force-dynamic';

interface CompanionSessionPageProps {
    params: Promise<{ id: string}>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params;
    const companion = await getCompanion(id);
    const user = await currentUser();

    const { name, subject, title, topic, duration } = companion;

    if(!user) redirect('/sign-in');
    if(!name) redirect('/companions')

    return (
        <main>
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

            <article className="rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-sm mb-8">
                <div className="flex items-center gap-4 max-md:flex-col max-md:text-center">
                    <div className="size-[80px] flex items-center justify-center rounded-xl max-md:hidden flex-shrink-0" style={{ backgroundColor: getSubjectColor(subject)}}>
                        <Image src={`/icons/${subject}.svg`} alt={subject} width={40} height={40} />
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2 max-md:flex-wrap max-md:justify-center">
                            <p className="font-bold text-2xl sm:text-3xl">
                                {name}
                            </p>
                            <div className="subject-badge max-sm:hidden">
                                {subject}
                            </div>
                        </div>
                        <p className="text-base sm:text-lg text-foreground-secondary">{topic}</p>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-primary max-md:mt-2">
                        {duration} minutes
                    </div>
                </div>
            </article>

            <CompanionComponent
                {...companion}
                companionId={id}
                userName={user.firstName!}
                userImage={user.imageUrl!}
            />
        </main>
    )
}

export default CompanionSession
