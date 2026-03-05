import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, BarChart3, Shield, FileText, Building2 } from "lucide-react";
import { mockHodDepartment, mockDepartmentSupervisors, mockDepartmentStudents } from "@/data/mockHod";

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <Card className="p-5">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
    {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
  </Card>
);

const HodOverview = () => {
  const dept = mockHodDepartment;
  const supervisors = mockDepartmentSupervisors;
  const students = mockDepartmentStudents;
  const criticalStudents = students.filter(s => s.complianceStatus === "Critical");
  const warningStudents = students.filter(s => s.complianceStatus === "Warning");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Department Overview</h1>
        <p className="text-muted-foreground text-sm">{dept.departmentName} · {dept.faculty}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={`${dept.totalStudents}`} />
        <StatCard icon={UserCheck} label="Supervisors" value={`${dept.totalSupervisors}`} />
        <StatCard icon={BarChart3} label="Avg Progress" value={`${dept.avgProgress}%`} />
        <StatCard icon={Shield} label="Avg Integrity" value={`${dept.avgIntegrity}%`} />
      </div>

      {/* Projects by Stage */}
      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Projects by Stage
        </h3>
        <div className="space-y-3">
          {Object.entries(dept.projectsByStage).map(([stage, count]) => (
            <div key={stage} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{stage}</span>
              <div className="flex items-center gap-3">
                <Progress value={(count / dept.totalStudents) * 100} className="w-32 h-2" />
                <span className="text-sm font-medium text-foreground w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Supervisor Workload */}
      <Card className="p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" /> Supervisor Workload
        </h3>
        <div className="space-y-3">
          {supervisors.map(sup => (
            <div key={sup.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{sup.name}</p>
                <p className="text-xs text-muted-foreground">{sup.specialization}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{sup.studentCount}/{sup.maxCapacity} students</span>
                <Progress value={(sup.studentCount / sup.maxCapacity) * 100} className="w-20 h-2" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Alerts */}
      {(criticalStudents.length > 0 || warningStudents.length > 0) && (
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" /> Compliance Alerts
          </h3>
          <div className="space-y-2">
            {criticalStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.projectTitle}</p>
                </div>
                <Badge variant="destructive" className="text-xs">Critical</Badge>
              </div>
            ))}
            {warningStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.projectTitle}</p>
                </div>
                <Badge variant="secondary" className="text-xs">Warning</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HodOverview;
