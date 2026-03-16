import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { DotDistortionShader } from "../ui/dot-distortion-shader";
import { TypewriterEffect } from "../ui/typewriter-effect";
import { useAuth } from "@/context/AuthContext";

export function HeroSection() {
    const { user, initialized } = useAuth();
    
    const words = [
        { text: "Experience" },
        { text: "instant," },
        { text: "seamless" },
        { text: "creation.", className: "text-blue-600" },
    ];

    return (
        <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] overflow-hidden flex flex-col justify-center pt-24 pb-16 lg:pt-32 lg:pb-24 bg-slate-50/30">
            {/* Canvas Dot Mesh Background */}
            <div 
                className="absolute inset-0 z-0 opacity-40 lg:opacity-60 pointer-events-none" 
            >
                <DotDistortionShader 
                    dotSize={2}
                    dotGap={20}
                    mouseInfluenceRadius={100}
                    distortionStrength={3}
                    returnSpeed={0.05}
                    friction={0.85}
                    color="#2563eb"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-6 mt-8 lg:mt-12 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl pointer-events-auto"
                >
                    <TypewriterEffect 
                        words={words} 
                        className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-800 mb-4 lg:mb-6 leading-[1.15] text-left" 
                        cursorClassName="h-6 sm:h-10 lg:h-[4.5rem] bg-blue-600 rounded-sm"
                    />
                    
                    <p className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-xl mb-6 lg:mb-10 font-medium leading-relaxed text-left">
                        Your instant portfolio and digital business card, built in minutes,
                        yourself. Designed for the minimalist.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                        {!initialized ? (
                            <div className="inline-flex items-center justify-center w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-slate-800 animate-pulse">
                                Loading...
                            </div>
                        ) : user ? (
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-slate-800 shadow-sm transition-all hover:bg-slate-900 hover:-translate-y-0.5"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-slate-800 shadow-sm transition-all hover:bg-slate-900 hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        )}
                        
                        <button
                            onClick={() => {
                                const featuresSection = document.getElementById("features");
                                if (featuresSection) {
                                    featuresSection.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="inline-flex items-center justify-center w-full sm:w-auto rounded-full border border-slate-200 bg-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5"
                        >
                            Explore
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Gradient overlay to blend with next section */}
            <div className="absolute bottom-0 left-0 right-0 h-20 lg:h-32 bg-gradient-to-t from-white to-transparent z-0 pointer-events-none" />
        </section>
    );
}
