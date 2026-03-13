import { Palette, Share2, History, MessageSquare, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";
import { LayoutGrid, type LayoutGridCard } from "../ui/layout-grid";

export function FeatureGrid() {
    const features: LayoutGridCard[] = [
        {
            id: 1,
            className: "md:col-span-2",
            content: (
                <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
                        <Palette className="w-7 h-7 text-blue-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Service Profiles</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Your dream portfolio and digital business card, built in staggering precision.
                    </p>
                    <div className="pt-4 flex items-center gap-2 text-blue-600 font-medium">
                        Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            )
        },
        {
            id: 2,
            className: "md:col-span-1",
            content: (
                <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="w-7 h-7 text-purple-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Portfolio Showcases</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        A fast, secure, customizable, fully automated all-in-one network built on staggering speeds.
                    </p>
                    <div className="pt-2 space-y-2">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" /> Customizable
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" /> Secure
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            className: "md:col-span-1",
            content: (
                <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                        <History className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Educational Timelines</h3>
                    <p className="text-slate-600 text-sm">Show your data with fluid architectures</p>
                </div>
            )
        },
        {
            id: 4,
            className: "md:col-span-2",
            content: (
                <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 backdrop-blur-sm flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-orange-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Contact Widgets</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500" /> Fast
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Shield className="w-4 h-4 text-cyan-500" /> Secure
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-6xl mx-auto px-6 mb-12">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Features</h2>
                <p className="text-slate-600 mt-2">Everything you need to showcase your work</p>
            </div>
            <LayoutGrid cards={features} />
        </section>
    );
}
