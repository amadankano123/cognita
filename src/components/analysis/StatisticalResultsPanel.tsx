import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, Save, FileEdit, MessageSquare, BarChart3, Table2,
  BookOpen, AlertTriangle, Sparkles, Copy, Eye,
} from "lucide-react";
import { useState } from "react";

interface StatResult {
  testName: string;
  sampleSize: number;
  degreesOfFreedom?: string;
  testStatistic: { label: string; value: number };
  pValue: number;
  confidenceInterval?: string;
  effectSize?: { label: string; value: number; interpretation: string };
  assumptions: { name: string; met: boolean; note: string }[];
  interpretation: string;
  plainExplanation: string;
  draftResultsText: string;
  draftDiscussionText: string;
  suggestedFollowUp?: string;
}

interface Props {
  result: StatResult | null;
  running: boolean;
  progress: number;
  onSave: () => void;
  onInsertIntoDocument: () => void;
}

const StatisticalResultsPanel = ({ result, running, progress, onSave, onInsertIntoDocument }: Props) => {
  const [viewMode, setViewMode] = useState<"summary" | "detailed" | "writing">("summary");

  if (running) {
    return (
      <Card className="shadow-card p-8 text-center">
        <BarChart3 className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="font-display font-semibold mb-2">Running Analysis…</h3>
        <p className="text-sm text-muted-foreground mb-4">Checking assumptions and computing results</p>
        <Progress value={Math.min(progress, 100)} className="h-2 max-w-sm mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">{progress < 30 ? "Validating assumptions…" : progress < 60 ? "Computing test statistics…" : progress < 85 ? "Generating interpretation…" : "Finalising results…"}</p>
      </Card>
    );
  }

  if (!result) return null;

  const significant = result.pValue < 0.05;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <Card className="shadow-card">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <h3 className="font-display font-semibold">{result.testName}</h3>
            <Badge className={significant ? "bg-success/10 text-success border-success/30" : "bg-warning/10 text-warning border-warning/30"} variant="outline">
              {significant ? "Statistically Significant" : "Not Significant"}
            </Badge>
          </div>
          <div className="flex gap-1">
            {(["summary", "detailed", "writing"] as const).map(mode => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                className="text-xs capitalize"
                onClick={() => setViewMode(mode)}
              >
                {mode === "summary" && <BarChart3 className="h-3.5 w-3.5 mr-1" />}
                {mode === "detailed" && <Table2 className="h-3.5 w-3.5 mr-1" />}
                {mode === "writing" && <BookOpen className="h-3.5 w-3.5 mr-1" />}
                {mode}
              </Button>
            ))}
          </div>
        </div>

        {viewMode === "summary" && (
          <div className="p-5">
            {/* Key statistics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{result.testStatistic.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{result.testStatistic.label}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${significant ? "text-success" : "text-warning"}`}>{result.pValue}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">p-value</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{result.sampleSize}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Sample size (n)</p>
              </div>
              {result.effectSize && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{result.effectSize.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{result.effectSize.label}</p>
                </div>
              )}
            </div>

            {result.degreesOfFreedom && (
              <p className="text-xs text-muted-foreground mb-3">
                Degrees of freedom: {result.degreesOfFreedom}
                {result.confidenceInterval && ` · 95% CI: ${result.confidenceInterval}`}
              </p>
            )}

            {/* AI Interpretation */}
            <div className="bg-accent/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Academic Interpretation</h4>
              </div>
              <p className="text-sm leading-relaxed">{result.interpretation}</p>
            </div>

            {/* Plain explanation */}
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">In Plain Language</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.plainExplanation}</p>
            </div>

            {result.effectSize && (
              <p className="text-xs text-muted-foreground mb-3">
                Effect size interpretation: <span className="font-medium text-foreground">{result.effectSize.interpretation}</span>
              </p>
            )}

            {result.suggestedFollowUp && (
              <div className="bg-warning/10 rounded-lg p-3 flex gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-warning">Suggested Follow-Up</p>
                  <p className="text-xs text-warning/80">{result.suggestedFollowUp}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === "detailed" && (
          <div className="p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Full Statistical Parameters</h4>
            <div className="border border-border rounded-lg overflow-hidden mb-5">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">Test</td><td className="p-3">{result.testName}</td></tr>
                  <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">Sample size (n)</td><td className="p-3">{result.sampleSize}</td></tr>
                  {result.degreesOfFreedom && <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">Degrees of freedom</td><td className="p-3">{result.degreesOfFreedom}</td></tr>}
                  <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">{result.testStatistic.label}</td><td className="p-3 font-mono">{result.testStatistic.value}</td></tr>
                  <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">p-value</td><td className="p-3 font-mono">{result.pValue}</td></tr>
                  {result.confidenceInterval && <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">95% CI</td><td className="p-3 font-mono">{result.confidenceInterval}</td></tr>}
                  {result.effectSize && <tr className="hover:bg-muted/30"><td className="p-3 text-muted-foreground font-medium">{result.effectSize.label}</td><td className="p-3 font-mono">{result.effectSize.value} ({result.effectSize.interpretation})</td></tr>}
                </tbody>
              </table>
            </div>

            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Assumption Checks</h4>
            <div className="space-y-2">
              {result.assumptions.map((a, i) => (
                <div key={i} className={`rounded-lg p-3 flex items-start gap-2 ${a.met ? "bg-success/5 border border-success/20" : "bg-warning/5 border border-warning/20"}`}>
                  {a.met ? <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === "writing" && (
          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Draft Results Section</h4>
                <Button variant="ghost" size="sm" className="text-xs h-7"><Copy className="h-3 w-3 mr-1" /> Copy</Button>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm leading-relaxed font-serif">{result.draftResultsText}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Draft Discussion Paragraph</h4>
                <Button variant="ghost" size="sm" className="text-xs h-7"><Copy className="h-3 w-3 mr-1" /> Copy</Button>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <p className="text-sm leading-relaxed font-serif">{result.draftDiscussionText}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-border flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" /> Save to Results</Button>
          <Button variant="outline" size="sm" onClick={onInsertIntoDocument}><FileEdit className="h-4 w-4 mr-1" /> Insert into Document</Button>
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> Supervisor View</Button>
        </div>
      </Card>
    </div>
  );
};

export type { StatResult };
export default StatisticalResultsPanel;
