import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back, {user?.email}
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                {/* Profile Card */}
                <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                    <h2 className="font-semibold text-lg mb-2">✏️ Edit Profile</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Update your bio, experience, projects, and more.
                    </p>
                    <Link
                        to="/dashboard/profile"
                        className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* Themes Card */}
                <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                    <h2 className="font-semibold text-lg mb-2">🎨 Themes</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Browse and apply themes to your profile page.
                    </p>
                    <Link
                        to="/themes"
                        className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        Browse Themes
                    </Link>
                </div>

                {/* Bookmarks Card */}
                <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                    <h2 className="font-semibold text-lg mb-2">🔖 Bookmarks</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        View and search your bookmarked profiles.
                    </p>
                    <Link
                        to="/dashboard/bookmarks"
                        className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                    >
                        My Bookmarks
                    </Link>
                </div>

                {/* Preview Card */}
                <div className="rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                    <h2 className="font-semibold text-lg mb-2">👁️ Preview</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        See how your page looks to visitors.
                    </p>
                    <button
                        disabled
                        className="inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed"
                    >
                        Set up profile first
                    </button>
                </div>
            </div>
        </div>
    );
}
