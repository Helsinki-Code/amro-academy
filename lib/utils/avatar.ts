import { avatars, type Avatar } from "@/components/ui/avatar-picker";

/**
 * Get an avatar by ID
 */
export function getAvatarById(id: number): Avatar | undefined {
    return avatars.find(avatar => avatar.id === id);
}

/**
 * Get avatar by companion ID (consistent hash-based selection)
 */
export function getAvatarByCompanionId(companionId: string): Avatar {
    // Simple hash function to consistently map companion ID to avatar
    let hash = 0;
    for (let i = 0; i < companionId.length; i++) {
        const char = companionId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Ensure positive number and map to avatar index (1-4)
    const avatarIndex = (Math.abs(hash) % avatars.length);
    return avatars[avatarIndex] || avatars[0];
}

/**
 * Get default avatar
 */
export function getDefaultAvatar(): Avatar {
    return avatars[0];
}
