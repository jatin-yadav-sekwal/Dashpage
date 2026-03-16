import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Sparkles, Briefcase, Heart } from "lucide-react";
import { PublicProfile } from "@shared/types";

interface HeroSectionProps {
    profile: PublicProfile;
    theme: any;
    itemVariants: any;
}

const DEFAULT_COLORS = {
    background: "#ffffff",
    surface: "#f8fafc",
    primary: "#0f172a",
    text: "#1e293b",
    textSecondary: "#64748b",
    accent: "#3b82f6"
};

const getColors = (themeColors: any) => {
    if (!themeColors) return DEFAULT_COLORS;
    return {
        background: themeColors.background || DEFAULT_COLORS.background,
        surface: themeColors.surface || DEFAULT_COLORS.surface,
        primary: themeColors.primary || DEFAULT_COLORS.primary,
        text: themeColors.text || DEFAULT_COLORS.text,
        textSecondary: themeColors.textSecondary || DEFAULT_COLORS.textSecondary,
        accent: themeColors.accent || DEFAULT_COLORS.accent
    };
};

const hexToRgba = (hex: string | undefined, alpha: number) => {
    if (!hex) return `rgba(128, 128, 128, ${alpha})`;
    try {
        const cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            const r = parseInt(cleanHex[0] + cleanHex[0], 16);
            const g = parseInt(cleanHex[1] + cleanHex[1], 16);
            const b = parseInt(cleanHex[2] + cleanHex[2], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        if (cleanHex.length === 6) {
            const r = parseInt(cleanHex.slice(0, 2), 16);
            const g = parseInt(cleanHex.slice(2, 4), 16);
            const b = parseInt(cleanHex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
    } catch (e) {
        return `rgba(128, 128, 128, ${alpha})`;
    }
    return `rgba(128, 128, 128, ${alpha})`;
};

// Hero Style: Split (Avatar on right, text on left)
export function HeroSplit({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = getColors(theme?.colors);
    const headingFont = theme?.fonts?.heading || "Inter";

    return (
        <section className="max-w-5xl mx-auto px-6 py-12 sm:py-20">
            <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col-reverse sm:flex-row items-center justify-between gap-10"
            >
                {/* Left - Text Content */}
                <div className="flex-1 text-center sm:text-left space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                            Hello, I'm
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: colors.primary, fontFamily: headingFont }}>
                            {profile.fullName}
                        </h1>
                    </motion.div>
                    
                    {profile.profession && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center justify-center sm:justify-start gap-2"
                        >
                            <span 
                                className="px-4 py-1.5 rounded-full text-sm font-medium"
                                style={{ 
                                    backgroundColor: hexToRgba(colors.accent, 0.15),
                                    color: colors.accent
                                }}
                            >
                                {profile.profession}
                            </span>
                        </motion.div>
                    )}
                    
                    {profile.tagline && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg max-w-xl"
                            style={{ color: colors.textSecondary }}
                        >
                            {profile.tagline}
                        </motion.p>
                    )}

                    {profile.location && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center sm:justify-start gap-2 text-sm"
                            style={{ color: colors.textSecondary }}
                        >
                            <MapPin className="w-4 h-4" /> 
                            <span>{profile.location}</span>
                        </motion.div>
                    )}
                </div>

                {/* Right - Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative"
                >
                    <div 
                        className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
                    >
                        {/* Glowing background */}
                        <div 
                            className="absolute inset-0 rounded-full blur-2xl opacity-30"
                            style={{ backgroundColor: colors.accent }}
                        />
                        
                        {/* Main avatar container */}
                        <div 
                            className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4"
                            style={{ 
                                borderColor: colors.primary,
                                boxShadow: `0 0 0 4px ${hexToRgba(colors.primary, 0.1)}, 0 20px 50px ${hexToRgba(colors.primary, 0.2)}`
                            }}
                        >
                            <Avatar className="w-full h-full">
                                <AvatarImage src={profile.avatarUrl || ""} className="object-cover" />
                                <AvatarFallback 
                                    className="text-5xl" 
                                    style={{ 
                                        backgroundColor: colors.primary, 
                                        color: colors.background 
                                    }}
                                >
                                    {profile.fullName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Decorative elements */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.accent }}
                        >
                            <Sparkles className="w-4 h-4" style={{ color: colors.background }} />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

// Hero Style: Centered (All centered)
export function HeroCentered({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = getColors(theme?.colors);
    const headingFont = theme?.fonts?.heading || "Inter";

    return (
        <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
            <motion.div 
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                {/* Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative inline-block"
                >
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                        <div 
                            className="absolute inset-0 rounded-full blur-xl opacity-30"
                            style={{ backgroundColor: colors.accent }}
                        />
                        <div 
                            className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4"
                            style={{ 
                                borderColor: colors.primary,
                                boxShadow: `0 0 0 4px ${hexToRgba(colors.primary, 0.1)}`
                            }}
                        >
                            <Avatar className="w-full h-full">
                                <AvatarImage src={profile.avatarUrl || ""} className="object-cover" />
                                <AvatarFallback 
                                    className="text-5xl" 
                                    style={{ 
                                        backgroundColor: colors.primary, 
                                        color: colors.background 
                                    }}
                                >
                                    {profile.fullName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>
                        Hello, I'm
                    </p>
                    <h1 
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
                        style={{ color: colors.primary, fontFamily: headingFont }}
                    >
                        {profile.fullName}
                    </h1>
                    {profile.profession && (
                        <div 
                            className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium"
                            style={{ 
                                backgroundColor: hexToRgba(colors.accent, 0.15),
                                color: colors.accent
                            }}
                        >
                            {profile.profession}
                        </div>
                    )}
                </motion.div>

                {profile.tagline && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg max-w-2xl mx-auto"
                        style={{ color: colors.textSecondary }}
                    >
                        {profile.tagline}
                    </motion.p>
                )}

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 text-sm"
                    style={{ color: colors.textSecondary }}
                >
                    {profile.location && (
                        <>
                            <MapPin className="w-4 h-4" /> 
                            <span>{profile.location}</span>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
}

// Hero Style: Minimal (Simple, clean)
export function HeroMinimal({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = getColors(theme?.colors);
    const headingFont = theme?.fonts?.heading || "Inter";

    return (
        <section className="max-w-3xl mx-auto px-6 py-12">
            <motion.div 
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4"
            >
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl font-bold"
                    style={{ color: colors.primary, fontFamily: headingFont }}
                >
                    {profile.fullName}
                </motion.h1>
                
                {profile.profession && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                            style={{ 
                                backgroundColor: hexToRgba(colors.accent, 0.1),
                                color: colors.accent
                            }}
                        >
                            <Briefcase className="w-3 h-3" />
                            {profile.profession}
                        </span>
                    </motion.div>
                )}
                
                {profile.tagline && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm max-w-lg mx-auto"
                        style={{ color: colors.textSecondary }}
                    >
                        {profile.tagline}
                    </motion.p>
                )}
                
                {profile.location && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-1 text-sm"
                        style={{ color: colors.textSecondary }}
                    >
                        <MapPin className="w-3 h-3" />
                        <span>{profile.location}</span>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}

// Hero Style: Creative (With decorative elements)
export function HeroCreative({ profile, theme, itemVariants }: HeroSectionProps) {
    const colors = getColors(theme?.colors);
    const headingFont = theme?.fonts?.heading || "Inter";

    return (
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
            <motion.div 
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
            >
                {/* Decorative background elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.15, 0.1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
                        style={{ backgroundColor: colors.accent }}
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.15, 1],
                            opacity: [0.08, 0.12, 0.08]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl"
                        style={{ backgroundColor: colors.primary }}
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Text - Left */}
                    <div className="order-2 sm:order-1 flex-1 text-center sm:text-left space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div 
                                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
                                style={{ 
                                    backgroundColor: hexToRgba(colors.accent, 0.15),
                                    color: colors.accent 
                                }}
                            >
                                {profile.profession || "Welcome"}
                            </div>
                            <h1 
                                className="text-4xl sm:text-5xl font-extrabold"
                                style={{ color: colors.primary, fontFamily: headingFont }}
                            >
                                {profile.fullName}
                            </h1>
                        </motion.div>
                        
                        {profile.tagline && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg"
                                style={{ color: colors.textSecondary }}
                            >
                                {profile.tagline}
                            </motion.p>
                        )}
                        
                        {profile.location && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-sm flex items-center gap-1 justify-center sm:justify-start"
                                style={{ color: colors.textSecondary }}
                            >
                                <MapPin className="w-4 h-4" /> 
                                {profile.location}
                            </motion.p>
                        )}
                    </div>

                    {/* Avatar - Right */}
                    <motion.div
                        order-1 sm:order-2
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Decorative rings */}
                            <div 
                                className="absolute -inset-4 rounded-3xl opacity-30 blur-xl"
                                style={{ backgroundColor: colors.accent }}
                            />
                            <motion.div
                                whileHover={{ scale: 1.02, rotate: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl"
                                style={{ 
                                    backgroundColor: colors.surface,
                                    boxShadow: `0 25px 50px -12px ${hexToRgba(colors.primary, 0.25)}`
                                }}
                            >
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={profile.avatarUrl || ""} className="object-cover" />
                                    <AvatarFallback 
                                        className="text-5xl" 
                                        style={{ 
                                            backgroundColor: colors.primary, 
                                            color: colors.background 
                                        }}
                                    >
                                        {profile.fullName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>
                            
                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-full shadow-lg"
                                style={{ 
                                    backgroundColor: colors.accent,
                                    color: colors.background
                                }}
                            >
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <Heart className="w-3 h-3 fill-current" />
                                    <span>Open to work</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
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
