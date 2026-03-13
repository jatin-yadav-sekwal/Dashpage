import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfileByUsername } from "@/features/profile/hooks/useProfile";
import { Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { PublicProfile } from "@shared/types";
import { useBookmark } from "@/features/bookmarks/hooks";
import { ProfileNavbar } from "@/components/profile/ProfileNavbar";
import { ProfileFooter } from "@/components/profile/ProfileFooter";
import { heroComponents, experienceSections, educationSections, projectSections, ContactSection } from "@/components/profile/sections";

const FONTS_TO_LOAD = [
    "Inter",
    "Outfit", 
    "Poppins",
    "Playfair Display",
    "Lato",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Raleway",
    "Nunito",
    "Poppins",
    "Ubuntu",
    "Merriweather",
    "Source Sans Pro",
    "PT Sans",
    "Oswald",
    "Rubic",
    "Quicksand",
    "Work Sans",
    "Manrope",
];

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { data: profileResponse, isLoading, error } = useProfileByUsername(username!);
    const { isBookmarked } = useBookmark();

    useEffect(() => {
        // Load fonts dynamically from Google Fonts
        const fonts = FONTS_TO_LOAD.map(font => font.replace(/ /g, "+"));
        const fontUrl = `https://fonts.googleapis.com/css2?family=${fonts.join("&family=")}:wght@400;500;600;700;800&display=swap`;
        
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
        
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !profileResponse?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h1 className="text-3xl font-bold">Profile Not Found</h1>
                <p className="text-muted-foreground">The user @{username} doesn't exist or isn't published.</p>
            </div>
        );
    }

    const profile: PublicProfile = profileResponse.data;
    const theme = profile.theme;
    
    // Check if the profile is bookmarked by the current user
    const initialIsBookmarked = isBookmarked(profile.id);

    // Get fonts from theme
    const headingFont = theme?.fonts?.heading || "Inter";
    const bodyFont = theme?.fonts?.body || "Inter";

    // Apply dynamic theming with fonts
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

    // Apply heading font style
    const headingStyle = {
        fontFamily: headingFont,
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    // Get theme-specific section components
    const heroStyle = theme?.heroStyle || "split";
    const experienceStyle = theme?.experienceStyle || "timeline";
    const educationStyle = theme?.educationStyle || "timeline";
    const projectsStyle = theme?.projectsStyle || "grid";

    // Select components based on theme config
    const HeroComponent = heroComponents[heroStyle as keyof typeof heroComponents] || heroComponents.split;
    const ExperienceComponent = experienceSections[experienceStyle as keyof typeof experienceSections] || experienceSections.timeline;
    const EducationComponent = educationSections[educationStyle as keyof typeof educationSections] || educationSections.timeline;
    const ProjectsComponent = projectSections[projectsStyle as keyof typeof projectSections] || projectSections.grid;

    return (
        <div className="min-h-screen" style={themeStyles}>
            {/* Navbar */}
            <ProfileNavbar 
                username={profile.username}
                fullName={profile.fullName}
                avatarUrl={profile.avatarUrl}
                themeColors={theme?.colors}
                profileId={profile.id}
                initialIsBookmarked={initialIsBookmarked}
            />
            
            <main className="pt-24">
                {/* Dynamic Hero Section */}
                <HeroComponent profile={profile} theme={theme} itemVariants={itemVariants} />

                {/* Bio Section */}
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

                {/* Dynamic Sections */}
                <ExperienceComponent profile={profile} theme={theme} itemVariants={itemVariants} />
                <EducationComponent profile={profile} theme={theme} itemVariants={itemVariants} />
                <ProjectsComponent profile={profile} theme={theme} itemVariants={itemVariants} />
                <ContactSection profile={profile} theme={theme} itemVariants={itemVariants} />
            </main>

            {/* Footer */}
            <ProfileFooter 
                username={profile.username}
                fullName={profile.fullName}
                themeColors={theme?.colors}
            />
        </div>
    );
}
