import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, FileDown, Code, Check, Download } from "lucide-react";

type Format = "docx" | "pdf" | "latex";
type CitationStyle = "apa" | "ieee" | "chicago";

const formats: { id: Format; label: string; icon: React.ElementType; ext: string }[] = [
  { id: "docx", label: "Microsoft Word", icon: FileText, ext: ".docx" },
  { id: "pdf", label: "PDF Document", icon: FileDown, ext: ".pdf" },
  { id: "latex", label: "LaTeX Source", icon: Code, ext: ".tex" },
];

const Export = () => {
  const { project, addExport } = useProject();
  const [selected, setSelected] = useState<Format>("pdf");
  const [citationStyle, setCitationStyle] = useState<CitationStyle>("apa");
  const [includeCover, setIncludeCover] = useState(true);
  const [includeToc, setIncludeToc] = useState(true);
  const [includeFigures, setIncludeFigures] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const fileName = `AI_Disease_Detection_Manuscript${formats.find((f) => f.id === selected)?.ext}`;

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
          addExport({
            id: `exp-${Date.now()}`,
            format: selected.toUpperCase(),
            citationStyle: citationStyle.toUpperCase(),
            fileName,
            createdAt: new Date().toISOString().split("T")[0],
          });
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader
        title="Export Center"
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

      {/* Options */}
      <Card className="p-5 shadow-card mb-6">
        <h3 className="font-display font-semibold mb-4">Export Options</h3>

        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Citation Style</Label>
          <RadioGroup value={citationStyle} onValueChange={(v) => setCitationStyle(v as CitationStyle)} className="flex gap-4">
            <div className="flex items-center gap-2"><RadioGroupItem value="apa" id="cs-apa" /><Label htmlFor="cs-apa" className="font-normal">APA</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="ieee" id="cs-ieee" /><Label htmlFor="cs-ieee" className="font-normal">IEEE</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="chicago" id="cs-chi" /><Label htmlFor="cs-chi" className="font-normal">Chicago</Label></div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={includeCover} onCheckedChange={(v) => setIncludeCover(!!v)} />
            <span className="text-sm">Include cover page</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={includeToc} onCheckedChange={(v) => setIncludeToc(!!v)} />
            <span className="text-sm">Include table of contents</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={includeFigures} onCheckedChange={(v) => setIncludeFigures(!!v)} />
            <span className="text-sm">Embed figures inline</span>
          </label>
        </div>
      </Card>

      {/* Export action */}
      <Card className="p-5 shadow-card">
        {!exporting && !done && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Generate your full proposal as {formats.find((f) => f.id === selected)?.label} with {citationStyle.toUpperCase()} citations.
            </p>
            <Button onClick={handleExport} size="lg">
              Generate Export
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
            <p className="text-sm text-muted-foreground mb-4">{fileName}</p>
            <Button variant="outline" onClick={(e) => e.preventDefault()}>
              <Download className="h-4 w-4 mr-2" /> Download {fileName}
            </Button>
          </div>
        )}
      </Card>

      {/* Export history */}
      {project.exports.length > 0 && (
        <Card className="shadow-card mt-6">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold">Export History</h3>
          </div>
          <div className="divide-y divide-border">
            {project.exports.map((exp) => (
              <div key={exp.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{exp.fileName}</p>
                  <p className="text-xs text-muted-foreground">{exp.format} · {exp.citationStyle} · {exp.createdAt}</p>
                </div>
                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Export;
