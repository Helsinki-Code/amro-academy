'use server';

import { auth } from "@clerk/nextjs/server";
import { query } from "@/lib/db";

export type BadgeType = 'student' | 'mentor' | 'instructor' | 'graduate' | 'top_performer';

export const getUserBadges = async (userId: string): Promise<BadgeType[]> => {
    const result = await query(
        'SELECT badge_type FROM user_badges WHERE user_id = $1 ORDER BY earned_at ASC',
        [userId]
    );

    return result.rows.map(row => row.badge_type as BadgeType);
};

export const awardBadge = async (userId: string, badgeType: BadgeType) => {
    // Check if badge already exists
    const existing = await query(
        'SELECT id FROM user_badges WHERE user_id = $1 AND badge_type = $2',
        [userId, badgeType]
    );

    if (existing.rows.length > 0) {
        return { success: false, message: 'Badge already awarded' };
    }

    try {
        const result = await query(
            'INSERT INTO user_badges (user_id, badge_type) VALUES ($1, $2) RETURNING *',
            [userId, badgeType]
        );

        return { success: true, data: result.rows[0] };
    } catch (error: any) {
        console.error('Error awarding badge:', error);
        return { success: false, message: error.message };
    }
};

export const checkAndAwardBadges = async (userId: string) => {
    const { userId: currentUserId } = await auth();
    if (!currentUserId || currentUserId !== userId) {
        return [];
    }

    const awardedBadges: BadgeType[] = [];

    // Get user's companion count
    const companionResult = await query(
        'SELECT COUNT(*) as count FROM companions WHERE author = $1',
        [userId]
    );
    const totalCompanions = parseInt(companionResult.rows[0]?.count || '0', 10);

    // Get user's session count
    const sessionResult = await query(
        'SELECT COUNT(*) as count FROM session_history WHERE user_id = $1',
        [userId]
    );
    const totalSessions = parseInt(sessionResult.rows[0]?.count || '0', 10);

    // Award MENTOR badge (5+ companions)
    if (totalCompanions >= 5) {
        const result = await awardBadge(userId, 'mentor');
        if (result.success) awardedBadges.push('mentor');
    }

    // Award INSTRUCTOR badge (10+ companions AND 20+ sessions)
    if (totalCompanions >= 10 && totalSessions >= 20) {
        const result = await awardBadge(userId, 'instructor');
        if (result.success) awardedBadges.push('instructor');
    }

    // Note: STUDENT badge is awarded on signup (handled separately)
    // GRADUATE and TOP PERFORMER badges require additional logic

    return awardedBadges;
};
