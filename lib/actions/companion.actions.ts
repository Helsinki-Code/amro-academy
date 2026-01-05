'use server';

import {auth, currentUser} from "@clerk/nextjs/server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    if (!author) throw new Error('Unauthorized');

    const result = await query(
        `INSERT INTO companions (name, subject, topic, voice, style, duration, author)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [formData.name, formData.subject, formData.topic, formData.voice, formData.style, formData.duration, author]
    );

    if (!result.rows || result.rows.length === 0) {
        throw new Error('Failed to create a companion');
    }

    return result.rows[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    try {
        let sql = 'SELECT * FROM companions WHERE 1=1';
        const params: any[] = [];
        let paramCount = 0;

        if (subject && topic) {
            paramCount++;
            sql += ` AND LOWER(subject) LIKE LOWER($${paramCount})`;
            params.push(`%${subject}%`);
            paramCount++;
            sql += ` AND (LOWER(topic) LIKE LOWER($${paramCount}) OR LOWER(name) LIKE LOWER($${paramCount}))`;
            params.push(`%${topic}%`);
        } else if (subject) {
            paramCount++;
            sql += ` AND LOWER(subject) LIKE LOWER($${paramCount})`;
            params.push(`%${subject}%`);
        } else if (topic) {
            paramCount++;
            sql += ` AND (LOWER(topic) LIKE LOWER($${paramCount}) OR LOWER(name) LIKE LOWER($${paramCount}))`;
            params.push(`%${topic}%`);
        }

        sql += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, (page - 1) * limit);

        const result = await query(sql, params);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCompanions:', error);
        // Return empty array on error to prevent page crash
        return [];
    }
}

export const getCompanion = async (id: string) => {
    const result = await query('SELECT * FROM companions WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const result = await query(
        'INSERT INTO session_history (companion_id, user_id) VALUES ($1, $2) RETURNING *',
        [companionId, userId]
    );

    return result.rows[0];
}

export const getRecentSessions = async (limit = 10) => {
    const result = await query(
        `SELECT DISTINCT ON (c.id) c.*
         FROM companions c
         INNER JOIN session_history sh ON c.id = sh.companion_id
         ORDER BY c.id, sh.created_at DESC
         LIMIT $1`,
        [limit]
    );

    // Deduplicate by id
    const companionsMap = new Map();
    result.rows.forEach((companion: any) => {
        if(companion && companion.id && !companionsMap.has(companion.id)) {
            companionsMap.set(companion.id, companion);
        }
    });

    return Array.from(companionsMap.values());
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const result = await query(
        `SELECT DISTINCT ON (c.id) c.*
         FROM companions c
         INNER JOIN session_history sh ON c.id = sh.companion_id
         WHERE sh.user_id = $1
         ORDER BY c.id, sh.created_at DESC
         LIMIT $2`,
        [userId, limit]
    );

    // Deduplicate by id
    const companionsMap = new Map();
    result.rows.forEach((companion: any) => {
        if(companion && companion.id && !companionsMap.has(companion.id)) {
            companionsMap.set(companion.id, companion);
        }
    });

    return Array.from(companionsMap.values());
}

export const getUserCompanions = async (userId: string) => {
    const result = await query(
        'SELECT * FROM companions WHERE author = $1 ORDER BY created_at DESC',
        [userId]
    );

    return result.rows;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    
    if(!userId) return false;
    
    // Get user details to check subscription status
    const user = await currentUser();
    
    // Check for your actual Clerk plans: "mentor" and "instructor"
    const hasMentorPlan = has({ plan: 'mentor' });
    const hasInstructorPlan = has({ plan: 'instructor' });
    
    // Check publicMetadata for plan information
    const metadataPlan = user?.publicMetadata?.plan as string | undefined;
    const hasMetadataPlan = metadataPlan === 'mentor' || 
                            metadataPlan === 'instructor' ||
                            metadataPlan === 'professional' ||
                            metadataPlan === 'learner' ||
                            metadataPlan === 'pro' ||
                            metadataPlan === 'premium';
    
    // Check if user has any active subscription
    const hasActiveSubscription = user?.publicMetadata?.subscription === 'active' || 
                                  user?.publicMetadata?.subscriptionStatus === 'active';
    
    // If user has either Mentor or Instructor plan, allow unlimited companions
    if(hasMentorPlan || hasInstructorPlan || hasMetadataPlan || hasActiveSubscription) {
        return true; // Paid users get unlimited companions
    }

    // Log subscription status for debugging (only in development)
    if(user && process.env.NODE_ENV === 'development') {
        console.log('[Companion Permissions] User ID:', userId);
        console.log('[Companion Permissions] Has Mentor plan:', hasMentorPlan);
        console.log('[Companion Permissions] Has Instructor plan:', hasInstructorPlan);
        console.log('[Companion Permissions] Has metadata plan:', hasMetadataPlan);
        console.log('[Companion Permissions] Has active subscription:', hasActiveSubscription);
        console.log('[Companion Permissions] User metadata:', JSON.stringify(user.publicMetadata, null, 2));
    }

    // Check for feature-based limits (for free tier with features)
    let limit = 0;
    
    if(has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    } else {
        // Free tier: no companions allowed
        limit = 0;
    }

    // Get current companion count
    const result = await query(
        'SELECT COUNT(*) as count FROM companions WHERE author = $1',
        [userId]
    );

    const companionCount = parseInt(result.rows[0]?.count || '0', 10);

    // Check if user is under their limit
    // For free tier (limit 0), this will always be false
    return companionCount < limit;
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;

  try {
    const result = await query(
        'INSERT INTO bookmarks (companion_id, user_id) VALUES ($1, $2) ON CONFLICT (companion_id, user_id) DO NOTHING RETURNING *',
        [companionId, userId]
    );
    revalidatePath(path);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add bookmark');
  }
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;

  try {
    const result = await query(
        'DELETE FROM bookmarks WHERE companion_id = $1 AND user_id = $2 RETURNING *',
        [companionId, userId]
    );
    revalidatePath(path);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to remove bookmark');
  }
};

export const getBookmarkedCompanions = async (userId: string) => {
  const result = await query(
      `SELECT c.*
       FROM companions c
       INNER JOIN bookmarks b ON c.id = b.companion_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
  );
  
  return result.rows;
};
