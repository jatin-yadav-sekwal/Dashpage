import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
    ProfileForm,
    SocialLinksForm,
    ExperienceEditor,
    EducationEditor,
    ProjectEditor,
    TagEditor,
    AvatarUpload,
    UsernameSetup,
    PublishToggle,
    ThemeSelector,
} from "@/features/profile";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
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
    CheckCircle,
    Bookmark,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TABS = [
    { id: "basic", label: "Basic Info", icon: User, color: "text-blue-500" },
    { id: "social", label: "Social Links", icon: MessageSquare, color: "text-purple-500" },
    { id: "experience", label: "Experience", icon: Briefcase, color: "text-green-500" },
    { id: "education", label: "Education", icon: GraduationCap, color: "text-yellow-500" },
    { id: "projects", label: "Projects", icon: FolderKanban, color: "text-pink-500" },
    { id: "tags", label: "Tags", icon: Tag, color: "text-orange-500" },
    { id: "theme", label: "Theme", icon: Palette, color: "text-cyan-500" },
];

export default function Dashboard() {
    const { user } = useAuth();
    const { data: profileData, isLoading } = useMyProfile();
    const [activeTab, setActiveTab] = useState("basic");
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    // Add loading animation
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-slate-900 border-t-transparent"
                    />
                    <p className="text-slate-600 font-medium">Loading dashboard...</p>
                </motion.div>
            </div>
        );
    }

    // If user has no profile yet, show profile creation form
    if (!profileData?.hasProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 text-white mb-6"
                        >
                            <Sparkles className="w-10 h-10" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-slate-900 mb-3"
                        >
                            Welcome to DashPage!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-slate-600"
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
            {/* Hero Header Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 py-12 md:py-16"
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
                    >
                        <AvatarUpload />
                        <div className="text-center sm:text-left space-y-3">
                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                                    {profile?.fullName || "Set up your profile"}
                                </h1>
                                {profile?.isPublished && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                                    >
                                        <CheckCircle className="w-3 h-3" />
                                        Live
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-slate-500">{user?.email}</p>

                            {profile?.isPublished && profile.username && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="inline-block"
                                >
                                    <Button variant="link" className="px-0 h-auto text-slate-600 hover:text-slate-900" asChild>
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

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4 w-full lg:w-auto"
                    >
                        <PublishToggle />
                        <UsernameSetup />
                    </motion.div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="inline-block"
                >
                    <Link
                        to="/bookmarks"
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                            <Bookmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Bookmarks</p>
                            <p className="text-sm text-slate-500">View saved profiles</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 ml-2" />
                    </Link>
                </motion.div>
            </motion.section>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-7xl mx-auto px-4 pb-16"
            >
                <Tabs
                    defaultValue="basic"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    {/* Enhanced Tab Navigation */}
                    <div className="mb-8">
                        <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                            <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-full p-1.5 gap-1 shadow-sm">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    const isHovered = hoveredTab === tab.id;

                                    return (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            onMouseEnter={() => setHoveredTab(tab.id)}
                                            onMouseLeave={() => setHoveredTab(null)}
                                            className={`
                                                relative px-4 py-2.5 rounded-full text-sm font-medium
                                                transition-all duration-200 ease-out
                                                ${isActive
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : `text-slate-600 hover:text-slate-900 ${isHovered ? 'bg-slate-100' : 'bg-transparent'}`
                                                }
                                            `}
                                        >
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="activeTabIndicator"
                                                        className="absolute inset-0 rounded-full bg-slate-900"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    />
                                                )}
                                            </AnimatePresence>
                                            <span className="relative z-10 flex items-center gap-2">
                                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                            </span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                    </div>

                    {/* Tab Content with Animations */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 md:p-8"
                            >
                                <TabsContent value="basic" className="m-0">
                                    <ProfileForm />
                                </TabsContent>
                                <TabsContent value="social" className="m-0">
                                    <SocialLinksForm />
                                </TabsContent>
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
                                <TabsContent value="theme" className="m-0">
                                    <ThemeSelector />
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Tabs>
            </motion.div>
        </div>
    );
}
