import { useProject } from "@/context/ProjectContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Info,
  BookOpen,
  Database,
  Download,
  FlaskConical,
  FileText,
  Target,
  GraduationCap,
  Calendar,
} from "lucide-react";

const ProjectContextDrawer = () => {
  const { project } = useProject();

  const citedRefs = project.references.filter((r) => r.cited).length;
  const lastExport = project.exports.length > 0
    ? project.exports[project.exports.length - 1].createdAt
    : "No exports yet";

  const items = [
    { icon: FileText, label: "Title", value: project.title },
    { icon: GraduationCap, label: "Discipline", value: project.discipline },
    { icon: FlaskConical, label: "Methodology", value: project.methodologyType },
    { icon: Target, label: "Target Journal", value: project.targetJournal },
    { icon: BookOpen, label: "References", value: `${project.references.length} total · ${citedRefs} cited` },
    { icon: Database, label: "Dataset", value: project.dataset.uploaded ? project.dataset.name : "Not uploaded" },
    { icon: Download, label: "Last Export", value: lastExport },
    { icon: Calendar, label: "Last Updated", value: project.updatedAt },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Project Context"
          title="Project Context"
        >
          <Info className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="font-display text-lg">Project Context</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="capitalize text-xs border-primary/30 text-primary">
              {project.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{project.progress}% complete</span>
          </div>

          <Separator />

          <div className="space-y-4 pt-4">
            {items.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground leading-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="!mt-6" />

          {/* Sections summary */}
          <div className="pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Document Sections
            </p>
            <div className="space-y-2">
              {project.sections.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{s.order}. {s.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {s.content.split(/\s+/).length}w
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="!mt-6" />

          {/* Recent activity */}
          <div className="pt-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Recent Activity
            </p>
            <div className="space-y-2">
              {project.activities.slice(0, 5).map((a) => (
                <div key={a.id} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{a.user}</span>{" "}
                  {a.action} <span className="font-medium text-foreground">{a.target}</span>
                  <span className="block text-muted-foreground/70">{a.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectContextDrawer;
