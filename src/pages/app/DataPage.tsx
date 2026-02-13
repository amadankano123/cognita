import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Database, FileSpreadsheet, Image, FileText } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "image/zip": Image,
  "image/tiff": Image,
  "text/csv": FileSpreadsheet,
  "application/xlsx": FileSpreadsheet,
};

const DataPage = () => {
  const { project } = useProject();

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Data & Files"
        subtitle="Manage datasets and supporting files"
        breadcrumb={project.title}
      />

      <div className="space-y-3">
        {project.dataFiles.map((f) => {
          const Icon = iconMap[f.type] || FileText;
          return (
            <Card key={f.id} className="p-4 shadow-card flex items-center gap-4">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{f.size}</p>
                <p className="text-xs text-muted-foreground">{f.uploadedAt}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DataPage;
