import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, BarChart3, FileEdit, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const { project } = useProject();
  const navigate = useNavigate();
  const completedAnalyses = project.analysisResults.filter((a) => a.status === "completed");

  const tables = [
    { id: "t1", title: "Table 1: Regression Results (confidence_score ~ model_prediction)", caption: "Linear regression output showing R² = 0.82, p = 0.002" },
    { id: "t2", title: "Table 2: Spectral Index Correlations", caption: "Pearson correlation coefficients between vegetation indices and disease presence" },
  ];

  const figures = [
    { id: "f1", title: "Figure 1: Confidence Score Distribution", caption: "Distribution of model confidence scores across disease categories" },
  ];

  const [selectedItem, setSelectedItem] = useState<string>("t1");
  const [editingCaption, setEditingCaption] = useState("");

  const allItems = [...tables.map((t) => ({ ...t, type: "table" })), ...figures.map((f) => ({ ...f, type: "figure" }))];
  const selected = allItems.find((i) => i.id === selectedItem);

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Results Builder"
        subtitle="Manage tables, figures, and findings"
        breadcrumb={project.title}
      />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Project Completion</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-primary">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2 mb-3" />
          <p className="text-sm text-muted-foreground">
            {project.wordCount.toLocaleString()} of {project.targetWordCount.toLocaleString()} target words
          </p>
        </Card>
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Results Repository</h3>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-bold text-primary">{tables.length}</p>
              <p className="text-sm text-muted-foreground">Tables</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{figures.length}</p>
              <p className="text-sm text-muted-foreground">Figures</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Item list */}
        <Card className="shadow-card lg:col-span-1">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold text-sm">Tables</h3>
          </div>
          <div className="py-1">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedItem(t.id); setEditingCaption(t.caption); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                  selectedItem === t.id ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Table className="h-4 w-4 shrink-0" />
                <span className="truncate">{t.title}</span>
              </button>
            ))}
          </div>
          <div className="p-4 border-b border-t border-border">
            <h3 className="font-display font-semibold text-sm">Figures</h3>
          </div>
          <div className="py-1">
            {figures.map((f) => (
              <button
                key={f.id}
                onClick={() => { setSelectedItem(f.id); setEditingCaption(f.caption); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2 ${
                  selectedItem === f.id ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span className="truncate">{f.title}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Detail */}
        <Card className="shadow-card lg:col-span-2 p-5">
          {selected && (
            <div className="animate-fade-in">
              <h3 className="font-display font-semibold mb-2">{selected.title}</h3>

              {/* Placeholder visualization */}
              <div className="bg-muted rounded-lg h-48 flex items-center justify-center mb-4 border border-border">
                {selected.type === "table" ? (
                  <div className="text-center text-muted-foreground">
                    <Table className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">[Table Data Visualization]</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">[Chart Placeholder]</p>
                  </div>
                )}
              </div>

              {/* Caption editor */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Caption</label>
                <Input
                  value={editingCaption}
                  onChange={(e) => setEditingCaption(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate("/app/editor")}>
                  <FileEdit className="h-4 w-4 mr-1" /> Insert into Document
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export Table
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Results;
