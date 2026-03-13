import { useState, useRef } from "react";
import {
    useMyProjects,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useReorderProjects,
    useUploadProjectImage,
    useDeleteProjectImage
} from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus, Image as ImageIcon, Loader2, X } from "lucide-react";
import type { Project } from "@shared/types";

export function ProjectEditor() {
    const { data: projects, isLoading } = useMyProjects();
    const createProj = useCreateProject();
    const updateProj = useUpdateProject();
    const deleteProj = useDeleteProject();
    const reorderProj = useReorderProjects();
    const uploadImage = useUploadProjectImage();
    const deleteImage = useDeleteProjectImage();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        projectUrl: "",
        imageUrl: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setFormData({ title: "", description: "", projectUrl: "", imageUrl: "" });
        setEditingId(null);
    };

    const handleOpenEdit = (proj: Project) => {
        setFormData({
            title: proj.title,
            description: proj.description || "",
            projectUrl: proj.projectUrl || "",
            imageUrl: proj.imageUrl || "",
        });
        setEditingId(proj.id);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            description: formData.description || "",
            projectUrl: formData.projectUrl || null,
            imageUrl: formData.imageUrl || null,
        };

        if (editingId) {
            updateProj.mutate(
                { id: editingId, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Project updated");
                        setIsOpen(false);
                        resetForm();
                    },
                    onError: (err) => toast.error(err.message),
                }
            );
        } else {
            createProj.mutate(payload, {
                onSuccess: () => {
                    toast.success("Project added");
                    setIsOpen(false);
                    resetForm();
                },
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            deleteProj.mutate(id, {
                onSuccess: () => toast.success("Project deleted"),
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (!projects) return;

        const newItems = [...projects];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= newItems.length) return;

        // Swap
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        const newIds = newItems.map(item => item.id);
        reorderProj.mutate(newIds, {
            onError: (err) => toast.error(err.message)
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        uploadImage.mutate(
            { id: projectId, file },
            {
                onSuccess: () => toast.success("Image uploaded"),
                onError: (err) => toast.error(err.message),
            }
        );
    };

    const handleRemoveImage = (projectId: string) => {
        deleteImage.mutate(projectId, {
            onSuccess: () => toast.success("Image removed"),
            onError: (err) => toast.error(err.message),
        });
    };

    if (isLoading) return <div className="p-4">Loading projects...</div>;

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Projects</h3>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Project" : "Add Project"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectUrl">URL (Optional)</Label>
                                <Input
                                    id="projectUrl"
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.projectUrl}
                                    onChange={(e) => setFormData(p => ({ ...p, projectUrl: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={createProj.isPending || updateProj.isPending}>
                                    {editingId ? "Save Changes" : "Add Project"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {(!projects || projects.length === 0) ? (
                <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                    No projects added yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj, index) => (
                        <div key={proj.id} className="relative group border rounded-lg bg-card overflow-hidden flex flex-col">
                            {/* Image Area */}
                            <div className="aspect-video bg-muted relative flex items-center justify-center border-b">
                                {proj.imageUrl ? (
                                    <>
                                        <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                            title="Remove Image"
                                            onClick={() => handleRemoveImage(proj.id)}
                                            disabled={deleteImage.isPending}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        {uploadImage.isPending && uploadImage.variables?.id === proj.id ? (
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                        ) : (
                                            <>
                                                <ImageIcon className="h-8 w-8 mb-2 opacity-20" />
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Upload Image
                                                </Button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={(e) => handleFileChange(e, proj.id)}
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                />
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold line-clamp-1">{proj.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {proj.description || "No description"}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center -ml-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={index === 0 || reorderProj.isPending}
                                            onClick={() => handleMove(index, 'up')}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={index === projects.length - 1 || reorderProj.isPending}
                                            onClick={() => handleMove(index, 'down')}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(proj)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(proj.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
