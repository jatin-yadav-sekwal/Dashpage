import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function ThemeCarousel() {
    const themes = [
        {
            name: "Nano Banana",
            bg: "bg-[#FFCC00]",
            type: "Yellow"
        },
        {
            name: "Nano Banana",
            bg: "bg-gradient-to-br from-pink-100 to-purple-100",
            type: "Pastel"
        },
        {
            name: "Nano Banana",
            bg: "bg-slate-900",
            type: "Dark"
        },
        {
            name: "Ocean Breeze",
            bg: "bg-gradient-to-br from-cyan-100 to-blue-200",
            type: "Ocean"
        },
        {
            name: "Forest Green",
            bg: "bg-gradient-to-br from-emerald-100 to-teal-200",
            type: "Nature"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Themes</h2>
                </div>

                <InfiniteMovingCards 
                    items={themes} 
                    direction="left" 
                    speed="normal" 
                    pauseOnHover={true}
                />
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        </section>
    );
}
