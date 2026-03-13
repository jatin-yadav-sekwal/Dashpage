import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMyBookmarks, useRemoveBookmark } from "@/features/bookmarks/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
    Loader2, 
    Bookmark as BookmarkIcon, 
    Search, 
    X,
    Calendar,
    ChevronRight,
    XCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/landing/Navbar";
import { toast } from "sonner";

export default function Bookmarks() {
    const { data: response, isLoading } = useMyBookmarks();
    const { user } = useAuth();
    const removeBookmark = useRemoveBookmark();
    const [searchQuery, setSearchQuery] = useState("");
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    const bookmarks = response?.data || [];
    
    // Get all unique tags from bookmarked profiles
    const allTags = Array.from(
        new Set(bookmarks.flatMap(b => b.profile?.tags || []))
    );

    // Filter bookmarks by search query and tag filter
    const filteredBookmarks = bookmarks.filter(bookmark => {
        const matchesSearch = searchQuery === "" || 
            bookmark.profile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.profile?.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = !tagFilter || (bookmark.profile?.tags || []).includes(tagFilter);
        
        return matchesSearch && matchesTag;
    });

    // Handle delete bookmark
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
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

            <div className={`max-w-7xl mx-auto px-4 py-8 ${user ? "pt-24" : ""}`}>
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white mb-4"
                    >
                        <BookmarkIcon className="w-8 h-8" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-slate-900 mb-2"
                    >
                        Bookmarks
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-slate-600 max-w-md mx-auto"
                    >
                        Profiles you've saved for inspiration and reference
                    </motion.p>
                </motion.div>

                {/* Search and Tag Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl mx-auto mb-10"
                >
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search bookmarks by name, username, or tagline..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-slate-400 focus:ring-0"
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
                                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                    }`}
                                >
                                    #{tag}
                                </motion.button>
                            ))}
                            {tagFilter && (
                                <button
                                    onClick={() => setTagFilter(null)}
                                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Bookmarks List */}
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex h-64 items-center justify-center"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </motion.div>
                ) : filteredBookmarks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <Card className="border-dashed bg-white/60">
                            <CardContent className="flex flex-col items-center justify-center h-64 gap-4">
                                <div className="p-4 bg-amber-100 rounded-full">
                                    <BookmarkIcon className="w-8 h-8 text-amber-600" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="font-semibold text-lg text-slate-900">
                                        {bookmarks.length === 0 ? "No bookmarks yet" : "No matching bookmarks"}
                                    </h3>
                                    <p className="text-slate-600 max-w-sm">
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
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {filteredBookmarks.map((bookmark, idx) => (
                            <motion.div
                                key={bookmark.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link to={`/${bookmark.profile?.username}`} className="block group">
                                    <Card className="overflow-hidden transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:-translate-y-1 border border-slate-200/50">
                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative">
                                                    <Avatar className="w-14 h-14 ring-2 ring-slate-100">
                                                        <AvatarImage src={bookmark.profile?.avatarUrl || ""} />
                                                        <AvatarFallback className="bg-slate-900 text-white">
                                                            {bookmark.profile?.fullName?.charAt(0) || bookmark.profile?.username?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                                        <BookmarkIcon className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 truncate group-hover:text-slate-700">
                                                        {bookmark.profile?.fullName || `@${bookmark.profile?.username}`}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 truncate">
                                                        @{bookmark.profile?.username}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {bookmark.profile?.tagline && (
                                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                    {bookmark.profile.tagline}
                                                </p>
                                            )}
                                            
                                            {/* Tags */}
                                            {bookmark.profile?.tags && bookmark.profile.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {bookmark.profile.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {bookmark.profile.tags.length > 3 && (
                                                        <span className="px-2 py-0.5 text-slate-400 text-xs">
                                                            +{bookmark.profile.tags.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>Saved {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* Delete button */}
                                                    <button
                                                        onClick={(e) => handleDeleteBookmark(e, bookmark.profileId, bookmark.profile?.fullName || bookmark.profile?.username || "")}
                                                        className="p-1.5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Remove from bookmarks"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
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
        </div>
    );
}
