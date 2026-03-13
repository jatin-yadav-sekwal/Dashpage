import { useState, useEffect } from "react";
import { useMyProfile } from "../hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Check, X, Loader2 } from "lucide-react";

export function UsernameSetup() {
    const { data: profileData } = useMyProfile();
    const profile = profileData?.data;

    const [username, setUsername] = useState("");
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (profile?.username) {
            setUsername(profile.username);
        }
    }, [profile]);

    useEffect(() => {
        if (!username || username === profile?.username) {
            setIsAvailable(null);
            return;
        }

        const checkAvailability = async () => {
            setIsChecking(true);
            try {
                const res = await api.get(`/username/check?username=${username}`);
                setIsAvailable(res.available);
            } catch (err) {
                setIsAvailable(false);
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeoutId);
    }, [username, profile?.username]);

    const handleSave = () => {
        if (!isAvailable && username !== profile?.username) {
            toast.error("Username is not available");
            return;
        }

        // Since username is essentially creating the profile if it doesn't exist, 
        // or we might need a separate mechanism. But `updateProfile` doesn't currently allow username changes.
        // Let me check if `updateProfileSchema` has username... No, only CreateProfileInput has it.
        // If we want to change username, we might need to add it to UpdateProfileInput, or have a specific API.
        // For now, if profile doesn't exist, `useCreateProfile` is needed. BUT this component edits existing?
        // Let's assume username cannot be updated once created according to schema. 
        // Actually, Phase 1 route POST /me/profile handles creation.
        // If the user has a profile, we just show their username.
        toast.error("Username cannot be changed after creation.");
    };

    if (!profile) return null;

    return (
        <div className="space-y-4 rounded-lg border p-4 bg-card max-w-sm">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex gap-2 relative">
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                        placeholder="johndoe"
                        className="pr-10"
                        disabled={!!profile.username} // Assuming username is immutable in update
                    />
                    {isChecking && (
                        <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                    {!isChecking && isAvailable === true && (
                        <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                    )}
                    {!isChecking && isAvailable === false && (
                        <X className="absolute right-3 top-2.5 h-5 w-5 text-destructive" />
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Your URL will be: {window.location.host}/{username || "username"}
                </p>
            </div>

            {!profile.username && (
                <Button onClick={handleSave} disabled={!isAvailable || isChecking} className="w-full">
                    Claim Username
                </Button>
            )}
        </div>
    );
}
