import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/layout/PageHeader";
import { Link2, Unlink } from "lucide-react";
import { toast } from "sonner";

const HodAssignments = () => {
  const { institution, assignSupervisor, unassignSupervisor } = useInstitution();
  const { user } = useAuth();
  const [selectedSupervisor, setSelectedSupervisor] = useState<Record<string, string>>({});

  const students = institution.users.filter(u => u.role === "Student" && u.department === user?.department);
  const supervisors = institution.users.filter(u => u.role === "Supervisor" && u.department === user?.department);

  const handleAssign = (studentId: string) => {
    const supId = selectedSupervisor[studentId];
    if (!supId) return;
    assignSupervisor(studentId, supId, user?.id || "");
    toast.success("Supervisor assigned successfully");
  };

  const handleUnassign = (studentId: string) => {
    unassignSupervisor(studentId);
    toast.success("Supervisor unassigned");
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Supervisor Assignments" subtitle="Assign supervisors to students in your department" />

      <Card className="shadow-card">
        <div className="divide-y divide-border">
          {students.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No students in department.</p>
          ) : (
            students.map(student => {
              const assignment = institution.assignments.find(a => a.studentId === student.id);
              const currentSup = assignment ? institution.users.find(u => u.id === assignment.supervisorId) : null;

              return (
                <div key={student.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.studentCategory} · {student.programme} · {student.matricId}</p>
                    </div>
                    {currentSup ? (
                      <Badge variant="secondary" className="text-xs">Assigned: {currentSup.name}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-destructive border-destructive/30">Unassigned</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Select
                      value={selectedSupervisor[student.id] || ""}
                      onValueChange={(v) => setSelectedSupervisor(prev => ({ ...prev, [student.id]: v }))}
                    >
                      <SelectTrigger className="flex-1 h-9">
                        <SelectValue placeholder="Select supervisor…" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors.map(sup => {
                          const load = institution.assignments.filter(a => a.supervisorId === sup.id).length;
                          return (
                            <SelectItem key={sup.id} value={sup.id}>
                              {sup.name} ({sup.academicTitle}) — {load} students
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleAssign(student.id)} disabled={!selectedSupervisor[student.id]}>
                      <Link2 className="h-3 w-3 mr-1" /> Assign
                    </Button>
                    {currentSup && (
                      <Button size="sm" variant="outline" onClick={() => handleUnassign(student.id)}>
                        <Unlink className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default HodAssignments;
