import { useState, useEffect } from "react";
import { useMyProfile, useUpdateProfile } from "../hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Github, Linkedin, Twitter, Globe, Instagram, Youtube, Dribbble } from "lucide-react";

const SOCIAL_PLATFORMS = [
    { id: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
    { id: "twitter", label: "Twitter", icon: Twitter, placeholder: "https://twitter.com/username" },
    { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/username" },
    { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@username" },
    { id: "dribbble", label: "Dribbble", icon: Dribbble, placeholder: "https://dribbble.com/username" },
    { id: "website", label: "Personal Website", icon: Globe, placeholder: "https://yourwebsite.com" },
] as const;

export function SocialLinksForm() {
    const { data: profileData, isLoading } = useMyProfile();
    const updateProfile = useUpdateProfile();
    const profile = profileData?.data;

    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

    useEffect(() => {
        if (profile?.socialLinks) {
            setSocialLinks(profile.socialLinks as Record<string, string>);
        }
    }, [profile]);

    const handleChange = (platform: string, value: string) => {
        setSocialLinks((prev) => ({ ...prev, [platform]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out empty strings if desired, or let the backend handle them
        const cleanedLinks = Object.fromEntries(
            Object.entries(socialLinks).filter(([, value]) => value !== "")
        );

        updateProfile.mutate(
            { socialLinks: cleanedLinks },
            {
                onSuccess: () => toast.success("Social links saved!"),
                onError: (err) => toast.error(err.message),
            }
        );
    };

    if (isLoading) return <div className="p-4">Loading profile...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                {SOCIAL_PLATFORMS.map(({ id, label, icon: Icon, placeholder }) => (
                    <div key={id} className="space-y-2">
                        <Label htmlFor={id} className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {label}
                        </Label>
                        <Input
                            id={id}
                            type="url"
                            value={socialLinks[id] || ""}
                            onChange={(e) => handleChange(id, e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>
                ))}
            </div>

            <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Links"}
            </Button>
        </form>
    );
}
