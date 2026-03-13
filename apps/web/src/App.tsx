import { Routes, Route } from "react-router-dom";
// import { Navbar } from "@/components/layout/Navbar";
// import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import Themes from "@/pages/Themes";
import Bookmarks from "@/pages/Bookmarks";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* <Navbar /> */}
            <main className="flex-1">
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected - requires auth, redirects to onboarding if no profile */}
                    <Route
                        path="/onboarding"
                        element={
                            <ProtectedRoute requireProfile={false}>
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
                    {/* Added Themes protected route */}
                    <Route
                        path="/themes"
                        element={
                            <ProtectedRoute>
                                <Themes />
                            </ProtectedRoute>
                        }
                    />
                    {/* Bookmarks protected route */}
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
                </Routes>
            </main>
            {/* <Footer /> */}
        </div>
    );
}

export default App;
