import { useMyProfile, useUpdateProfile } from "../hooks";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Globe } from "lucide-react";

export function PublishToggle() {
    const { data: profileData } = useMyProfile();
    const updateProfile = useUpdateProfile();
    const profile = profileData?.data;

    const handleToggle = (checked: boolean) => {
        if (checked && !profile?.fullName) {
            toast.error("Please add your Full Name before publishing");
            return;
        }

        if (!checked) {
            if (!confirm("Are you sure you want to unpublish your profile? It won't be visible to others anymore.")) {
                return;
            }
        }

        updateProfile.mutate(
            { isPublished: checked },
            {
                onSuccess: () => {
                    toast.success(checked ? "Profile published!" : "Profile unpublished.");
                },
                onError: (err) => toast.error(err.message),
            }
        );
    };

    if (!profile) return null;

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
        </div>
    );
}
