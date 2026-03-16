import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 text-slate-400 mb-6"
                >
                    <span className="text-4xl font-bold">404</span>
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
                >
                    Page Not Found
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-slate-600 max-w-md mx-auto mb-8"
                >
                    Oops! The page you're looking for doesn't exist or has been moved.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-bold text-white bg-slate-900 shadow-sm transition-all hover:bg-slate-800 hover:-translate-y-0.5"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-bold text-slate-700 border border-slate-300 bg-white transition-all hover:bg-slate-50 hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
