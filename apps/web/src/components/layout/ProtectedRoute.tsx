import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Full-page skeleton that mimics the dashboard layout.
 * Shown while auth state is being verified.
 */
function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar skeleton */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Hero area skeleton */}
            <div className="pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-muted rounded-full animate-pulse" />
                        <div className="space-y-3 flex-1">
                            <div className="h-7 w-48 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs skeleton */}
            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="space-y-4">
                        <div className="h-10 bg-muted rounded animate-pulse" />
                        <div className="h-10 bg-muted rounded animate-pulse" />
                        <div className="h-20 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, initialized, session } = useAuth();
    const location = useLocation();

    // Show skeleton while auth is still initializing
    if (!initialized || loading) {
        return <DashboardSkeleton />;
    }

    // No session after full initialization — redirect to login, preserving intended destination
    if (!user || !session) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // User is authenticated
    return <>{children}</>;
}
