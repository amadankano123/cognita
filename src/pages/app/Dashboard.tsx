import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileEdit, BookOpen, BarChart3, AlertTriangle, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { project } = useProject();
  const navigate = useNavigate();

  const criticalIssues = project.reviewIssues.filter((i) => i.severity === "critical").length;
  const daysToDeadline = project.deadline
    ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000))
    : null;

  const stats = [
    { label: "Word Count", value: `${project.wordCount.toLocaleString()} / ${project.targetWordCount.toLocaleString()}`, icon: FileEdit, onClick: () => navigate("/app/editor") },
    { label: "References", value: project.references.length, icon: BookOpen, onClick: () => navigate("/app/references") },
    { label: "Analyses", value: project.analysisResults.length, icon: BarChart3, onClick: () => navigate("/app/analysis") },
    { label: "Review Issues", value: criticalIssues > 0 ? `${criticalIssues} critical` : "None critical", icon: AlertTriangle, onClick: () => navigate("/app/ai-reviewer") },
  ];

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your research project"
        breadcrumb={project.title}
      />

      {/* Status banner */}
      <Card className="p-4 mb-6 shadow-card flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{project.status}</span>
            {daysToDeadline !== null && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {daysToDeadline} days to deadline
              </span>
            )}
          </div>
          <h2 className="font-display text-lg font-semibold truncate">{project.title}</h2>
          <p className="text-sm text-muted-foreground truncate">{project.subtitle}</p>
        </div>
        <div className="sm:w-48">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="p-4 shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
            onClick={s.onClick}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <s.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <p className="text-xl font-semibold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent sections */}
      <Card className="shadow-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold">Proposal Sections</h3>
          <button onClick={() => navigate("/app/editor")} className="text-sm text-primary hover:underline">
            Open Editor →
          </button>
        </div>
        <div className="divide-y divide-border">
          {project.sections.map((s) => (
            <div key={s.id} className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium">{s.title}</span>
              <span className="text-xs text-muted-foreground">{s.content.split(/\s+/).length} words</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Collaborators preview */}
      <Card className="shadow-card mt-4 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" /> Team
          </h3>
          <button onClick={() => navigate("/app/collaboration")} className="text-sm text-primary hover:underline">
            Manage →
          </button>
        </div>
        <div className="flex -space-x-2">
          {project.collaborators.map((c) => (
            <div
              key={c.id}
              className="h-8 w-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
              title={c.name}
            >
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
