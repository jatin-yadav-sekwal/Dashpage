import { useMyProfile, useUpdateProfile } from "../hooks";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Globe, Loader2 } from "lucide-react";

export function PublishToggle() {
    const { data: profileData, isLoading } = useMyProfile();
    const updateProfile = useUpdateProfile();
    const profile = profileData?.data;

    const handleToggle = async (checked: boolean) => {
        if (checked && !profile?.fullName) {
            toast.error("Please add your Full Name before publishing");
            return;
        }

        if (!checked) {
            if (!confirm("Are you sure you want to unpublish your profile? It won't be visible to others anymore.")) {
                return;
            }
        }

        try {
            await updateProfile.mutateAsync({ isPublished: checked });
            toast.success(checked ? "Profile published!" : "Profile unpublished.");
        } catch (error: any) {
            console.error("Publish error:", error);
            toast.error(error?.message || "Failed to update profile. Please try again.");
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border animate-pulse">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <Label htmlFor="publish-toggle" className="text-sm font-medium">Publish Profile</Label>
                <p className="text-xs text-muted-foreground">
                    {profile.isPublished
                        ? "Your profile is visible to the world."
                        : "Your profile is hidden."}
                </p>
            </div>
            <Switch
                id="publish-toggle"
                checked={!!profile.isPublished}
                onCheckedChange={handleToggle}
                disabled={updateProfile.isPending}
            />
            {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
    );
}
