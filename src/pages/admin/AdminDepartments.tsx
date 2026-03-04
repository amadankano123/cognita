import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/layout/PageHeader";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AdminDepartments = () => {
  const { institution, addDepartment, updateDepartment, deleteDepartment } = useInstitution();
  const [newName, setNewName] = useState("");
  const [newFacultyId, setNewFacultyId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newFacultyId) return;
    addDepartment(newName.trim(), newFacultyId);
    setNewName("");
    toast.success("Department added");
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader title="Departments" subtitle="Manage departments across faculties" />

      <Card className="shadow-card mb-4">
        <div className="p-4 space-y-2">
          <div className="flex gap-2">
            <Select value={newFacultyId} onValueChange={setNewFacultyId}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Select faculty" /></SelectTrigger>
              <SelectContent>
                {institution.faculties.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Department name…" className="flex-1" onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <Button onClick={handleAdd} disabled={!newName.trim() || !newFacultyId}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </div>
        </div>
      </Card>

      {institution.faculties.map(fac => {
        const depts = institution.departmentList.filter(d => d.facultyId === fac.id);
        if (depts.length === 0) return null;
        return (
          <Card key={fac.id} className="shadow-card mb-4">
            <div className="p-3 border-b border-border bg-muted/30">
              <p className="text-sm font-semibold">{fac.name}</p>
            </div>
            <div className="divide-y divide-border">
              {depts.map(d => (
                <div key={d.id} className="p-4 flex items-center justify-between">
                  {editingId === d.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1" />
                      <Button size="sm" variant="ghost" onClick={() => { updateDepartment(d.id, editName); setEditingId(null); toast.success("Updated"); }}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{d.name}</p>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => { setEditingId(d.id); setEditName(d.name); }}><Pencil className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { deleteDepartment(d.id); toast.success("Deleted"); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminDepartments;
