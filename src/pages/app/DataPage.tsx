import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, FileSpreadsheet, Image, FileText, ArrowRight, Check, BarChart3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import DataInputHub from "@/components/analysis/DataInputHub";

const iconMap: Record<string, React.ElementType> = {
  "image/zip": Image,
  "image/tiff": Image,
  "text/csv": FileSpreadsheet,
  "application/xlsx": FileSpreadsheet,
};

const DataPage = () => {
  const { project } = useProject();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const pid = projectId || project.id;
  const nav = (path: string) => navigate(`/app/${pid}/${path}`);

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <PageHeader
          title="Data & Analysis"
          subtitle="Import, verify, and prepare data for statistical analysis"
          breadcrumb={project.title}
        />
        {project.dataset.uploaded && (
          <Button onClick={() => nav("analysis")}>
            <BarChart3 className="h-4 w-4 mr-2" /> Analysis Studio
          </Button>
        )}
      </div>

      {/* Data Input Hub */}
      <div className="mb-6">
        <DataInputHub onDataReady={() => nav("analysis")} />
      </div>

      {/* Uploaded Files */}
      {project.dataFiles.length > 0 && (
        <div>
          <h3 className="font-display font-semibold mb-3">Supporting Files</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {project.dataFiles.map(f => {
              const Icon = iconMap[f.type] || FileText;
              return (
                <Card key={f.id} className="p-4 shadow-card flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
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
      )}
    </div>
  );
};

export default DataPage;
