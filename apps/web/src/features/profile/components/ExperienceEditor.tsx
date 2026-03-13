import { useState } from "react";
import {
    useMyExperiences,
    useCreateExperience,
    useUpdateExperience,
    useDeleteExperience,
    useReorderExperiences
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
import { Pencil, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import type { Experience } from "@shared/types";

export function ExperienceEditor() {
    const { data: experiences, isLoading } = useMyExperiences();
    const createExp = useCreateExperience();
    const updateExp = useUpdateExperience();
    const deleteExp = useDeleteExperience();
    const reorderExp = useReorderExperiences();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const resetForm = () => {
        setFormData({ title: "", company: "", startDate: "", endDate: "", description: "" });
        setEditingId(null);
    };

    const handleOpenEdit = (exp: Experience) => {
        setFormData({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate.split("T")[0],
            endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
            description: exp.description || "",
        });
        setEditingId(exp.id);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            endDate: formData.endDate || null,
            description: formData.description || "",
        };

        if (editingId) {
            updateExp.mutate(
                { id: editingId, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Experience updated");
                        setIsOpen(false);
                        resetForm();
                    },
                    onError: (err) => toast.error(err.message),
                }
            );
        } else {
            createExp.mutate(payload, {
                onSuccess: () => {
                    toast.success("Experience added");
                    setIsOpen(false);
                    resetForm();
                },
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this experience?")) {
            deleteExp.mutate(id, {
                onSuccess: () => toast.success("Experience deleted"),
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (!experiences) return;

        const newItems = [...experiences];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= newItems.length) return;

        // Swap
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        const newIds = newItems.map(item => item.id);
        reorderExp.mutate(newIds, {
            onError: (err) => toast.error(err.message)
        });
    };

    if (isLoading) return <div className="p-4">Loading experiences...</div>;

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Add Experience
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) => setFormData(p => ({ ...p, company: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date (Optional)</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(p => ({ ...p, endDate: e.target.value }))}
                                    />
                                </div>
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
                                <Button type="submit" disabled={createExp.isPending || updateExp.isPending}>
                                    {editingId ? "Save Changes" : "Add Experience"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {(!experiences || experiences.length === 0) ? (
                <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                    No experiences added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {experiences.map((exp, index) => (
                        <div key={exp.id} className="flex items-start justify-between p-4 border rounded-lg bg-card">
                            <div>
                                <h4 className="font-medium">{exp.title}</h4>
                                <p className="text-sm text-primary">{exp.company}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="flex flex-col mr-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        disabled={index === 0 || reorderExp.isPending}
                                        onClick={() => handleMove(index, 'up')}
                                    >
                                        <ArrowUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        disabled={index === experiences.length - 1 || reorderExp.isPending}
                                        onClick={() => handleMove(index, 'down')}
                                    >
                                        <ArrowDown className="h-3 w-3" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(exp)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(exp.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
