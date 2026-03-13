import { useState } from "react";
import { useThemes, useApplyTheme, useBuyPremiumTheme } from "@/features/themes/hooks";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Paintbrush } from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Themes() {
    const { user } = useAuth();
    const { data: themes, isLoading: isLoadingThemes } = useThemes();
    const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
    const applyTheme = useApplyTheme();

    const [applyingId, setApplyingId] = useState<string | null>(null);

    if (!user) return <Navigate to="/login" />;

    const handleApplyFreeTheme = async (themeId: string) => {
        setApplyingId(themeId);
        try {
            await applyTheme.mutateAsync(themeId);
            toast.success("Theme applied successfully! Check your public profile.");
        } catch (error: any) {
            toast.error(error.message || "Failed to apply theme.");
        } finally {
            setApplyingId(null);
        }
    };

    const buyTheme = useBuyPremiumTheme();

    const handleBuyPremiumTheme = async (themeId: string) => {
        setApplyingId(themeId);
        try {
            await buyTheme.mutateAsync(themeId);
            toast.success("Payment successful! Theme unlocked and applied.");
        } catch (error: any) {
            toast.error(error.message || "Payment failed. Please try again.");
        } finally {
            setApplyingId(null);
        }
    };

    // Ensure loading skeletons are shown while fetching
    if (isLoadingThemes || isLoadingProfile) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const activeThemeId = profile?.data?.themeId;

    return (
        <div className="container max-w-6xl py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Theme Marketplace</h1>
                <p className="text-muted-foreground text-lg">
                    Customize your public profile's look and feel. Choose from our free aesthetic themes or upgrade to premium.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes?.map((theme: any) => {
                    const isActive = activeThemeId === theme.id;
                    const config = theme.config;

                    return (
                        <Card key={theme.id} className={`flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md ${isActive ? 'ring-2 ring-primary border-primary' : ''}`}>
                            {/* Abstract Preview Block based on config colors */}
                            <div
                                className="h-40 w-full p-4 flex flex-col justify-between"
                                style={{ backgroundColor: config.colors.background }}
                            >
                                <div className="flex justify-between items-start">
                                    <div
                                        className="h-8 w-24 rounded"
                                        style={{ backgroundColor: config.colors.primary, borderRadius: config.borderRadius }}
                                    />
                                    {isActive && (
                                        <Badge variant="default" className="bg-primary text-primary-foreground">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                                        </Badge>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" style={{ backgroundColor: config.colors.text }} />
                                    <div className="h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" style={{ backgroundColor: config.colors.textSecondary }} />
                                </div>
                                <div
                                    className="h-10 w-full rounded mt-4"
                                    style={{ backgroundColor: config.colors.accent, borderRadius: config.borderRadius }}
                                />
                            </div>

                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl">{theme.name}</CardTitle>
                                    {theme.isPremium ? (
                                        <Badge variant="secondary" className="font-mono">
                                            ₹{(theme.price! / 100).toFixed(2)}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30">
                                            Free
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription>
                                    Font: <span className="font-medium text-foreground">{config.fonts.heading}</span>
                                </CardDescription>
                            </CardHeader>

                            <CardFooter className="mt-auto pt-0">
                                {isActive ? (
                                    <Button variant="secondary" className="w-full" disabled>
                                        Currently Active
                                    </Button>
                                ) : theme.isPremium ? (
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                        onClick={() => handleBuyPremiumTheme(theme.id)}
                                        disabled={applyingId === theme.id}
                                    >
                                        {applyingId === theme.id ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                                        ) : (
                                            "Unlock Premium"
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="default"
                                        className="w-full"
                                        disabled={applyingId === theme.id}
                                        onClick={() => handleApplyFreeTheme(theme.id)}
                                    >
                                        {applyingId === theme.id ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying...</>
                                        ) : (
                                            <><Paintbrush className="w-4 h-4 mr-2" /> Apply Theme</>
                                        )}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
