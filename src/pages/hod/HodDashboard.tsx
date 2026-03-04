import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, Link2, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HodDashboard = () => {
  const { institution, getUnassignedStudents, getSupervisors } = useInstitution();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deptStudents = institution.users.filter(u => u.role === "Student" && u.department === user?.department);
  const deptSupervisors = institution.users.filter(u => u.role === "Supervisor" && u.department === user?.department);
  const deptProjects = institution.projects.filter(p => p.department === user?.department);
  const unassigned = getUnassignedStudents().filter(s => s.department === user?.department);

  const supervisorWorkload = deptSupervisors.map(sup => ({
    ...sup,
    studentCount: institution.assignments.filter(a => a.supervisorId === sup.id).length,
  }));

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Department Dashboard</h1>
        <p className="text-muted-foreground">{user?.department} · {user?.faculty}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 shadow-card text-center">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-3xl font-bold">{deptStudents.length}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </Card>
        <Card className="p-5 shadow-card text-center">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-3xl font-bold">{deptSupervisors.length}</p>
          <p className="text-xs text-muted-foreground">Supervisors</p>
        </Card>
        <Card className="p-5 shadow-card text-center">
          <FolderOpen className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-3xl font-bold">{deptProjects.length}</p>
          <p className="text-xs text-muted-foreground">Projects</p>
        </Card>
        <Card className="p-5 shadow-card text-center">
          <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
          <p className="text-3xl font-bold">{unassigned.length}</p>
          <p className="text-xs text-muted-foreground">Unassigned</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Unassigned students */}
        <Card className="shadow-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold">Students Awaiting Assignment</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/hod/assignments")}>
              Manage <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {unassigned.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">All students assigned ✓</p>
            ) : (
              unassigned.map(s => (
                <div key={s.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.studentCategory} · {s.programme}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-destructive border-destructive/30">Unassigned</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Supervisor workload */}
        <Card className="shadow-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold">Supervisor Workload</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/hod/supervisors")}>
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {supervisorWorkload.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground text-center">No supervisors in department</p>
            ) : (
              supervisorWorkload.map(sup => (
                <div key={sup.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{sup.name}</p>
                    <p className="text-xs text-muted-foreground">{sup.academicTitle}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{sup.studentCount} students</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HodDashboard;
