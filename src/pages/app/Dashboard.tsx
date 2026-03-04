import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileEdit, BookOpen, BarChart3, Clock, ShieldCheck, Database, Download, Bot, ArrowRight, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { project, toggleChecklist } = useProject();
  const { user } = useAuth();
  const { institution } = useInstitution();
  const navigate = useNavigate();
  const nav = (path: string) => navigate(`/app/student/${path}`);

  // Supervisor assignment
  const assignment = institution.assignments.find(a => a.studentId === user?.id);
  const supervisor = assignment ? institution.users.find(u => u.id === assignment.supervisorId) : null;
  const isAssigned = !!supervisor;

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
      <PageHeader title="Student Dashboard" subtitle="Overview of your research project" breadcrumb={project.title} />

      {/* Supervisor Status Card */}
      <Card className="p-4 mb-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Supervisor</p>
              {isAssigned ? (
                <p className="text-xs text-muted-foreground">{supervisor?.name} · {supervisor?.academicTitle}</p>
              ) : (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Awaiting Supervisor Assignment
                </p>
              )}
            </div>
          </div>
          {user?.studentCategory && (
            <Badge variant="secondary">{user.studentCategory}</Badge>
          )}
        </div>
      </Card>

      <Card className="p-5 mb-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">{project.status}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">Integrity: {project.integrityScore}</span>
              {daysToDeadline !== null && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {daysToDeadline} days</span>
              )}
            </div>
            <h2 className="font-display text-lg font-semibold truncate">{project.title}</h2>
            <p className="text-sm text-muted-foreground">{project.discipline} · {project.targetOutput}</p>
          </div>
          <div className="sm:w-48">
            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Progress</span><span>{project.progress}%</span></div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </Card>

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

          {/* Request Review button (disabled if unassigned) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button className="w-full" size="lg" disabled={!isAssigned} onClick={() => nav("ai-reviewer")}>
                  <Bot className="h-4 w-4 mr-2" /> Send for Supervisor Review
                </Button>
              </div>
            </TooltipTrigger>
            {!isAssigned && (
              <TooltipContent>
                <p>You must be assigned a supervisor before requesting review</p>
              </TooltipContent>
            )}
          </Tooltip>
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
