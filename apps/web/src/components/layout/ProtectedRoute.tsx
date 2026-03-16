import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useProfile";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireProfile?: boolean;
}

export function ProtectedRoute({ children, requireProfile = true }: ProtectedRouteProps) {
    const { user, loading, session } = useAuth();
    
    // Only fetch profile if user is authenticated
    const { data: profileData, isLoading: profileLoading, isError } = useMyProfile({
        enabled: !!user, // Only enable the query if user exists
    });

    // Debug logging
    console.log("ProtectedRoute - loading:", loading, "user:", user, "session:", session);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!user) {
        console.log("ProtectedRoute - No user, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // Show loading while profile is being fetched
    if (profileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    // If there's an error fetching profile, still allow access if user is authenticated
    // The profile check might fail due to network issues, but the user is authenticated
    if (isError) {
        // Allow access but show a warning or just proceed
        console.log("Profile fetch failed, but user is authenticated");
    }

    if (requireProfile && profileData?.hasProfile === false) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
