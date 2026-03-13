import { useState } from "react";
import {
    useMyEducations,
    useCreateEducation,
    useUpdateEducation,
    useDeleteEducation,
    useReorderEducations
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
import type { Education } from "@shared/types";

export function EducationEditor() {
    const { data: educations, isLoading } = useMyEducations();
    const createEd = useCreateEducation();
    const updateEd = useUpdateEducation();
    const deleteEd = useDeleteEducation();
    const reorderEd = useReorderEducations();

    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        degree: "",
        institution: "",
        startYear: "",
        endYear: "",
        description: "",
    });

    const resetForm = () => {
        setFormData({ degree: "", institution: "", startYear: "", endYear: "", description: "" });
        setEditingId(null);
    };

    const handleOpenEdit = (ed: Education) => {
        setFormData({
            degree: ed.degree,
            institution: ed.institution,
            startYear: ed.startYear.toString(),
            endYear: ed.endYear ? ed.endYear.toString() : "",
            description: ed.description || "",
        });
        setEditingId(ed.id);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            startYear: parseInt(formData.startYear, 10),
            endYear: formData.endYear ? parseInt(formData.endYear, 10) : null,
            description: formData.description || "",
        };

        if (editingId) {
            updateEd.mutate(
                { id: editingId, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Education updated");
                        setIsOpen(false);
                        resetForm();
                    },
                    onError: (err) => toast.error(err.message),
                }
            );
        } else {
            createEd.mutate(payload, {
                onSuccess: () => {
                    toast.success("Education added");
                    setIsOpen(false);
                    resetForm();
                },
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this education entry?")) {
            deleteEd.mutate(id, {
                onSuccess: () => toast.success("Education deleted"),
                onError: (err) => toast.error(err.message),
            });
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (!educations) return;

        const newItems = [...educations];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= newItems.length) return;

        // Swap
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        const newIds = newItems.map(item => item.id);
        reorderEd.mutate(newIds, {
            onError: (err) => toast.error(err.message)
        });
    };

    if (isLoading) return <div className="p-4">Loading education...</div>;

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Education</h3>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Add Education
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Education" : "Add Education"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution</Label>
                                <Input
                                    id="institution"
                                    value={formData.institution}
                                    onChange={(e) => setFormData(p => ({ ...p, institution: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree / Field of Study</Label>
                                <Input
                                    id="degree"
                                    value={formData.degree}
                                    onChange={(e) => setFormData(p => ({ ...p, degree: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startYear">Start Year</Label>
                                    <Input
                                        id="startYear"
                                        type="number"
                                        min="1900"
                                        max="2100"
                                        value={formData.startYear}
                                        onChange={(e) => setFormData(p => ({ ...p, startYear: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endYear">End Year (Optional)</Label>
                                    <Input
                                        id="endYear"
                                        type="number"
                                        min="1900"
                                        max="2100"
                                        value={formData.endYear}
                                        onChange={(e) => setFormData(p => ({ ...p, endYear: e.target.value }))}
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
                                <Button type="submit" disabled={createEd.isPending || updateEd.isPending}>
                                    {editingId ? "Save Changes" : "Add Education"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {(!educations || educations.length === 0) ? (
                <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                    No education added yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {educations.map((ed, index) => (
                        <div key={ed.id} className="flex items-start justify-between p-4 border rounded-lg bg-card">
                            <div>
                                <h4 className="font-medium">{ed.institution}</h4>
                                <p className="text-sm text-primary">{ed.degree}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {ed.startYear} - {ed.endYear || 'Present'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="flex flex-col mr-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        disabled={index === 0 || reorderEd.isPending}
                                        onClick={() => handleMove(index, 'up')}
                                    >
                                        <ArrowUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        disabled={index === educations.length - 1 || reorderEd.isPending}
                                        onClick={() => handleMove(index, 'down')}
                                    >
                                        <ArrowDown className="h-3 w-3" />
                                    </Button>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(ed)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ed.id)}>
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
