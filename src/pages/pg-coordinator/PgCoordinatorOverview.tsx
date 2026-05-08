import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, BookOpen, FolderKanban } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import { useInstitution } from "@/context/InstitutionContext";

const PgCoordinatorOverview = () => {
  const { institution } = useInstitution();
  const pgProjects = institution.projects;
  return (
    <div className="animate-fade-in">
      <PageHeading
        title="Postgraduate Coordination"
        subtitle="Master's & PhD cohort, supervisor allocation, and progression"
        badge={<Badge variant="outline" className="text-primary border-primary/30">PG Coordinator</Badge>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="PG Students" value={48} icon={GraduationCap} />
        <StatCard label="Active Theses" value={pgProjects.length} icon={BookOpen} />
        <StatCard label="Supervisors" value={12} icon={Users} />
        <StatCard label="Awaiting Allocation" value={3} icon={FolderKanban} tone="warning" />
      </div>
      <Card className="p-5 shadow-soft">
        <h3 className="font-display font-semibold mb-4">Cohort Overview</h3>
        <div className="space-y-2">
          {pgProjects.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.researcher} · {p.department}</p>
              </div>
              <Badge variant="secondary" className="capitalize">{p.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PgCoordinatorOverview;
