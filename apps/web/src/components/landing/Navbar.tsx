import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, X } from "lucide-react";

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            { name: "Features", link: "/#features" },
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
        <>
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-full flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm' : 'bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 shadow-sm'}`}
            >
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900" />
                    <span className="text-xl font-bold text-slate-900 tracking-tight">DashPage</span>
                </Link>

                {/* Desktop Navigation */}
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

                {/* Desktop CTA */}
                <div className="hidden md:block">
                    {ctaButton}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 rounded-full hover:bg-slate-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-sm pt-24 px-6"
                    >
                        <div className="flex flex-col items-center gap-6">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-xl font-bold text-white hover:text-slate-300 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navItems.length * 0.1 }}
                                className="mt-4"
                            >
                                {user ? (
                                    <button 
                                        onClick={async () => {
                                            await signOut();
                                            window.location.href = "/";
                                        }}
                                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium text-white border border-slate-600 hover:border-white transition-colors"
                                    >
                                        Log Out <LogOut className="w-5 h-5 ml-2" />
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-bold text-slate-900 bg-white shadow-sm transition-all hover:bg-slate-100"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 text-white hover:text-slate-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
