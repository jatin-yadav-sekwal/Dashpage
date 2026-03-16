import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { useBookmark } from "@/features/bookmarks/hooks";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface BookmarkButtonProps {
  profileId: string;
  initialIsBookmarked?: boolean;
  showLabel?: boolean;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BookmarkButton({
  profileId,
  initialIsBookmarked = false,
  showLabel = false,
  variant = "icon",
  size = "md",
  className = "",
}: BookmarkButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleBookmark, isBookmarked } = useBookmark();
  const [localIsBookmarked, setLocalIsBookmarked] = useState(initialIsBookmarked);

  // Check actual bookmark state when component mounts/updates
  const actualIsBookmarked = isBookmarked(profileId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, redirect to login
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const wasBookmarked = actualIsBookmarked;
    const newState = !wasBookmarked;
    
    // Optimistically update
    setLocalIsBookmarked(newState);

    try {
      await toggleBookmark(profileId, wasBookmarked);
      
      if (newState) {
        toast.success("Profile bookmarked!");
      } else {
        toast.success("Bookmark removed!");
      }
    } catch (error: any) {
      // Revert on error
      setLocalIsBookmarked(wasBookmarked);
      toast.error(error.message || "Failed to update bookmark");
    }
  };

  const isBookmarkedState = actualIsBookmarked || localIsBookmarked;
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        className={`p-2 rounded-full transition-all duration-300 hover:bg-slate-100/50 ${className}`}
        title={isBookmarkedState ? "Remove bookmark" : "Save to bookmarks"}
      >
        {isBookmarkedState ? (
          <BookmarkCheck className={`${sizeClasses[size]} text-amber-500 fill-current`} />
        ) : (
          <BookmarkIcon className={`${sizeClasses[size]} text-slate-600`} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isBookmarkedState
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      } ${className}`}
    >
      {isBookmarkedState ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <BookmarkIcon className="w-5 h-5" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isBookmarkedState ? "Bookmarked" : "Bookmark"}
        </span>
      )}
    </button>
  );
}

// Button variant specifically for profile page
export function ProfileBookmarkButton({
  profileId,
  initialIsBookmarked,
  themeColors,
}: {
  profileId: string;
  initialIsBookmarked?: boolean;
  themeColors?: { primary: string; background: string };
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleBookmark, isBookmarked } = useBookmark();
  const [localIsBookmarked, setLocalIsBookmarked] = useState(initialIsBookmarked ?? false);

  // Check actual bookmark state
  const actualIsBookmarked = isBookmarked(profileId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, redirect to login
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const wasBookmarked = actualIsBookmarked;
    const newState = !wasBookmarked;
    
    // Optimistically update
    setLocalIsBookmarked(newState);

    try {
      await toggleBookmark(profileId, wasBookmarked);
      
      if (newState) {
        toast.success("Profile bookmarked!");
      } else {
        toast.success("Bookmark removed!");
      }
    } catch (error: any) {
      setLocalIsBookmarked(wasBookmarked);
      toast.error(error.message || "Failed to update bookmark");
    }
  };

  const textColor = themeColors?.primary || "#0f172a";
  const isBookmarkedState = actualIsBookmarked || localIsBookmarked;

  return (
    <motion.button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-300 ${
        isBookmarkedState ? "bg-amber-100" : "hover:bg-slate-100/50"
      }`}
      style={{ color: isBookmarkedState ? "#d97706" : textColor }}
      title={isBookmarkedState ? "Remove bookmark" : "Save to bookmarks"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isBookmarkedState ? (
        <BookmarkCheck className="w-5 h-5 fill-current" />
      ) : (
        <BookmarkIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
}
