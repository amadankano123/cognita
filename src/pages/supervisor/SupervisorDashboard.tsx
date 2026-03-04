import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { mockSupervisedStudents } from "@/data/mockSupervisor";

const SupervisorDashboard = () => {
  const { institution, getStudentsForSupervisor } = useInstitution();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use mock data for rich student detail, but also show assigned students from institution context
  const assignedStudents = getStudentsForSupervisor(user?.id || "");
  const students = mockSupervisedStudents;
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / (students.length || 1));
  const critical = students.filter(s => s.complianceStatus === "Critical");

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Supervisor Dashboard" subtitle={`${user?.academicTitle || ""} · ${user?.department || ""}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 shadow-card text-center">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.length}</p>
          <p className="text-xs text-muted-foreground">Assigned Students</p>
        </Card>
        <Card className="p-4 shadow-card text-center">
          <p className="text-2xl font-bold">{avgProgress}%</p>
          <p className="text-xs text-muted-foreground">Avg. Progress</p>
        </Card>
        <Card className="p-4 shadow-card text-center">
          <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-bold">{critical.length}</p>
          <p className="text-xs text-muted-foreground">Critical</p>
        </Card>
        <Card className="p-4 shadow-card text-center">
          <CheckCircle className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.filter(s => s.complianceStatus === "Good").length}</p>
          <p className="text-xs text-muted-foreground">On Track</p>
        </Card>
      </div>

      <Card className="shadow-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold">My Students</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/supervisor/students")}>
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {students.map(s => (
            <div key={s.id} className="p-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">{s.degreeLevel} · {s.projectTitle}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20">
                  <Progress value={s.progress} className="h-2" />
                </div>
                <span className="text-xs text-muted-foreground">{s.progress}%</span>
                <Badge variant={s.complianceStatus === "Critical" ? "destructive" : s.complianceStatus === "Warning" ? "outline" : "secondary"} className="text-xs">
                  {s.complianceStatus}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-muted-foreground mt-4">
        Note: You cannot add or invite students. Students are assigned by the Head of Department.
      </p>
    </div>
  );
};

export default SupervisorDashboard;
