import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { PublicProfile } from "@shared/types";

interface HeroSectionProps {
    profile: PublicProfile;
    theme: any;
    itemVariants: any;
}

// Hero Style: Split (Avatar on right, text on left)
export function HeroSplit({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = theme?.colors || {};

    return (
        <section className="max-w-5xl mx-auto px-6 py-12 sm:py-20">
            <motion.div
                variants={itemVariants}
                className="flex flex-col-reverse sm:flex-row items-center justify-between gap-10"
            >
                {/* Left - Text Content */}
                <div className="flex-1 text-center sm:text-left space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-1" style={{ color: colors.accent }}>
                            Hello, I'm
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: colors.primary }}>
                            {profile.fullName}
                        </h1>
                    </div>
                    
                    {profile.profession && (
                        <p className="text-xl sm:text-2xl font-medium" style={{ color: colors.accent }}>
                            {profile.profession}
                        </p>
                    )}
                    
                    {profile.tagline && (
                        <p className="text-lg" style={{ color: colors.textSecondary }}>
                            {profile.tagline}
                        </p>
                    )}

                    {profile.location && (
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm" style={{ color: colors.textSecondary }}>
                            <MapPin className="w-4 h-4" /> {profile.location}
                        </div>
                    )}
                </div>

                {/* Right - Avatar */}
                <div className="relative">
                    <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-2xl ring-4" style={{ "--tw-ring-color": colors.primary } as React.CSSProperties}>
                        <Avatar className="w-full h-full">
                            <AvatarImage src={profile.avatarUrl || ""} className="object-cover" />
                            <AvatarFallback className="text-5xl" style={{ backgroundColor: colors.primary, color: colors.background }}>
                                {profile.fullName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// Hero Style: Centered (All centered)
export function HeroCentered({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = theme?.colors || {};

    return (
        <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
            <motion.div variants={itemVariants} className="space-y-6">
                {/* Avatar */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden shadow-2xl ring-4" style={{ "--tw-ring-color": colors.primary } as React.CSSProperties}>
                    <Avatar className="w-full h-full">
                        <AvatarImage src={profile.avatarUrl || ""} className="object-cover" />
                        <AvatarFallback className="text-5xl" style={{ backgroundColor: colors.primary, color: colors.background }}>
                            {profile.fullName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Text */}
                <div>
                    <p className="text-sm font-medium" style={{ color: colors.accent }}>Hello, I'm</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: colors.primary }}>
                        {profile.fullName}
                    </h1>
                    {profile.profession && (
                        <p className="text-xl sm:text-2xl font-medium mt-2" style={{ color: colors.accent }}>
                            {profile.profession}
                        </p>
                    )}
                </div>

                {profile.tagline && (
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
                        {profile.tagline}
                    </p>
                )}

                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                    {profile.location && <><MapPin className="w-4 h-4" /> {profile.location}</>}
                </div>
            </motion.div>
        </section>
    );
}

// Hero Style: Minimal (Simple, clean)
export function HeroMinimal({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = theme?.colors || {};

    return (
        <section className="max-w-3xl mx-auto px-6 py-12">
            <motion.div variants={itemVariants} className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: colors.primary }}>
                    {profile.fullName}
                </h1>
                {profile.profession && (
                    <p className="text-lg" style={{ color: colors.textSecondary }}>
                        {profile.profession}
                    </p>
                )}
                {profile.tagline && (
                    <p className="text-sm max-w-lg mx-auto" style={{ color: colors.textSecondary }}>
                        {profile.tagline}
                    </p>
                )}
            </motion.div>
        </section>
    );
}

// Hero Style: Creative (With decorative elements)
export function HeroCreative({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = theme?.colors || {};

    return (
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
            <motion.div variants={itemVariants} className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 -z-10 opacity-20">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ backgroundColor: colors.accent }} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ backgroundColor: colors.primary }} />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Text - Left */}
                    <div className="order-2 sm:order-1 flex-1 text-center sm:text-left space-y-4">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.accent, color: colors.background }}>
                            {profile.profession || "Welcome"}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold" style={{ color: colors.primary }}>
                            {profile.fullName}
                        </h1>
                        {profile.tagline && (
                            <p className="text-lg" style={{ color: colors.textSecondary }}>
                                {profile.tagline}
                            </p>
                        )}
                        {profile.location && (
                            <p className="text-sm flex items-center gap-1 justify-center sm:justify-start" style={{ color: colors.textSecondary }}>
                                <MapPin className="w-4 h-4" /> {profile.location}
                            </p>
                        )}
                    </div>

                    {/* Avatar - Right */}
                    <div className="order-1 sm:order-2">
                        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300" style={{ backgroundColor: colors.surface }}>
                            <Avatar className="w-full h-full">
                                <AvatarImage src={profile.avatarUrl || ""} className="object-cover" />
                                <AvatarFallback className="text-5xl" style={{ backgroundColor: colors.primary, color: colors.background }}>
                                    {profile.fullName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// Export all hero variants
export const heroComponents = {
    split: HeroSplit,
    centered: HeroCentered,
    minimal: HeroMinimal,
    creative: HeroCreative,
};
