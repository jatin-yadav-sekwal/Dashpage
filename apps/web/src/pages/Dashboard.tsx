import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/landing/Navbar";
import { SiteFooter } from "@/components/landing/SiteFooter";
import {
    ProfileForm,
    SocialLinksForm,
    AvatarUpload,
    UsernameSetup,
    PublishToggle,
    ThemeSelector,
} from "@/features/profile";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import { usePrefetchDashboardData } from "@/features/profile/hooks/usePrefetchDashboard";
import { DotDistortionShader } from "../components/ui/dot-distortion-shader";

const ExperienceEditor = lazy(() => import("@/features/profile/components/ExperienceEditor").then(m => ({ default: m.ExperienceEditor })));
const EducationEditor = lazy(() => import("@/features/profile/components/EducationEditor").then(m => ({ default: m.EducationEditor })));
const ProjectEditor = lazy(() => import("@/features/profile/components/ProjectEditor").then(m => ({ default: m.ProjectEditor })));
const TagEditor = lazy(() => import("@/features/profile/components/TagEditor").then(m => ({ default: m.TagEditor })));

const EditorSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-muted rounded-xl"></div>
        <div className="h-20 bg-muted rounded-xl"></div>
        <div className="h-20 bg-muted rounded-xl"></div>
    </div>
);
import {
    ExternalLink,
    User,
    MessageSquare,
    Briefcase,
    GraduationCap,
    FolderKanban,
    Tag,
    Palette,
    Sparkles,
    Eye,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TABS = [
    { id: "basic", label: "Basic Info", description: "Name, bio, avatar", icon: User, color: "bg-blue-500" },
    { id: "social", label: "Social Links", description: "Social media & links", icon: MessageSquare, color: "bg-purple-500" },
    { id: "experience", label: "Experience", description: "Work history", icon: Briefcase, color: "bg-green-500" },
    { id: "education", label: "Education", description: "Degrees & courses", icon: GraduationCap, color: "bg-yellow-500" },
    { id: "projects", label: "Projects", description: "Showcase your work", icon: FolderKanban, color: "bg-pink-500" },
    { id: "tags", label: "Tags", description: "Skills & interests", icon: Tag, color: "bg-orange-500" },
    { id: "theme", label: "Theme", description: "Design & colors", icon: Palette, color: "bg-cyan-500" },
];

export default function Dashboard() {
    const { user } = useAuth();
    const { data: profileData, isLoading } = useMyProfile();
    const [activeTab, setActiveTab] = useState("basic");
    const { prefetchAll } = usePrefetchDashboardData();

    useEffect(() => {
        if (profileData?.hasProfile) {
            prefetchAll();
        }
    }, [profileData?.hasProfile, prefetchAll]);

    // Add loading animation
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                {/* Navbar skeleton */}
                <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b z-50">
                    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                        <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Hero skeleton */}
                <div className="pt-24 pb-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-24 h-24 bg-muted rounded-full animate-pulse"></div>
                            <div className="space-y-3 flex-1">
                                <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs skeleton */}
                <div className="max-w-7xl mx-auto px-4 pb-8">
                    <div className="mb-6">
                        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                        <div className="space-y-4">
                            <div className="h-10 bg-muted rounded animate-pulse"></div>
                            <div className="h-10 bg-muted rounded animate-pulse"></div>
                            <div className="h-10 bg-muted rounded animate-pulse"></div>
                            <div className="h-20 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If user has no profile yet, show profile creation form
    if (!profileData?.hasProfile) {
        return (
            <div className="min-h-screen bg-white">
                {/* Navbar */}
                <Navbar />
                
                {/* Background Effect */}
                <div className="fixed inset-0 z-0 opacity-50 pointer-events-none">
                    <DotDistortionShader 
                        // dotSize={1}
                        // dotGap={18}
                        // mouseInfluenceRadius={50}
                        // distortionStrength={2.5}
                        // returnSpeed={0.09}
                        // friction={0.85}
                        // color="#074fecff"
                    />
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto relative z-10"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white mb-6 shadow-xl shadow-slate-900/20"
                        >
                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3"
                        >
                            Welcome to DashPage!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-base sm:text-lg text-slate-600"
                        >
                            Create your profile to get started on your digital presence
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <ProfileForm />
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    const profile = profileData?.data;

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section - Below Navbar, Above Tabs */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 sm:pt-24">
                {/* Background Effect */}
                <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                    <DotDistortionShader 
                        dotSize={2}
                        dotGap={20}
                        mouseInfluenceRadius={80}
                        distortionStrength={3}
                        returnSpeed={0.05}
                        friction={0.85}
                        color="#2563eb"
                    />
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
                        {/* Avatar and Name */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"
                        >
                            <AvatarUpload />
                            <div className="text-center sm:text-left space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                                        {profile?.fullName || "Set up your profile"}
                                    </h1>
                                    {profile?.isPublished && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                                        >
                                            <CheckCircle className="w-3 h-3" />
                                            Live
                                        </motion.div>
                                    )}
                                </div>
                                <p className="text-sm sm:text-base text-slate-500">{user?.email}</p>

                                {profile?.isPublished && profile.username && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="inline-block"
                                    >
                                        <Button variant="link" className="px-0 h-auto text-slate-600 hover:text-slate-900 text-sm" asChild>
                                            <a
                                                href={`/${profile.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 group"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View live profile
                                                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                            </a>
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:gap-4 w-full lg:w-auto"
                        >
                            <PublishToggle />
                            <UsernameSetup />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6"
            >
                <Tabs
                    defaultValue="basic"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    {/* Section Title */}
                    <div className="mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Edit Your Profile</h2>
                        <p className="text-sm text-slate-500">Click on any section below to edit your information</p>
                    </div>

                    {/* Enhanced Tab Navigation - Card Style */}
                    <div className="mb-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-200
                                            ${isActive 
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/25' 
                                                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className={`p-2 rounded-lg mb-2 ${isActive ? 'bg-white/20' : tab.color}`}>
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white'}`} />
                                        </div>
                                        <span className={`text-xs sm:text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                            {tab.label}
                                        </span>
                                        <span className={`text-[10px] sm:text-xs mt-0.5 hidden sm:block ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                                            {tab.description}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content with Animations */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 sm:p-6 md:p-8"
                            >
                                <TabsContent value="basic" className="m-0">
                                    <ProfileForm />
                                </TabsContent>
                                <TabsContent value="social" className="m-0">
                                    <SocialLinksForm />
                                </TabsContent>
                                <Suspense fallback={<EditorSkeleton />}>
                                    <TabsContent value="experience" className="m-0">
                                        <ExperienceEditor />
                                    </TabsContent>
                                    <TabsContent value="education" className="m-0">
                                        <EducationEditor />
                                    </TabsContent>
                                    <TabsContent value="projects" className="m-0">
                                        <ProjectEditor />
                                    </TabsContent>
                                    <TabsContent value="tags" className="m-0">
                                        <TagEditor />
                                    </TabsContent>
                                </Suspense>
                                <TabsContent value="theme" className="m-0">
                                    <ThemeSelector />
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </motion.div>

            {/* Footer */}
            <SiteFooter />
        </div>
    );
}

// Simple dot background component for the onboarding page
// function DotDistortionShader({ 
//     dotSize = 2,
//     dotGap = 18,
//     // mouseInfluenceRadius = 60,
//     // distortionStrength = 2,
//     // returnSpeed = 0.05,
//     // friction = 0.85,
//     color = "#2563eb"
// }: {
//     dotSize?: number;
//     dotGap?: number;
//     mouseInfluenceRadius?: number;
//     distortionStrength?: number;
//     returnSpeed?: number;
//     friction?: number;
//     color?: string;
// }) {
//     return (
//         <div 
//             className="w-full h-full"
//             style={{
//                 backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
//                 backgroundSize: `${dotSize + dotGap}px ${dotSize + dotGap}px`,
//             }}
//         />
//     );
// }
