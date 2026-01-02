"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CertificateProps {
  certificateNumber: string;
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateType: 'completion' | 'top_performer';
  instructorName?: string;
  directorName?: string;
  className?: string;
}

export default function Certificate({
  certificateNumber,
  studentName,
  courseName,
  completionDate,
  certificateType,
  instructorName = "Course Instructor",
  directorName = "Executive Director",
  className,
}: CertificateProps) {
  const isTopPerformer = certificateType === 'top_performer';
  const certificateImage = isTopPerformer 
    ? '/images/amro-ai-academy/top_performer_certificate.png'
    : '/images/amro-ai-academy/course_completion_certificate.png';

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/images/amro-ai-academy/amro-ai-academy-logo.png"
          alt="AMRO Academy"
          width={140}
          height={50}
          className="object-contain h-12 w-auto"
          unoptimized
        />
      </div>

      {/* Certificate Container */}
      <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {/* Certificate Image Background */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary/50 bg-white dark:bg-slate-50">
          <Image
            src={certificateImage}
            alt={`${certificateType} certificate`}
            fill
            className="object-contain"
            unoptimized
            priority
          />

          {/* Overlay Text (if image doesn't have text) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-8">
              <Image
                src="/images/amro-ai-academy/amro-ai-academy-logo.png"
                alt="AMRO Academy Logo"
                width={200}
                height={60}
                className="mx-auto mb-4"
                unoptimized
              />
            </div>

            {isTopPerformer && (
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 drop-shadow-lg" style={{ color: '#FFD700' }}>
                ⭐ TOP PERFORMER
              </h2>
            )}

            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-slate-800 drop-shadow">
              CERTIFICATE OF {isTopPerformer ? 'ACHIEVEMENT' : 'COMPLETION'}
            </h3>

            <p className="text-base sm:text-lg mb-6 text-slate-700 font-medium">
              THIS IS PRESENTED TO
            </p>

            <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-slate-900 drop-shadow-lg">
              {studentName}
            </h1>

            <p className="text-base sm:text-xl mb-2 text-slate-700">
              for successfully completing the
            </p>

            <p className="text-2xl sm:text-3xl font-bold mb-4 text-blue-600">
              {courseName}
            </p>

            <p className="text-base sm:text-lg mb-8 text-slate-700">
              on {completionDate}
            </p>

            <div className="flex justify-between w-full max-w-2xl mt-8 gap-8">
              <div className="text-center flex-1">
                <div className="border-t-2 border-slate-800 mx-auto mb-2"></div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">{instructorName}</p>
              </div>
              <div className="text-center flex-1">
                <div className="border-t-2 border-slate-800 mx-auto mb-2"></div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">{directorName}</p>
              </div>
            </div>

            <div className="mt-8 text-xs sm:text-sm text-slate-600 font-semibold">
              Certificate Number: {certificateNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

