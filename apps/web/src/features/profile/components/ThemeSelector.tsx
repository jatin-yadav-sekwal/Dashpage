import { useThemes, useApplyTheme } from "@/features/themes/hooks";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export function ThemeSelector() {
    const { data: themes, isLoading: isLoadingThemes } = useThemes();
    const { data: profileData } = useMyProfile();
    const applyTheme = useApplyTheme();

    const currentThemeId = profileData?.data?.themeId;

    const handleApplyTheme = async (themeId: string) => {
        try {
            await applyTheme.mutateAsync(themeId);
            toast.success("Theme applied successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to apply theme");
        }
    };

    if (isLoadingThemes) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Choose Your Theme</h3>
                <p className="text-sm text-muted-foreground">Select a theme for your public profile</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes?.map((theme: any) => {
                    const isActive = currentThemeId === theme.id;
                    const config = theme.config;

                    return (
                        <Card 
                            key={theme.id} 
                            className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                                isActive ? 'ring-2 ring-primary border-primary' : ''
                            }`}
                            onClick={() => !isActive && !theme.isPremium && handleApplyTheme(theme.id)}
                        >
                            <div
                                className="h-24 p-3 flex flex-col justify-between"
                                style={{ backgroundColor: config.colors.background }}
                            >
                                <div 
                                    className="h-4 w-16 rounded" 
                                    style={{ backgroundColor: config.colors.primary, borderRadius: config.borderRadius }}
                                />
                                <div className="space-y-1">
                                    <div 
                                        className="h-3 w-full rounded" 
                                        style={{ backgroundColor: config.colors.text, opacity: 0.7 }}
                                    />
                                    <div 
                                        className="h-2 w-2/3 rounded" 
                                        style={{ backgroundColor: config.colors.textSecondary }}
                                    />
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">{theme.name}</span>
                                    {isActive ? (
                                        <Badge variant="default" className="text-xs bg-green-500">
                                            <Check className="w-3 h-3 mr-1" /> Active
                                        </Badge>
                                    ) : theme.isPremium ? (
                                        <Badge variant="secondary" className="text-xs">
                                            ₹{(theme.price || 0) / 100}
                                        </Badge>
                                    ) : (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-7 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleApplyTheme(theme.id);
                                            }}
                                            disabled={applyTheme.isPending}
                                        >
                                            {applyTheme.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
