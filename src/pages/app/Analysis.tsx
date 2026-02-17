import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Play, Save, FileEdit, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ContextAwareIndicator from "@/components/layout/ContextAwareIndicator";

const statusColors: Record<string, string> = { completed: "bg-success text-success-foreground", running: "bg-warning text-warning-foreground", pending: "bg-secondary text-secondary-foreground", failed: "bg-destructive text-destructive-foreground" };

const Analysis = () => {
  const { project, addAnalysisResult } = useProject();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const pid = projectId || project.id;
  const nav = (path: string) => navigate(`/app/${pid}/${path}`);
  const [analysisType, setAnalysisType] = useState("Regression");
  const [dependent, setDependent] = useState("confidence_score");
  const [independent, setIndependent] = useState("model_prediction");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ rSquared: number; pValue: number; interpretation: string } | null>(null);

  const handleRun = () => {
    setRunning(true); setProgress(0); setResult(null);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval); setRunning(false);
          setResult({ rSquared: 0.82, pValue: 0.002, interpretation: "The regression model shows a statistically significant relationship (p < 0.05). The model explains 82% of variance." });
          return 100;
        }
        return prev + Math.random() * 20 + 5;
      });
    }, 400);
  };

  const handleSave = () => {
    addAnalysisResult({ id: `a${Date.now()}`, title: `${analysisType}: ${dependent} ~ ${independent}`, type: analysisType, status: "completed", summary: `R² = ${result!.rSquared}, p = ${result!.pValue}. ${result!.interpretation}`, createdAt: new Date().toISOString().split("T")[0], rSquared: result!.rSquared, pValue: result!.pValue, interpretation: result!.interpretation });
    nav("results");
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <PageHeader title="Analysis Studio" subtitle="Run statistical analyses on your data" breadcrumb={project.title} />
        <ContextAwareIndicator />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-card p-5 lg:col-span-1">
          <h3 className="font-display font-semibold mb-4">Configure Analysis</h3>
          <div className="space-y-4">
            <div><Label>Analysis Type</Label><Select value={analysisType} onValueChange={setAnalysisType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Descriptive">Descriptive</SelectItem><SelectItem value="T-test">T-test</SelectItem><SelectItem value="ANOVA">ANOVA</SelectItem><SelectItem value="Regression">Regression</SelectItem><SelectItem value="Correlation">Correlation</SelectItem></SelectContent></Select></div>
            {analysisType === "Regression" && (<><div><Label>Dependent Variable</Label><Select value={dependent} onValueChange={setDependent}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{project.dataset.columns.filter(c => c.type === "number").map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Independent Variable</Label><Select value={independent} onValueChange={setIndependent}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{project.dataset.columns.filter(c => c.name !== dependent).map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div></>)}
            <Button className="w-full" onClick={handleRun} disabled={running}><Play className="h-4 w-4 mr-2" /> {running ? "Running…" : `Run ${analysisType}`}</Button>
            {running && <div><Progress value={Math.min(progress, 100)} className="h-2 mb-1" /><p className="text-xs text-muted-foreground">Processing…</p></div>}
          </div>
        </Card>
        <div className="lg:col-span-2 space-y-4">
          {result && (
            <Card className="shadow-card p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="h-5 w-5 text-success" /><h3 className="font-display font-semibold">Results</h3></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center"><p className="text-3xl font-bold text-primary">{result.rSquared}</p><p className="text-xs text-muted-foreground mt-1">R²</p></div>
                <div className="bg-muted/50 rounded-lg p-4 text-center"><p className="text-3xl font-bold text-primary">{result.pValue}</p><p className="text-xs text-muted-foreground mt-1">p-value</p></div>
              </div>
              <div className="bg-accent/30 rounded-lg p-4 mb-4"><h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">AI Interpretation</h4><p className="text-sm leading-relaxed">{result.interpretation}</p></div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save to Results</Button>
                <Button variant="outline" size="sm" onClick={() => nav("editor")}><FileEdit className="h-4 w-4 mr-1" /> Insert into Document</Button>
              </div>
            </Card>
          )}
          <Card className="shadow-card">
            <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Previous Analyses</h3></div>
            <div className="divide-y divide-border">
              {project.analysisResults.map(a => (
                <div key={a.id} className="p-4">
                  <div className="flex items-center justify-between mb-1"><h4 className="font-medium text-sm">{a.title}</h4><Badge className={statusColors[a.status] + " text-xs"}>{a.status}</Badge></div>
                  <p className="text-xs text-muted-foreground">{a.type} · {a.createdAt}</p>
                  {a.summary && <p className="text-sm mt-2">{a.summary}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
