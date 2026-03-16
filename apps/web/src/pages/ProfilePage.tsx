import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useProfileByUsername } from "@/features/profile/hooks/useProfile";
import { motion, Variants } from "framer-motion";
import { PublicProfile } from "@shared/types";
import { useBookmark } from "@/features/bookmarks/hooks";
import { useAuth } from "@/hooks/useAuth";
import { ProfileNavbar } from "@/components/profile/ProfileNavbar";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { heroComponents, experienceSections, educationSections, projectSections, ContactSection } from "@/components/profile/sections";

const SectionSkeleton = () => (
    <div className="animate-pulse space-y-4 p-6 max-w-4xl mx-auto">
        <div className="h-10 bg-muted rounded w-1/3"></div>
        <div className="h-40 bg-muted rounded-xl"></div>
        <div className="h-40 bg-muted rounded-xl"></div>
    </div>
);

const ProfilePageSkeleton = () => (
    <div className="min-h-screen">
        {/* Navbar skeleton */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-50 flex items-center px-4 justify-between">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
        </div>
        
        {/* Hero skeleton */}
        <div className="pt-24 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="w-32 h-32 bg-muted rounded-full animate-pulse"></div>
                    <div className="space-y-3 text-center sm:text-left">
                        <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto sm:mx-0"></div>
                        <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto sm:mx-0"></div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Content skeleton */}
        <div className="py-8 space-y-8">
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
        </div>
    </div>
);

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { data: profileResponse, isLoading, error } = useProfileByUsername(username!);
    const { user } = useAuth();
    const { isBookmarked } = useBookmark(!!user);

    const headingFont = useMemo(() => {
        if (!profileResponse?.data?.theme?.fonts?.heading) return "Inter";
        return profileResponse.data.theme.fonts.heading;
    }, [profileResponse?.data?.theme?.fonts?.heading]);

    const bodyFont = useMemo(() => {
        if (!profileResponse?.data?.theme?.fonts?.body) return "Inter";
        return profileResponse.data.theme.fonts.body;
    }, [profileResponse?.data?.theme?.fonts?.body]);

    const headingStyle = useMemo(() => ({
        fontFamily: headingFont,
    }), [headingFont]);

    const itemVariants: Variants = useMemo(() => ({
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }), []);

    const heroStyle = profileResponse?.data?.theme?.heroStyle || "split";
    const experienceStyle = profileResponse?.data?.theme?.experienceStyle || "timeline";
    const educationStyle = profileResponse?.data?.theme?.educationStyle || "timeline";
    const projectsStyle = profileResponse?.data?.theme?.projectsStyle || "grid";

    const HeroComponent = useMemo(() => heroComponents[heroStyle as keyof typeof heroComponents] || heroComponents.split, [heroStyle]);
    const ExperienceComponent = useMemo(() => experienceSections[experienceStyle as keyof typeof experienceSections] || experienceSections.timeline, [experienceStyle]);
    const EducationComponent = useMemo(() => educationSections[educationStyle as keyof typeof educationSections] || educationSections.timeline, [educationStyle]);
    const ProjectsComponent = useMemo(() => projectSections[projectsStyle as keyof typeof projectSections] || projectSections.grid, [projectsStyle]);

    if (isLoading) {
        return <ProfilePageSkeleton />;
    }

    const errorMessage = error instanceof Error ? error.message : "";
    const isNotPublished = errorMessage.includes("not published");

    if (error || !profileResponse?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-3xl font-bold">Profile Not Found</h1>
                <p className="text-muted-foreground">
                    {isNotPublished 
                        ? "This user hasn't published their profile yet." 
                        : `The user @${username} doesn't exist.`}
                </p>
            </div>
        );
    }

    const profile: PublicProfile = profileResponse.data;
    const theme = profile.theme;
    
    const bookmarked = user ? isBookmarked(profile.id) : false;

    const themeStyles = theme?.colors ? {
        "--bg-color": theme.colors.background,
        "--surface-color": theme.colors.surface,
        "--primary-color": theme.colors.primary,
        "--text-color": theme.colors.text,
        "--text-secondary": theme.colors.textSecondary,
        "--accent-color": theme.colors.accent,
        "--heading-font": headingFont,
        "--body-font": bodyFont,
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        fontFamily: bodyFont,
    } as React.CSSProperties : {};

    return (
        <div className="min-h-screen" style={themeStyles}>
            <ProfileNavbar 
                username={profile.username}
                fullName={profile.fullName}
                avatarUrl={profile.avatarUrl}
                themeColors={theme?.colors}
                profileId={profile.id}
                initialIsBookmarked={bookmarked}
            />
            
            <main className="pt-24">
                <HeroComponent profile={profile} theme={theme} itemVariants={itemVariants} />

                {profile.bio && (
                    <motion.section 
                        variants={itemVariants}
                        className="max-w-3xl mx-auto px-6 pb-8"
                    >
                        <p className="text-lg leading-relaxed text-center" style={headingStyle}>
                            {profile.bio}
                        </p>
                    </motion.section>
                )}

                <ExperienceComponent profile={profile} theme={theme} itemVariants={itemVariants} />
                <EducationComponent profile={profile} theme={theme} itemVariants={itemVariants} />
                <ProjectsComponent profile={profile} theme={theme} itemVariants={itemVariants} />
                <ContactSection profile={profile} theme={theme} itemVariants={itemVariants} />
            </main>

            <ProfileFooter 
                username={profile.username}
                fullName={profile.fullName}
                themeColors={theme?.colors}
            />
        </div>
    );
}
