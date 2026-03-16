import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import Themes from "@/pages/Themes";
import Bookmarks from "@/pages/Bookmarks";
import NotFound from "@/pages/NotFound";

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected - requires auth */}
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

                        {/* Public Profile (username-based URL) */}
                        <Route path="/:username" element={<ProfilePage />} />
                        
                        {/* 404 - Not Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;
