import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, initialized, session } = useAuth();

    // Critical: Wait for auth to be fully initialized before making any decisions
    // This prevents the race condition where we redirect before session is loaded
    if (!initialized || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    // No session - redirect to login
    if (!user || !session) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated
    return <>{children}</>;
}
