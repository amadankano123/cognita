import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roleColors: Record<string, string> = {
  owner: "bg-primary text-primary-foreground",
  editor: "bg-accent text-accent-foreground",
  reviewer: "bg-warning text-warning-foreground",
  viewer: "bg-secondary text-secondary-foreground",
};

const Collaboration = () => {
  const { project } = useProject();

  return (
    <div className="max-w-4xl animate-fade-in">
      <PageHeader
        title="Collaboration"
        subtitle="Manage your research team"
        breadcrumb={project.title}
      />

      <div className="space-y-3">
        {project.collaborators.map((c) => (
          <Card key={c.id} className="p-4 shadow-card flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
              {c.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.email}</p>
            </div>
            <Badge className={roleColors[c.role] + " text-xs capitalize"}>{c.role}</Badge>
            <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
              Active {c.lastActive}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Collaboration;
