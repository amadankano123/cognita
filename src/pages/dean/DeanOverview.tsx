import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, FolderKanban, ShieldCheck, Activity } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import { useInstitution } from "@/context/InstitutionContext";
import { useInstitutionConfig } from "@/context/InstitutionConfigContext";

const DeanOverview = () => {
  const { institution } = useInstitution();
  const { config } = useInstitutionConfig();
  const faculty = config.faculties[0];
  const facultyDeptIds = new Set(faculty.departments.map((d) => d.name));
  const facultyProjects = institution.projects.filter((p) => facultyDeptIds.has(p.department));

  return (
    <div className="animate-fade-in">
      <PageHeading
        title={`${faculty.name}`}
        subtitle="Faculty-wide research oversight"
        badge={<Badge variant="outline" className="text-primary border-primary/30">Dean</Badge>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Departments" value={faculty.departments.length} icon={Building2} />
        <StatCard label="Active Projects" value={facultyProjects.length} icon={FolderKanban} tone="default" />
        <StatCard label="Researchers" value={institution.totalResearchers} icon={Users} />
        <StatCard label="Avg. Integrity" value={`${Math.round(facultyProjects.reduce((a, p) => a + p.integrityScore, 0) / Math.max(1, facultyProjects.length))}%`} icon={ShieldCheck} tone="success" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Departments</h3>
          <div className="space-y-2">
            {faculty.departments.map((d) => {
              const count = institution.projects.filter((p) => p.department === d.name).length;
              return (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.hodId ? "HOD assigned" : "No HOD"}</p>
                  </div>
                  <Badge variant="secondary">{count} projects</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Faculty Activity</h3>
          <div className="space-y-3">
            {facultyProjects.slice(0, 5).map((p) => (
              <div key={p.id} className="text-sm border-l-2 border-primary/40 pl-3">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.researcher} · {p.department} · {p.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeanOverview;
