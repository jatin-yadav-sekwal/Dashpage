import { Link } from "react-router-dom";

interface ProfileFooterProps {
    username: string;
    fullName: string;
    themeColors?: {
        primary: string;
        background: string;
        textSecondary: string;
    };
}

export function ProfileFooter({ username, fullName, themeColors }: ProfileFooterProps) {
    const bgColor = themeColors?.background || "#ffffff";
    const textColor = themeColors?.primary || "#0f172a";
    const mutedColor = themeColors?.textSecondary || "#64748b";

    return (
        <footer className="py-8 px-6" style={{ backgroundColor: bgColor }}>
            <div className="max-w-5xl mx-auto">
                <div className="border-t pt-6" style={{ borderColor: mutedColor, opacity: 0.2 }}>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                        <div className="text-center">
                            <p className="font-bold" style={{ color: textColor }}>
                                {fullName}
                            </p>
                            <p className="text-xs sm:text-sm" style={{ color: mutedColor }}>
                                @{username}
                            </p>
                        </div>

                        <p className="text-xs sm:text-sm" style={{ color: mutedColor }}>
                            Powered by <Link to="/" className="underline hover:opacity-70">DashPage</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
