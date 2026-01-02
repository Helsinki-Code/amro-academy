"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCertificate } from "@/lib/actions/certificate.actions";
import { useUser } from "@clerk/nextjs";
import Certificate from "@/components/Certificate";
import Link from "next/link";
import Image from "next/image";

const CertificatePage = () => {
    const params = useParams();
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!isLoaded || !user) {
                router.push('/sign-in');
                return;
            }

            try {
                const cert = await getCertificate(params.id as string);
                setCertificate(cert);
            } catch (error) {
                console.error('Error fetching certificate:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [params.id, user, isLoaded, router]);

    if (!isLoaded || loading) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Image
                    src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                    alt="AMRO Academy"
                    width={140}
                    height={50}
                    className="object-contain h-12 w-auto mb-4"
                    unoptimized
                />
                <div className="animate-pulse text-center">
                    <p className="text-lg text-foreground-secondary">Loading your certificate...</p>
                </div>
            </main>
        );
    }

    if (!certificate) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-6">
                <Image
                    src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                    alt="AMRO Academy"
                    width={140}
                    height={50}
                    className="object-contain h-12 w-auto"
                    unoptimized
                />
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Certificate Not Found</h1>
                    <p className="text-foreground-secondary max-w-md">This certificate does not exist or you don't have access to it.</p>
                </div>
                <Link href="/my-journey" className="btn-primary">
                    Go to My Journey
                </Link>
            </main>
        );
    }

    const completionDate = new Date(certificate.completion_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
            {/* Logo */}
            <Image
                src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                alt="AMRO Academy"
                width={140}
                height={50}
                className="object-contain h-12 w-auto mb-12"
                unoptimized
            />

            <div className="mb-12 text-center space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold">Your Certificate</h1>
                <p className="text-foreground-secondary text-lg">Congratulations on your achievement!</p>
            </div>

            <Certificate
                certificateNumber={certificate.certificate_number}
                studentName={`${user?.firstName || ''} ${user?.lastName || ''}`}
                courseName={certificate.course_name || 'AI Training Course'}
                completionDate={completionDate}
                certificateType={certificate.certificate_type as 'completion' | 'top_performer'}
            />

            <div className="mt-12 flex gap-4 flex-wrap justify-center">
                <button
                    onClick={() => window.print()}
                    className="btn-primary px-6 py-3"
                >
                    Download Certificate
                </button>
                <Link href="/my-journey">
                    <button className="px-6 py-3 rounded-lg font-semibold border border-border bg-transparent hover:bg-card/50 text-foreground transition-all duration-300">
                        Back to My Journey
                    </button>
                </Link>
            </div>
        </main>
    );
};

export default CertificatePage;

