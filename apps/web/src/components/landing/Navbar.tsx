import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { user, signOut } = useAuth();

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setIsScrolled(latest > 20);
        });
    }, [scrollY]);

    // If user is logged in, show different nav items and a logout button
    let navItems;
    let ctaButton;

    if (user) {
        navItems = [
            { name: "Dashboard", link: "/dashboard" },
            { name: "Bookmarks", link: "/bookmarks" },
        ];
        ctaButton = (
            <button 
                onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                }}
                className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 hover:border-slate-900 hover:text-slate-900 transition-colors"
            >
                Log Out <LogOut className="w-4 h-4 ml-2" />
            </button>
        );
    } else {
        navItems = [
            { name: "Features", link: "/features" },
            { name: "Themes", link: "/themes" },
            { name: "Bookmarks", link: "/bookmarks" },
        ];
        ctaButton = (
            <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold text-white bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-800"
            >
                Get Started
            </Link>
        );
    }

    return (
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 px-6 py-4 rounded-full flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm py-3' : 'bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 shadow-sm'}`}
        >
            <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900" />
                <span className="text-xl font-bold text-slate-900 tracking-tight">DashPage</span>
            </Link>

            <div 
                className="hidden md:flex items-center gap-1"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {navItems.map((item, idx) => (
                    <Link
                        key={item.name}
                        to={item.link}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        className="relative px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                    >
                        <AnimatePresence>
                            {hoveredIndex === idx && (
                                <motion.span
                                    className="absolute inset-0 rounded-full bg-slate-200/50"
                                    layoutId="navbarHover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                                    exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
                                />
                            )}
                        </AnimatePresence>
                        <span className="relative z-10">{item.name}</span>
                    </Link>
                ))}
            </div>

            <div>
                {ctaButton}
            </div>
        </motion.nav>
    );
}
