import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/layout/PageHeader";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

const AdminFaculties = () => {
  const { institution, addFaculty, updateFaculty, deleteFaculty } = useInstitution();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    addFaculty(newName.trim());
    setNewName("");
    toast.success("Faculty added");
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    updateFaculty(id, editName.trim());
    setEditingId(null);
    toast.success("Faculty updated");
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader title="Faculties" subtitle="Manage institution faculties" />

      <Card className="shadow-card mb-4">
        <div className="p-4 flex gap-2">
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New faculty name…" onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <Button onClick={handleAdd} disabled={!newName.trim()}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
      </Card>

      <Card className="shadow-card">
        <div className="divide-y divide-border">
          {institution.faculties.map(f => (
            <div key={f.id} className="p-4 flex items-center justify-between">
              {editingId === f.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1" onKeyDown={e => e.key === "Enter" && handleUpdate(f.id)} />
                  <Button size="sm" variant="ghost" onClick={() => handleUpdate(f.id)}><Check className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{institution.departmentList.filter(d => d.facultyId === f.id).length} departments</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingId(f.id); setEditName(f.name); }}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { deleteFaculty(f.id); toast.success("Faculty deleted"); }}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminFaculties;
