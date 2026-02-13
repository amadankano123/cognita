import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, FileDown, Code, Check } from "lucide-react";

type Format = "docx" | "pdf" | "latex";

const formats: { id: Format; label: string; icon: React.ElementType; ext: string }[] = [
  { id: "docx", label: "Microsoft Word", icon: FileText, ext: ".docx" },
  { id: "pdf", label: "PDF Document", icon: FileDown, ext: ".pdf" },
  { id: "latex", label: "LaTeX Source", icon: Code, ext: ".tex" },
];

const Export = () => {
  const { project } = useProject();
  const [selected, setSelected] = useState<Format>("pdf");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setDone(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          setDone(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader
        title="Export"
        subtitle="Generate publication-ready documents"
        breadcrumb={project.title}
      />

      {/* Format selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {formats.map((f) => (
          <Card
            key={f.id}
            className={`p-4 shadow-card cursor-pointer transition-all text-center ${
              selected === f.id ? "ring-2 ring-primary" : "hover:shadow-elevated"
            }`}
            onClick={() => { setSelected(f.id); setDone(false); }}
          >
            <f.icon className={`h-8 w-8 mx-auto mb-2 ${selected === f.id ? "text-primary" : "text-muted-foreground"}`} />
            <p className="font-medium text-sm">{f.label}</p>
            <p className="text-xs text-muted-foreground">{f.ext}</p>
          </Card>
        ))}
      </div>

      {/* Export action */}
      <Card className="p-5 shadow-card">
        {!exporting && !done && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Export your full proposal as a {formats.find((f) => f.id === selected)?.label} file including all sections and references.
            </p>
            <Button onClick={handleExport} size="lg">
              Generate {selected.toUpperCase()}
            </Button>
          </div>
        )}

        {exporting && (
          <div>
            <p className="text-sm font-medium mb-3">Generating {selected.toUpperCase()}…</p>
            <Progress value={Math.min(progress, 100)} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {progress < 30 ? "Compiling sections…" : progress < 60 ? "Formatting references…" : progress < 90 ? "Applying styles…" : "Finalizing…"}
            </p>
          </div>
        )}

        {done && (
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6 text-success" />
            </div>
            <p className="font-medium mb-1">Export Complete</p>
            <p className="text-sm text-muted-foreground mb-4">Your document is ready to download.</p>
            <Button variant="outline" asChild>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Download {project.title.slice(0, 30)}…{formats.find((f) => f.id === selected)?.ext}
              </a>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Export;
