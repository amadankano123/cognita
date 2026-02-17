import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FolderOpen, AlertTriangle, Bot, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminDashboard = () => {
  const { institution } = useInstitution();
  const navigate = useNavigate();

  const statusData = [
    { name: "Draft", value: institution.projects.filter(p => p.status === "draft").length },
    { name: "In Progress", value: institution.projects.filter(p => p.status === "in-progress").length },
    { name: "Review", value: institution.projects.filter(p => p.status === "review").length },
    { name: "Submitted", value: institution.projects.filter(p => p.status === "submitted").length },
    { name: "Exported", value: institution.projects.filter(p => p.status === "exported").length },
  ];

  const deptUsage = institution.departments.slice(0, 5).map(dept => ({
    name: dept.split(" ")[0],
    usage: institution.projects.filter(p => p.department === dept).reduce((acc, p) => acc + (p.aiUsageLevel === "High" ? 3 : p.aiUsageLevel === "Moderate" ? 2 : p.aiUsageLevel === "Low" ? 1 : 0), 0),
  }));

  const COLORS = ["hsl(var(--muted))", "hsl(var(--primary))", "hsl(var(--warning))", "hsl(var(--success))", "hsl(var(--accent))"];
  const alertColors: Record<string, string> = { critical: "bg-destructive text-destructive-foreground", warning: "bg-warning text-warning-foreground", info: "bg-accent text-accent-foreground" };

  const integrityAlerts = institution.projects.filter(p => p.integrityScore < 75).length;

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{institution.name}</h1>
        <p className="text-muted-foreground">Institutional Research Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Projects", value: institution.activeProjects, icon: FolderOpen, color: "text-primary" },
          { label: "Integrity Alerts", value: integrityAlerts, icon: AlertTriangle, color: "text-destructive" },
          { label: "AI Reviews This Month", value: institution.aiReviewsThisMonth, icon: Bot, color: "text-warning" },
          { label: "Publications", value: institution.publicationsThisYear, icon: FileText, color: "text-success" },
        ].map(kpi => (
          <Card key={kpi.label} className="p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* AI Usage by Department */}
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">AI Usage by Department</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptUsage}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="usage" fill="hsl(224, 64%, 33%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Project Status Breakdown */}
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Project Status Breakdown</h3>
          <div className="h-48 flex items-center justify-center gap-6">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-medium ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="shadow-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold">Recent Alerts</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/compliance")}>
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="divide-y divide-border">
          {institution.alerts.map(alert => (
            <button
              key={alert.id}
              onClick={() => alert.projectId ? navigate("/admin/projects") : undefined}
              className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/30 transition-colors"
            >
              <Badge className={`${alertColors[alert.type]} text-[10px] shrink-0 mt-0.5`}>{alert.type}</Badge>
              <div className="min-w-0">
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alert.timestamp}</p>
              </div>
              {alert.projectId && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
