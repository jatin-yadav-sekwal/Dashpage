import { Navbar } from "../components/landing/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { ThemeCarousel } from "../components/landing/ThemeCarousel";
import { SiteFooter } from "../components/landing/SiteFooter";

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <HeroSection />
                <FeatureGrid />
                <ThemeCarousel />
            </main>
            <SiteFooter />
        </div>
    );
}
