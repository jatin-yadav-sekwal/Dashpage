import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark as BookmarkIcon, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBookmark } from "@/features/bookmarks/hooks";
import { toast } from "sonner";

interface ProfileNavbarProps {
    username: string;
    fullName: string;
    avatarUrl?: string | null;
    themeColors?: {
        primary: string;
        background: string;
    };
    profileId?: string;
    initialIsBookmarked?: boolean;
}

export function ProfileNavbar({ username, fullName, avatarUrl, themeColors, profileId, initialIsBookmarked = false }: ProfileNavbarProps) {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toggleBookmark, isBookmarked } = useBookmark();

    // Use local state for bookmark status
    const [localIsBookmarked, setLocalIsBookmarked] = useState(initialIsBookmarked);

    // Update local state when profileId changes
    useEffect(() => {
        if (profileId) {
            setLocalIsBookmarked(isBookmarked(profileId));
        }
    }, [profileId, isBookmarked]);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    const scrollToSection = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const navItems = [
        { name: "Experience", id: "experience" },
        { name: "Education", id: "education" },
        { name: "Projects", id: "projects" },
        { name: "Contact", id: "contact" },
    ];

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (!user) {
            navigate("/login", { state: { from: `/${username}` } });
            return;
        }

        if (!profileId) return;

        const wasBookmarked = localIsBookmarked;
        
        // Optimistically update local state
        const newState = !wasBookmarked;
        setLocalIsBookmarked(newState);
        
        try {
            const result = await toggleBookmark(profileId, wasBookmarked);
            if (result.data.action === "added") {
                toast.success("Profile bookmarked!");
            } else {
                toast.success("Bookmark removed!");
            }
        } catch (error: any) {
            // Revert on error
            setLocalIsBookmarked(wasBookmarked);
            console.error("Bookmark error:", error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Failed to update bookmark");
            }
        }
    };

    const textColor = themeColors?.primary || "#0f172a";
    const bgColor = themeColors?.background || "#ffffff";

    const navBgColor = isScrolled 
        ? bgColor
        : "transparent";

    return (
        <>
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full flex items-center justify-between transition-all duration-300"
                style={{ 
                    backgroundColor: navBgColor,
                    boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
                    border: isScrolled ? `1px solid ${themeColors?.primary}30` : 'none',
                    backdropFilter: 'none'
                }}
            >
                <Link 
                    to={`/${username}`} 
                    className="flex items-center gap-1.5 sm:gap-2 md:gap-3"
                    style={{ color: textColor }}
                >
                    <Avatar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0">
                        <AvatarImage src={avatarUrl || ""} />
                        <AvatarFallback className="text-xs sm:text-sm font-bold" style={{ backgroundColor: textColor, color: bgColor }}>
                            {fullName?.charAt(0) || username?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm md:text-lg font-bold tracking-tight sm:block truncate max-w-[300px] md:max-w-[300px]">
                        {fullName || `@${username}`}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={scrollToSection(item.id)}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:opacity-70"
                            style={{ color: textColor }}
                        >
                            {item.name}
                        </a>
                    ))}
                    
                    {/* Bookmark Button */}
                    <button
                        onClick={handleBookmark}
                        className={`ml-2 p-2 rounded-full transition-all duration-300 ${
                            localIsBookmarked 
                                ? 'bg-amber-100' 
                                : 'hover:bg-slate-100/50'
                        }`}
                        style={{ color: localIsBookmarked ? '#d97706' : textColor }}
                        title={localIsBookmarked ? "Remove bookmark" : "Save to bookmarks"}
                    >
                        {localIsBookmarked ? (
                            <BookmarkIcon className="w-5 h-5 text-amber-500 fill-current" />
                        ) : (
                            <BookmarkIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="flex items-center gap-1">
                    {/* Bookmark button for mobile */}
                    <button
                        onClick={handleBookmark}
                        className="md:hidden p-1.5 sm:p-2 rounded-full transition-all duration-300"
                        style={{ color: localIsBookmarked ? '#d97706' : textColor }}
                        title={localIsBookmarked ? "Remove bookmark" : "Save to bookmarks"}
                    >
                        {localIsBookmarked ? (
                            <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-current" />
                        ) : (
                            <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                    
                    <button 
                        className="md:hidden p-1.5 sm:p-2 rounded-full transition-colors"
                        style={{ color: textColor }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5 opacity-0" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={scrollToSection(item.id)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-2xl font-bold"
                                    style={{ color: textColor }}
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                            {/* Close button in mobile menu - only one X here */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-6 right-6 p-2"
                                style={{ color: textColor }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
