import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Bookmark, Palette, Search } from "lucide-react";

export default function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-6 text-sm text-muted-foreground">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            Now Live
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                            Your Digital
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                Business Card
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Create a stunning portfolio page in minutes. Share your work,
                            connect with professionals, and build your online presence.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
                            >
                                Create Your Page
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/themes"
                                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium hover:bg-accent transition-colors"
                            >
                                Browse Themes
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 border-t border-border">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        Everything you need
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Palette,
                                title: "Beautiful Themes",
                                description:
                                    "Choose from curated themes designed by professionals. Switch anytime with one click.",
                            },
                            {
                                icon: Bookmark,
                                title: "Bookmark Profiles",
                                description:
                                    "Save interesting profiles to your collection. Build your own network naturally.",
                            },
                            {
                                icon: Search,
                                title: "Smart Search",
                                description:
                                    'Search your bookmarks naturally — "MBA from CUH" finds exactly who you need.',
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-border">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to stand out?</h2>
                    <p className="text-muted-foreground mb-8">
                        Join thousands of professionals who've upgraded their online
                        presence.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                        Get Started — It's Free
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
