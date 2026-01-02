'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { query } from "@/lib/db";

export type CertificateType = 'completion' | 'top_performer';

interface CreateCertificateParams {
  courseName: string;
  certificateType: CertificateType;
  completionDate?: Date;
}

export const createCertificate = async ({ 
  courseName, 
  certificateType,
  completionDate = new Date()
}: CreateCertificateParams) => {
    const { userId } = await auth();
    
    if(!userId) throw new Error('User not authenticated');

    // Generate unique certificate number
    const certificateNumber = `AMRO-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const result = await query(
        `INSERT INTO certificates (user_id, certificate_type, course_name, completion_date, certificate_number)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, certificateType, courseName, completionDate.toISOString().split('T')[0], certificateNumber]
    );

    if (!result.rows || result.rows.length === 0) {
        throw new Error('Failed to create certificate');
    }

    return result.rows[0];
};

export const getUserCertificates = async (userId?: string) => {
    const { userId: currentUserId } = await auth();
    const targetUserId = userId || currentUserId;
    
    if(!targetUserId) return [];

    const result = await query(
        'SELECT * FROM certificates WHERE user_id = $1 ORDER BY completion_date DESC',
        [targetUserId]
    );

    return result.rows || [];
};

export const getCertificate = async (certificateId: string) => {
    const { userId } = await auth();
    
    if(!userId) return null;

    const result = await query(
        'SELECT * FROM certificates WHERE id = $1 AND user_id = $2',
        [certificateId, userId]
    );

    return result.rows[0] || null;
};

export const generateCertificateForSession = async (companionId: string, courseName?: string) => {
    const { userId } = await auth();
    
    if(!userId) throw new Error('User not authenticated');

    // Get companion details
    const companionResult = await query(
        'SELECT name, subject, topic FROM companions WHERE id = $1',
        [companionId]
    );

    const companion = companionResult.rows[0];
    if(!companion) throw new Error('Companion not found');

    const course = courseName || `${companion.subject} - ${companion.topic}`;

    // Create completion certificate
    return await createCertificate({
        courseName: course,
        certificateType: 'completion',
    });
};
