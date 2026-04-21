import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileEdit, BookOpen, BarChart3, Clock, Users, ShieldCheck, Database, Download, Bot, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { RESEARCHER_ROLES } from "@/types/research";

const Dashboard = () => {
  const { project, toggleChecklist } = useProject();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const pid = projectId || project.id;
  const nav = (path: string) => navigate(`/app/${pid}/${path}`);

  const isStudent = ["Undergraduate Student", "Master's Student", "PhD Student"].includes(role);

  // Supervisor info for students (linked to mockSupervisor data)
  const supervisorInfo = isStudent ? {
    name: "Prof. Kwame Mwangi",
    email: "k.mwangi@university.ac",
    department: "Computer Science",
    specialization: "Machine Learning & Data Privacy",
  } : null;

  const daysToDeadline = project.deadline
    ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000))
    : null;

  const quickActions = [
    { label: "Editor", desc: "Write your document", icon: FileEdit, path: "editor" },
    { label: "References", desc: "Manage citations", icon: BookOpen, path: "references" },
    { label: "Data Upload", desc: "Add datasets", icon: Database, path: "data" },
    { label: "AI Review", desc: "Run automated review", icon: Bot, path: "ai-reviewer" },
    { label: "Export", desc: "Generate documents", icon: Download, path: "export" },
    { label: "Plagiarism", desc: "Check integrity", icon: ShieldCheck, path: "plagiarism" },
  ];

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${user?.name || "Researcher"}`} breadcrumb={project.title} />

      {/* Hero project card with gradient accent */}
      <Card className="relative overflow-hidden p-6 mb-6 shadow-soft border-l-4 border-l-primary">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize ring-1 ring-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {project.status}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-success/10 text-success font-semibold ring-1 ring-success/20">Integrity: {project.integrityScore}</span>
              {isStudent && <Badge variant="outline" className="text-xs">{role}</Badge>}
              {daysToDeadline !== null && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {daysToDeadline} days left</span>
              )}
            </div>
            <h2 className="font-display text-xl font-semibold truncate mb-1">{project.title}</h2>
            <p className="text-sm text-muted-foreground">{project.discipline} · {project.targetOutput} · {project.targetJournal}</p>
          </div>
          <div className="sm:w-56 shrink-0">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-primary font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2.5" />
          </div>
        </div>
      </Card>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Sections", value: project.sections.length, icon: FileEdit, color: "from-blue-500/15 to-indigo-500/5", iconColor: "text-blue-600" },
          { label: "References", value: project.references?.length || 0, icon: BookOpen, color: "from-emerald-500/15 to-teal-500/5", iconColor: "text-emerald-600" },
          { label: "Collaborators", value: project.collaborators.length, icon: Users, color: "from-amber-500/15 to-orange-500/5", iconColor: "text-amber-600" },
          { label: "Activities", value: project.activities.length, icon: BarChart3, color: "from-purple-500/15 to-fuchsia-500/5", iconColor: "text-purple-600" },
        ].map((s) => (
          <Card key={s.label} className={`relative overflow-hidden p-4 shadow-card hover:shadow-soft transition-shadow bg-gradient-to-br ${s.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{s.label}</p>
                <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-card flex items-center justify-center shadow-card">
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Supervisor Card for students */}
      {isStudent && supervisorInfo && (
        <Card className="p-5 mb-6 shadow-soft border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow shrink-0">
              {supervisorInfo.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Assigned Supervisor</p>
              </div>
              <p className="text-base font-semibold">{supervisorInfo.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{supervisorInfo.specialization} · {supervisorInfo.email}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-card">
            <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Project Checklist</h3></div>
            <div className="p-4 space-y-3">
              {project.checklist.map(item => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox checked={item.checked} onCheckedChange={() => toggleChecklist(item.id)} />
                  <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.label}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="shadow-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-semibold">Document Sections</h3>
              <button onClick={() => nav("editor")} className="text-sm text-primary hover:underline">Open Editor →</button>
            </div>
            <div className="divide-y divide-border">
              {project.sections.map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{s.title}</span>
                  <span className="text-xs text-muted-foreground">{s.content.split(/\s+/).length} words</span>
                </div>
              ))}
            </div>
          </Card>

          <Button className="w-full" size="lg" onClick={() => nav("ai-reviewer")}>
            <Bot className="h-4 w-4 mr-2" /> Run Full Review
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="shadow-card p-4">
            <h3 className="font-display font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map(a => (
                <button key={a.label} onClick={() => nav(a.path)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left">
                  <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0"><a.icon className="h-4 w-4 text-primary" /></div>
                  <div className="min-w-0"><p className="text-sm font-medium">{a.label}</p><p className="text-xs text-muted-foreground">{a.desc}</p></div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto shrink-0" />
                </button>
              ))}
            </div>
          </Card>

          <Card className="shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Team</h3>
              <button onClick={() => nav("collaboration")} className="text-sm text-primary hover:underline">Manage →</button>
            </div>
            <div className="flex -space-x-2">
              {project.collaborators.map(c => (
                <div key={c.id} className="h-8 w-8 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-xs font-medium text-primary" title={c.name}>
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
              ))}
            </div>
          </Card>

          <Card className="shadow-card p-4">
            <h3 className="font-display font-semibold mb-3">Activity Log</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {project.activities.slice(0, 10).map((a, i) => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{a.user}</span> {a.action} <span className="font-medium text-foreground">{a.target}</span>
                    <p className="text-muted-foreground/70 mt-0.5">{a.timestamp}</p>
                  </div>
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
