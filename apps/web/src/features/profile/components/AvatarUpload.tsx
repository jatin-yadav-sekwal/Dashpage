import { useRef } from "react";
import { useUploadAvatar, useMyProfile } from "../hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AvatarUpload() {
    const { data: profileData } = useMyProfile();
    const uploadAvatar = useUploadAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profile = profileData?.data;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("File must be an image");
            return;
        }

        uploadAvatar.mutate(file, {
            onSuccess: () => {
                toast.success("Avatar updated!");
            },
            onError: (err) => {
                toast.error(err.message || "Failed to upload avatar");
            },
        });
    };

    if (!profile) return null;

    const initials = profile.fullName
        ? profile.fullName.substring(0, 2).toUpperCase()
        : profile.username?.substring(0, 2).toUpperCase() || "?";

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shadow-sm border">
                    <AvatarImage src={profile.avatarUrl || ""} alt={profile.fullName || "Avatar"} className="object-cover" />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                >
                    {uploadAvatar.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-xs font-medium">Change</span>
                        </>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                />
            </div>
        </div>
    );
}
