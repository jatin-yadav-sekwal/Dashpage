import { useState, useEffect } from "react";
import { useMyProfile, useUpdateProfile } from "../hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileForm() {
    const { data: profileData, isLoading } = useMyProfile();
    const updateProfile = useUpdateProfile();
    const profile = profileData?.data;

    const [formData, setFormData] = useState({
        fullName: "",
        tagline: "",
        bio: "",
        email: "",
        phone: "",
        location: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || "",
                tagline: profile.tagline || "",
                bio: profile.bio || "",
                email: profile.email || "",
                phone: profile.phone || "",
                location: profile.location || "",
            });
        }
    }, [profile]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile.mutate(formData, {
            onSuccess: () => toast.success("Profile saved!"),
            onError: (err) => toast.error(err.message),
        });
    };

    if (isLoading) return <div className="p-4">Loading profile...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                    id="tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="Software Engineer & Creator"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell the world about yourself..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="hello@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                />
            </div>

            <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
