import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";

const HodSupervisors = () => {
  const { institution } = useInstitution();
  const { user } = useAuth();
  const supervisors = institution.users.filter(u => u.role === "Supervisor" && u.department === user?.department);

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Supervisors" subtitle={`Supervisors in ${user?.department || "your department"}`} />
      <Card className="shadow-card">
        <div className="divide-y divide-border">
          {supervisors.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No supervisors registered in this department.</p>
          ) : (
            supervisors.map(sup => {
              const studentCount = institution.assignments.filter(a => a.supervisorId === sup.id).length;
              return (
                <div key={sup.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{sup.name}</p>
                    <p className="text-xs text-muted-foreground">{sup.academicTitle} · {sup.email}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{studentCount} student{studentCount !== 1 ? "s" : ""}</Badge>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default HodSupervisors;
