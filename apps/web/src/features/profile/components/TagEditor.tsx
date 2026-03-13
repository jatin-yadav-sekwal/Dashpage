import { useState, KeyboardEvent, useEffect } from "react";
import { useMyProfile, useMyTags, useReplaceTags } from "../hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X } from "lucide-react";

export function TagEditor() {
    const { data: profileData } = useMyProfile();
    const username = profileData?.data?.username;

    const { data: serverTags, isLoading } = useMyTags(username);
    const replaceTags = useReplaceTags();

    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    // Sync draft state with server
    useEffect(() => {
        if (serverTags) {
            setTags(serverTags);
        }
    }, [serverTags]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const newTag = inputValue.trim().toLowerCase();
        if (!newTag) return;

        if (tags.length >= 20) {
            toast.error("Maximum 20 tags allowed");
            return;
        }

        if (tags.includes(newTag)) {
            setInputValue("");
            return;
        }

        setTags([...tags, newTag]);
        setInputValue("");
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = () => {
        replaceTags.mutate(tags, {
            onSuccess: () => toast.success("Tags updated!"),
            onError: (err) => toast.error(err.message),
        });
    };

    if (!profileData?.data) return null;
    if (isLoading) return <div className="p-4">Loading tags...</div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Skills & Interests</h3>
                    <p className="text-sm text-muted-foreground">Add up to 20 tags to help people find you.</p>
                </div>

                <div className="flex border rounded-md px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background transition-all">
                    <div className="flex flex-wrap gap-2 items-center w-full">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1 text-sm bg-accent/50">
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="rounded-full hover:bg-muted p-0.5 text-muted-foreground"
                                >
                                    <X className="w-3 h-3" />
                                    <span className="sr-only">Remove {tag}</span>
                                </button>
                            </Badge>
                        ))}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={addTag}
                            className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground text-sm py-1"
                            placeholder={tags.length < 20 ? "Add a tag..." : "Max tags reached"}
                            disabled={tags.length >= 20}
                        />
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} disabled={replaceTags.isPending}>
                {replaceTags.isPending ? "Saving..." : "Save Tags"}
            </Button>
        </div>
    );
}
