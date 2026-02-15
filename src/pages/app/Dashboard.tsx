import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileEdit, BookOpen, BarChart3, Clock, Users, ShieldCheck, Database, Download, Bot, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { project, toggleChecklist } = useProject();
  const navigate = useNavigate();

  const daysToDeadline = project.deadline
    ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000))
    : null;

  const quickActions = [
    { label: "Editor", desc: "Write your proposal", icon: FileEdit, path: "/app/editor" },
    { label: "References", desc: "Manage citations", icon: BookOpen, path: "/app/references" },
    { label: "Data Upload", desc: "Add datasets", icon: Database, path: "/app/data" },
    { label: "AI Review", desc: "Run automated review", icon: Bot, path: "/app/ai-reviewer" },
    { label: "Export", desc: "Generate documents", icon: Download, path: "/app/export" },
    { label: "Plagiarism", desc: "Check integrity", icon: ShieldCheck, path: "/app/plagiarism" },
  ];

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your research project"
        breadcrumb={project.title}
      />

      {/* Project snapshot */}
      <Card className="p-5 mb-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
            <p className="text-sm text-muted-foreground">{project.discipline} · {project.targetOutput} · {project.targetJournal}</p>
          </div>
          <div className="sm:w-48">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Checklist + Sections */}
        <div className="lg:col-span-2 space-y-4">
          {/* Checklist */}
          <Card className="shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">Project Checklist</h3>
            </div>
            <div className="p-4 space-y-3">
              {project.checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleChecklist(item.id)}
                  />
                  <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Sections */}
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

          {/* Run Full Review */}
          <Button className="w-full" size="lg" onClick={() => navigate("/app/editor")}>
            <Bot className="h-4 w-4 mr-2" /> Run Full Review
          </Button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card className="shadow-card p-4">
            <h3 className="font-display font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <a.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                </button>
              ))}
            </div>
          </Card>

          {/* Team */}
          <Card className="shadow-card p-4">
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

          {/* Recent activity */}
          <Card className="shadow-card p-4">
            <h3 className="font-display font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {project.activities.slice(0, 3).map((a) => (
                <div key={a.id} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{a.user}</span>{" "}
                  {a.action} <span className="font-medium text-foreground">{a.target}</span>
                  <p className="text-muted-foreground mt-0.5">{a.timestamp}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
