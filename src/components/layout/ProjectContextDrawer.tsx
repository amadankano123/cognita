import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Info, BookOpen, Database, Download, FlaskConical, FileText, Target,
  GraduationCap, Calendar, Users, Shield, BarChart3, Building2, Bell,
} from "lucide-react";
import { ADMIN_ROLES } from "@/types/research";
import { mockSupervisedStudents } from "@/data/mockSupervisor";
import { mockInstitution } from "@/data/mockInstitution";

/* ── Shared item row ── */
const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground leading-tight">{value}</p>
    </div>
  </div>
);

/* ── Researcher drawer ── */
const ResearcherDrawerContent = () => {
  const { project } = useProject();
  const citedRefs = project.references.filter((r) => r.cited).length;
  const lastExport = project.exports.length > 0
    ? project.exports[project.exports.length - 1].createdAt
    : "No exports yet";

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="capitalize text-xs border-primary/30 text-primary">{project.status}</Badge>
        <span className="text-xs text-muted-foreground">{project.progress}% complete</span>
      </div>
      <Separator />
      <div className="space-y-4 pt-4">
        <InfoRow icon={FileText} label="Title" value={project.title} />
        <InfoRow icon={GraduationCap} label="Discipline" value={project.discipline} />
        <InfoRow icon={FlaskConical} label="Methodology" value={project.methodologyType} />
        <InfoRow icon={Target} label="Target Journal" value={project.targetJournal} />
        <InfoRow icon={BookOpen} label="References" value={`${project.references.length} total · ${citedRefs} cited`} />
        <InfoRow icon={Database} label="Dataset" value={project.dataset.uploaded ? project.dataset.name : "Not uploaded"} />
        <InfoRow icon={Download} label="Last Export" value={lastExport} />
        <InfoRow icon={Calendar} label="Last Updated" value={project.updatedAt} />
      </div>
      <Separator className="!mt-6" />
      <div className="pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Document Sections</p>
        <div className="space-y-2">
          {project.sections.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{s.order}. {s.title}</span>
              <span className="text-xs text-muted-foreground">{s.content.split(/\s+/).length}w</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ── Supervisor drawer ── */
const SupervisorDrawerContent = () => {
  const { user } = useAuth();
  const students = mockSupervisedStudents;
  const totalStudents = students.length;
  const byDegree = {
    PhD: students.filter((s) => s.degreeLevel === "PhD").length,
    "Master's": students.filter((s) => s.degreeLevel === "Master's").length,
    Undergraduate: students.filter((s) => s.degreeLevel === "Undergraduate").length,
  };
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / totalStudents);
  const criticalCount = students.filter((s) => s.complianceStatus === "Critical").length;
  const warningCount = students.filter((s) => s.complianceStatus === "Warning").length;
  const unreadNotifs = students.reduce((a, s) => a + s.notifications.filter((n) => !n.read).length, 0);

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs border-primary/30 text-primary">Supervisor</Badge>
        <span className="text-xs text-muted-foreground">{user?.name}</span>
      </div>
      <Separator />
      <div className="space-y-4 pt-4">
        <InfoRow icon={Users} label="Total Students" value={`${totalStudents}`} />
        <InfoRow icon={GraduationCap} label="PhD Students" value={`${byDegree.PhD}`} />
        <InfoRow icon={GraduationCap} label="Master's Students" value={`${byDegree["Master's"]}`} />
        <InfoRow icon={GraduationCap} label="Undergraduate" value={`${byDegree.Undergraduate}`} />
        <InfoRow icon={BarChart3} label="Avg Progress" value={`${avgProgress}%`} />
        <InfoRow icon={Shield} label="Critical Alerts" value={`${criticalCount}`} />
        <InfoRow icon={Bell} label="Warnings" value={`${warningCount}`} />
        <InfoRow icon={Bell} label="Unread Notifications" value={`${unreadNotifs}`} />
      </div>
      <Separator className="!mt-6" />
      <div className="pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Students Needing Attention</p>
        <div className="space-y-2">
          {students
            .filter((s) => s.complianceStatus !== "Good")
            .map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{s.name}</span>
                <Badge variant={s.complianceStatus === "Critical" ? "destructive" : "secondary"} className="text-[10px]">
                  {s.complianceStatus}
                </Badge>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

/* ── Admin drawer ── */
const AdminDrawerContent = () => {
  const { user } = useAuth();
  const inst = mockInstitution;

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className="text-xs border-primary/30 text-primary">{user?.role}</Badge>
        <span className="text-xs text-muted-foreground">{user?.name}</span>
      </div>
      <Separator />
      <div className="space-y-4 pt-4">
        <InfoRow icon={Building2} label="Institution" value={inst.name} />
        <InfoRow icon={Users} label="Total Researchers" value={`${inst.totalResearchers}`} />
        <InfoRow icon={FileText} label="Active Projects" value={`${inst.activeProjects}`} />
        <InfoRow icon={BookOpen} label="Publications (Year)" value={`${inst.publicationsThisYear}`} />
        <InfoRow icon={FlaskConical} label="AI Reviews (Month)" value={`${inst.aiReviewsThisMonth}`} />
        <InfoRow icon={Building2} label="Departments" value={`${inst.departments.length}`} />
        <InfoRow icon={Shield} label="Active Alerts" value={`${inst.alerts.length}`} />
      </div>
      <Separator className="!mt-6" />
      <div className="pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recent Alerts</p>
        <div className="space-y-2">
          {inst.alerts.slice(0, 4).map((a) => (
            <div key={a.id} className="text-xs text-muted-foreground">
              <Badge variant={a.type === "critical" ? "destructive" : a.type === "warning" ? "secondary" : "outline"} className="text-[10px] mr-1.5">
                {a.type}
              </Badge>
              <span>{a.message}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

/* ── Main Drawer Component ── */
const ProjectContextDrawer = () => {
  const { role } = useAuth();
  const isAdmin = role === "Research Director";
  const isHod = role === "Head of Department";
  const isSupervisor = role === "Supervisor";

  const drawerTitle = isAdmin
    ? "Institution Overview"
    : isSupervisor
      ? "Supervision Summary"
      : "Project Context";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Context Info" title={drawerTitle}>
          <Info className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="font-display text-lg">{drawerTitle}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-1">
          {isAdmin ? (
            <AdminDrawerContent />
          ) : isSupervisor ? (
            <SupervisorDrawerContent />
          ) : (
            <ResearcherDrawerContent />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectContextDrawer;
