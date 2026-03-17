import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Landing = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const Themes = lazy(() => import("@/pages/Themes"));
const Bookmarks = lazy(() => import("@/pages/Bookmarks"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <main className="flex-1">
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                <Route
                                    path="/onboarding"
                                    element={
                                        <ProtectedRoute>
                                            <Onboarding />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/themes"
                                    element={
                                        <ProtectedRoute>
                                            <Themes />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/bookmarks"
                                    element={
                                        <ProtectedRoute>
                                            <Bookmarks />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="/:username" element={<ProfilePage />} />
                                
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
