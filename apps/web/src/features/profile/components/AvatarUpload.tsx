import { useRef, useState } from "react";
import { useUploadAvatar, useMyProfile } from "../hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { compressAvatar, validateAvatarFile, createPreviewUrl, revokePreviewUrl } from "@/lib/imageCompression";

export function AvatarUpload() {
    const { data: profileData } = useMyProfile();
    const uploadAvatar = useUploadAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profile = profileData?.data;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validation = validateAvatarFile(file);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }

        // Show loading state
        toast.info("Compressing image...");

        try {
            // Compress the image
            const compressedBlob = await compressAvatar(file);
            
            // Create a new file from the compressed blob
            const compressedFile = new File(
                [compressedBlob],
                file.name.replace(/\.[^/.]+$/, ".jpg"), // Change extension to .jpg
                { type: "image/jpeg" }
            );

            // Update preview immediately
            if (previewUrl) {
                revokePreviewUrl(previewUrl);
            }
            const newPreviewUrl = createPreviewUrl(compressedFile);
            setPreviewUrl(newPreviewUrl);

            // Upload the compressed file
            uploadAvatar.mutate(compressedFile, {
                onSuccess: () => {
                    toast.success("Avatar updated!");
                    // Revoke preview URL after successful upload
                    if (previewUrl) {
                        revokePreviewUrl(previewUrl);
                    }
                    setPreviewUrl(null);
                },
                onError: (err) => {
                    toast.error(err.message || "Failed to upload avatar");
                    // Revoke preview URL on error
                    if (previewUrl) {
                        revokePreviewUrl(previewUrl);
                    }
                    setPreviewUrl(null);
                },
            });
        } catch (error) {
            toast.error("Failed to compress image");
            console.error("Compression error:", error);
        }
    };

    if (!profile) return null;

    const initials = profile.fullName
        ? profile.fullName.substring(0, 2).toUpperCase()
        : profile.username?.substring(0, 2).toUpperCase() || "?";

    // Use preview URL if available, otherwise use profile avatar
    const displayUrl = previewUrl || profile.avatarUrl || "";

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shadow-sm border">
                    <AvatarImage 
                        src={displayUrl} 
                        alt={profile.fullName || "Avatar"} 
                        className="object-cover" 
                    />
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
