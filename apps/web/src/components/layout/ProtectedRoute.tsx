import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireProfile?: boolean;
}

export function ProtectedRoute({ children, requireProfile: _requireProfile = true }: ProtectedRouteProps) {
    const { user, loading: authLoading, session, initialized } = useAuth();
    
    console.log("ProtectedRoute - initialized:", initialized, "authLoading:", authLoading, "user:", !!user, "session:", !!session);

    // Show loading spinner while auth is initializing
    // This prevents premature redirects when session is still being loaded from storage
    if (!initialized || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    // No session - redirect to login
    if (!user || !session) {
        console.log("ProtectedRoute - No user/session, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, let the child component handle profile loading
    return <>{children}</>;
}
