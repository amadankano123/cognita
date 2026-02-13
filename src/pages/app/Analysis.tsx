import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  completed: "bg-success text-success-foreground",
  running: "bg-warning text-warning-foreground",
  pending: "bg-secondary text-secondary-foreground",
  failed: "bg-destructive text-destructive-foreground",
};

const Analysis = () => {
  const { project } = useProject();

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Analysis"
        subtitle="Statistical and ML analyses for your data"
        breadcrumb={project.title}
      />

      <div className="space-y-3">
        {project.analysisResults.map((a) => (
          <Card key={a.id} className="p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">{a.title}</h3>
              <Badge className={statusColors[a.status] + " text-xs"}>{a.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Type: {a.type} · Created: {a.createdAt}</p>
            {a.summary && <p className="text-sm mt-2 text-foreground">{a.summary}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analysis;
