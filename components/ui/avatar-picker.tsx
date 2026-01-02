"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Avatar {
    id: number;
    svg: React.ReactNode;
    alt: string;
}

const avatars: Avatar[] = [
    {
        id: 1,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 1"
            >
                <mask
                    id="avatar1"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#avatar1)">
                    <rect width="36" height="36" fill="#ff005b" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(9 -5) rotate(219 18 18) scale(1)"
                        fill="#ffb238"
                        rx="6"
                    />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path
                            d="M15 19c2 1 4 1 6 0"
                            stroke="#000000"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="10"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                        <rect
                            x="24"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 1",
    },
    {
        id: 2,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
            >
                <mask
                    id="avatar2"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                </mask>
                <g mask="url(#avatar2)">
                    <rect width="36" height="36" fill="#ff7d10"></rect>
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(5 -1) rotate(55 18 18) scale(1.1)"
                        fill="#0a0310"
                        rx="6"
                    />
                    <g transform="translate(7 -6) rotate(-5 18 18)">
                        <path
                            d="M15 20c2 1 4 1 6 0"
                            stroke="#FFFFFF"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="14"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                        <rect
                            x="20"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 2",
    },
    {
        id: 3,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
            >
                <mask
                    id="avatar3"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                </mask>
                <g mask="url(#avatar3)">
                    <rect width="36" height="36" fill="#0a0310" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(-3 7) rotate(227 18 18) scale(1.2)"
                        fill="#ff005b"
                        rx="36"
                    />
                    <g transform="translate(-3 3.5) rotate(7 18 18)">
                        <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
                        <rect
                            x="12"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                        <rect
                            x="22"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 3",
    },
    {
        id: 4,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
            >
                <mask
                    id="avatar4"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                </mask>
                <g mask="url(#avatar4)">
                    <rect width="36" height="36" fill="#d8fcb3"></rect>
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(9 -5) rotate(219 18 18) scale(1)"
                        fill="#89fcb3"
                        rx="6"
                    ></rect>
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path
                            d="M15 19c2 1 4 1 6 0"
                            stroke="#000000"
                            fill="none"
                            strokeLinecap="round"
                        ></path>
                        <rect
                            x="10"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        ></rect>
                        <rect
                            x="24"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        ></rect>
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 4",
    },
];

// Animation variants
const mainAvatarVariants = {
    initial: {
        y: 20,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 20,
        },
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const pickerVariants = {
    container: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    },
    item: {
        initial: {
            y: 20,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20,
            },
        },
    },
};

const selectedVariants = {
    initial: {
        opacity: 0,
        rotate: -180,
    },
    animate: {
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 15,
        },
    },
    exit: {
        opacity: 0,
        rotate: 180,
        transition: {
            duration: 0.2,
        },
    },
};

interface AvatarPickerProps {
    selectedAvatarId?: number;
    onAvatarSelect?: (avatarId: number) => void;
    className?: string;
}

export function AvatarPicker({ selectedAvatarId, onAvatarSelect, className }: AvatarPickerProps) {
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(
        avatars.find(a => a.id === selectedAvatarId) || avatars[0]
    );
    const [rotationCount, setRotationCount] = useState(0);

    const handleAvatarSelect = (avatar: Avatar) => {
        setRotationCount((prev) => prev + 1080);
        setSelectedAvatar(avatar);
        onAvatarSelect?.(avatar.id);
    };

    return (
        <motion.div initial="initial" animate="animate" className={cn("w-full", className)}>
            <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-b from-background to-muted/30 border-border">
                <CardContent className="p-0">
                    {/* Background header */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: "8rem",
                            transition: {
                                height: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20,
                                },
                            },
                        }}
                        className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 w-full"
                    />

                    <div className="px-8 pb-8 -mt-16">
                        {/* Main avatar display */}
                        <motion.div
                            className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 bg-background flex items-center justify-center"
                            variants={mainAvatarVariants}
                            layoutId="selectedAvatar"
                        >
                            <motion.div
                                className="w-full h-full flex items-center justify-center scale-[3]"
                                animate={{
                                    rotate: rotationCount,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                {selectedAvatar.svg}
                            </motion.div>
                        </motion.div>

                        {/* Username display */}
                        <motion.div
                            className="text-center mt-4"
                            variants={pickerVariants.item}
                        >
                            <motion.h2
                                className="text-2xl font-bold text-foreground"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Agent Avatar
                            </motion.h2>
                            <motion.p
                                className="text-muted-foreground text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Select your companion's avatar
                            </motion.p>
                        </motion.div>

                        {/* Avatar selection */}
                        <motion.div
                            className="mt-6"
                            variants={pickerVariants.container}
                        >
                            <motion.div
                                className="flex justify-center gap-4"
                                variants={pickerVariants.container}
                            >
                                {avatars.map((avatar) => (
                                    <motion.button
                                        key={avatar.id}
                                        onClick={() => handleAvatarSelect(avatar)}
                                        className={cn(
                                            "relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300",
                                            selectedAvatar.id === avatar.id
                                                ? "border-cyan-500 dark:border-cyan-400 scale-110"
                                                : "border-border hover:border-cyan-500/50"
                                        )}
                                        variants={pickerVariants.item}
                                        whileHover={{
                                            y: -2,
                                            transition: { duration: 0.2 },
                                        }}
                                        whileTap={{
                                            y: 0,
                                            transition: { duration: 0.2 },
                                        }}
                                        aria-label={`Select ${avatar.alt}`}
                                        aria-pressed={selectedAvatar.id === avatar.id}
                                    >
                                        <div className="w-full h-full flex items-center justify-center">
                                            {avatar.svg}
                                        </div>
                                        {selectedAvatar.id === avatar.id && (
                                            <motion.div
                                                className="absolute inset-0 bg-cyan-500/20 ring-2 ring-cyan-500 dark:ring-cyan-400 ring-offset-2 ring-offset-background rounded-full"
                                                variants={selectedVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                                layoutId="selectedIndicator"
                                            />
                                        )}
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// Export avatars array for use in other components
export { avatars };
export type { Avatar };
