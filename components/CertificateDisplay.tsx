"use client";

import Link from "next/link";
import Image from "next/image";
import { Award } from "lucide-react";

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_type: 'completion' | 'top_performer';
  course_name: string | null;
  completion_date: string;
}

interface CertificateDisplayProps {
  certificates: Certificate[];
}

export default function CertificateDisplay({ certificates }: CertificateDisplayProps) {
  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border border-border bg-card/30">
        <Award className="w-12 h-12 text-foreground-muted mb-4 opacity-50" />
        <p className="text-foreground-secondary mb-2 font-medium">
          You haven't earned any certificates yet.
        </p>
        <p className="text-sm text-foreground-muted">
          Complete courses and sessions to earn certificates!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {certificates.map((cert) => (
        <Link
          key={cert.id}
          href={`/certificates/${cert.id}`}
          className="certificate-card group"
        >
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-400/10 to-blue-500/10 border border-border p-2 flex items-center justify-center group-hover:border-primary transition-colors">
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
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                {cert.certificate_type === 'top_performer' ? '⭐ Top Performer' : 'Course Completion'}
              </h3>
              <p className="text-sm text-foreground-secondary truncate">{cert.course_name || 'AI Training Course'}</p>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-foreground-muted">
                  Completed: {new Date(cert.completion_date).toLocaleDateString()}
                </p>
                <p className="text-xs text-foreground-muted">
                  Cert #: {cert.certificate_number}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

