import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";

const HodStudents = () => {
  const { institution } = useInstitution();
  const { user } = useAuth();
  const students = institution.users.filter(u => u.role === "Student" && u.department === user?.department);

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Students" subtitle={`All students in ${user?.department || "your department"}`} />
      <Card className="shadow-card">
        <div className="divide-y divide-border">
          {students.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No students in this department yet.</p>
          ) : (
            students.map(s => {
              const assignment = institution.assignments.find(a => a.studentId === s.id);
              const supervisor = assignment ? institution.users.find(u => u.id === assignment.supervisorId) : null;
              return (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.studentCategory} · {s.programme} · {s.matricId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {supervisor ? (
                      <Badge variant="secondary" className="text-xs">Sup: {supervisor.name}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-destructive border-destructive/30">Awaiting Assignment</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">{s.projectType}</Badge>
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

export default HodStudents;
