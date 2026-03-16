import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">D</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Dashpage</span>
                </Link>

                {/* Nav Items */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/themes"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Themes
                    </Link>

                    {loading ? (
                        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                    ) : user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
