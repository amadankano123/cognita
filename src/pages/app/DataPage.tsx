import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileSpreadsheet, Image, FileText, Upload, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  "image/zip": Image,
  "image/tiff": Image,
  "text/csv": FileSpreadsheet,
  "application/xlsx": FileSpreadsheet,
};

const DataPage = () => {
  const { project, uploadDataset } = useProject();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Data & Files"
        subtitle="Manage datasets and supporting files"
        breadcrumb={project.title}
      />

      {/* Upload area */}
      {!project.dataset.uploaded ? (
        <Card className="shadow-card mb-6 p-8 border-2 border-dashed border-primary/30 text-center">
          <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-display font-semibold mb-1">Upload Dataset</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload your CSV file to begin analysis</p>
          <Button onClick={uploadDataset}>
            <Database className="h-4 w-4 mr-2" /> Upload Demo CSV
          </Button>
        </Card>
      ) : (
        <Card className="shadow-card mb-6 animate-fade-in">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-success/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">{project.dataset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.dataset.columns.length} columns · {project.dataset.previewRows.length} preview rows
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate("/app/analysis")}>
              Continue to Analysis <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Column info */}
          <div className="p-4 border-b border-border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Columns</h4>
            <div className="flex flex-wrap gap-2">
              {project.dataset.columns.map((col) => (
                <span key={col.name} className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium">
                  {col.name} <span className="text-muted-foreground">({col.type})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Preview table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {project.dataset.columns.map((col) => (
                    <th key={col.name} className="text-left p-3 text-xs font-medium text-muted-foreground">{col.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {project.dataset.previewRows.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    {project.dataset.columns.map((col) => (
                      <td key={col.name} className="p-3 text-xs">{String(row[col.name])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Existing files */}
      <h3 className="font-display font-semibold mb-3">Uploaded Files</h3>
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
