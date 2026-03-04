import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/layout/PageHeader";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  "in-progress": "bg-primary/10 text-primary",
  review: "bg-accent text-accent-foreground",
  submitted: "bg-primary text-primary-foreground",
  exported: "bg-muted text-muted-foreground",
};

const HodProjects = () => {
  const { institution } = useInstitution();
  const { user } = useAuth();
  const projects = institution.projects.filter(p => p.department === user?.department);

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Department Projects" subtitle={`All research projects in ${user?.department || "your department"}`} />
      <Card className="shadow-card">
        <div className="divide-y divide-border">
          {projects.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No projects in this department yet.</p>
          ) : (
            projects.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.researcher} · Updated {p.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`text-xs ${statusColors[p.status] || ""}`}>{p.status}</Badge>
                  <span className="text-xs text-muted-foreground">Integrity: {p.integrityScore}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default HodProjects;
