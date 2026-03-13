import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useProfile";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireProfile?: boolean;
}

export function ProtectedRoute({ children, requireProfile = true }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const { data: profileData, isLoading: profileLoading } = useMyProfile();

    if (loading || profileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireProfile && profileData?.hasProfile === false) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
