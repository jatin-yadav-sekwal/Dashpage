import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMyBookmarks, useRemoveBookmark } from "@/features/bookmarks/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
    Bookmark as BookmarkIcon, 
    Search, 
    X,
    Calendar,
    ChevronRight,
    XCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/landing/Navbar";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { toast } from "sonner";
import { DotDistortionShader } from "@/components/ui/dot-distortion-shader";

export default function Bookmarks() {
    const { data: response, isLoading } = useMyBookmarks();
    const { user } = useAuth();
    const removeBookmark = useRemoveBookmark();
    const [searchQuery, setSearchQuery] = useState("");
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    const bookmarks = response?.data || [];
    
    const allTags = Array.from(
        new Set(bookmarks.flatMap(b => b.profile?.tags || []))
    );

    const filteredBookmarks = bookmarks.filter(bookmark => {
        const matchesSearch = searchQuery === "" || 
            bookmark.profile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.profile?.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = !tagFilter || (bookmark.profile?.tags || []).includes(tagFilter);
        
        return matchesSearch && matchesTag;
    });

    const handleDeleteBookmark = async (e: React.MouseEvent, profileId: string, profileName: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            await removeBookmark.mutateAsync(profileId);
            toast.success(`Removed "${profileName}" from bookmarks`);
        } catch (error: any) {
            toast.error(error.message || "Failed to remove bookmark");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar for logged-in users */}
            <AnimatePresence>
                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Navbar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero-like Header */}
            <div className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 z-0 opacity-30">
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

                {/* <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white mb-6 shadow-lg shadow-amber-500/25"
                        >
                            <BookmarkIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                        </motion.div>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4"
                        >
                            Your Bookmarks
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto"
                        >
                            Profiles you've saved for inspiration and reference
                        </motion.p>
                    </motion.div>
                </div> */}
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
                {/* Search and Tag Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-2xl mx-auto mb-10 sm:mb-12"
                >
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search bookmarks by name, username, or tagline..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-12 h-12 sm:h-14 rounded-2xl bg-slate-50 border-0 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 text-base"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Tag Filter Pills */}
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            {allTags.map((tag) => (
                                <motion.button
                                    key={tag}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        tagFilter === tag
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    #{tag}
                                </motion.button>
                            ))}
                            {tagFilter && (
                                <button
                                    onClick={() => setTagFilter(null)}
                                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Bookmarks List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="h-4 w-full bg-muted rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-4"></div>
                                <div className="flex gap-2 mb-4">
                                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                    <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredBookmarks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <Card className="border-dashed bg-white/60 shadow-sm">
                            <CardContent className="flex flex-col items-center justify-center py-16 px-8 gap-4">
                                <div className="p-5 bg-amber-50 rounded-2xl">
                                    <BookmarkIcon className="w-10 h-10 text-amber-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="font-bold text-xl text-slate-900">
                                        {bookmarks.length === 0 ? "No bookmarks yet" : "No matching bookmarks"}
                                    </h3>
                                    <p className="text-slate-500 max-w-sm">
                                        {bookmarks.length === 0 
                                            ? "When you find a profile you like, click the bookmark icon to save it here."
                                            : "Try adjusting your search or filters."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    >
                        {filteredBookmarks.map((bookmark, idx) => (
                            <motion.div
                                key={bookmark.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link to={`/${bookmark.profile?.username}`} className="block group">
                                    <Card className="overflow-hidden transition-all duration-300 bg-white hover:bg-slate-50 hover:shadow-xl hover:-translate-y-1 border border-slate-200/50 rounded-2xl">
                                        <CardContent className="p-5 sm:p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative">
                                                    <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-slate-100">
                                                        <AvatarImage src={bookmark.profile?.avatarUrl || ""} />
                                                        <AvatarFallback className="bg-slate-900 text-white text-lg">
                                                            {bookmark.profile?.fullName?.charAt(0) || bookmark.profile?.username?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                                                        <BookmarkIcon className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 truncate group-hover:text-slate-700 text-lg">
                                                        {bookmark.profile?.fullName || `@${bookmark.profile?.username}`}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 truncate">
                                                        @{bookmark.profile?.username}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {bookmark.profile?.tagline && (
                                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                                    {bookmark.profile.tagline}
                                                </p>
                                            )}
                                            
                                            {/* Tags */}
                                            {bookmark.profile?.tags && bookmark.profile.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {bookmark.profile.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {bookmark.profile.tags.length > 3 && (
                                                        <span className="px-2.5 py-1 text-slate-400 text-xs">
                                                            +{bookmark.profile.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => handleDeleteBookmark(e, bookmark.profileId, bookmark.profile?.fullName || bookmark.profile?.username || "")}
                                                        className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Remove from bookmarks"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <SiteFooter />
        </div>
    );
}
