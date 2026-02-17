import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle2, Bot, BookOpen, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const aiUsageItems = [
  { researcher: "Dr. Kwame Asante", project: "CRISPR-Cas9 Gene Editing", level: "High", mode: "Reviewer + Rewrite + Generation", severity: "critical" as const, detail: "Extensive AI generation used in 2 sections. 34% of literature review appears AI-generated." },
  { researcher: "Dr. Ibrahim Musa", project: "Neural Machine Translation", level: "High", mode: "Reviewer + Rewrite + Generation", severity: "critical" as const, detail: "AI generation mode activated 12 times. Related work section flagged for excessive AI content." },
  { researcher: "Dr. Fatima Hassan", project: "AI-Based Crop Disease Detection", level: "Moderate", mode: "Reviewer + Rewrite Suggestions", severity: "warning" as const, detail: "Applied suggested rewrites 8 times. All within acceptable thresholds." },
  { researcher: "Dr. Michael Obi", project: "Renewable Energy Integration", level: "Moderate", mode: "Reviewer + Rewrite Suggestions", severity: "warning" as const, detail: "Moderate AI usage. 5 rewrite suggestions applied." },
  { researcher: "Dr. Sarah Chen", project: "Microplastic Contamination", level: "Low", mode: "Reviewer Only", severity: "safe" as const, detail: "AI used only for review scoring. No rewrites applied." },
];

const citationItems = [
  { researcher: "Dr. Michael Obi", project: "Renewable Energy Integration", issue: "Missing citations in methodology section", severity: "warning" as const },
  { researcher: "Dr. Kwame Asante", project: "CRISPR-Cas9 Gene Editing", issue: "3 uncited claims in introduction", severity: "critical" as const },
  { researcher: "Dr. Ibrahim Musa", project: "Neural Machine Translation", issue: "3 references missing DOI", severity: "warning" as const },
  { researcher: "Dr. Fatima Hassan", project: "AI-Based Crop Disease Detection", issue: "1 reference missing DOI (FAO Report)", severity: "safe" as const },
];

const ethicsItems = [
  { researcher: "Dr. Kwame Asante", project: "CRISPR-Cas9 Gene Editing", issue: "Human gene therapy research — ethics review pending", severity: "critical" as const },
  { researcher: "Dr. Amina Yusuf", project: "Social Media Misinformation", issue: "Human subjects data — IRB approval confirmed", severity: "safe" as const },
  { researcher: "Dr. Grace Ndegwa", project: "Antibiotic Resistance Patterns", issue: "Clinical data — ethics clearance valid until 2027", severity: "safe" as const },
];

const severityStyles: Record<string, { bg: string; icon: typeof CheckCircle2; color: string }> = {
  safe: { bg: "bg-success/5 border-success/20", icon: CheckCircle2, color: "text-success" },
  warning: { bg: "bg-warning/5 border-warning/20", icon: AlertTriangle, color: "text-warning" },
  critical: { bg: "bg-destructive/5 border-destructive/20", icon: AlertTriangle, color: "text-destructive" },
};

const AdminCompliance = () => {
  const { institution } = useInstitution();
  const [tab, setTab] = useState("integrity-metrics");

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Compliance</h1>
        <p className="text-muted-foreground">Monitor AI usage, citation integrity, and ethics across all projects</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="integrity-metrics" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Integrity Metrics</TabsTrigger>
          <TabsTrigger value="ai-usage" className="gap-1.5"><Bot className="h-3.5 w-3.5" /> AI Usage Monitoring</TabsTrigger>
          <TabsTrigger value="citations" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Citation & Integrity</TabsTrigger>
          <TabsTrigger value="ethics" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Ethics Alerts</TabsTrigger>
        </TabsList>

        {/* Integrity Metrics Tab */}
        <TabsContent value="integrity-metrics" className="space-y-3">
          <Card className="p-4 shadow-card border-dashed">
            <p className="text-xs text-muted-foreground">Real-time similarity index and AI detection scores synced from researcher scans. Thresholds: Similarity ≤20% safe, AI ≤20% safe.</p>
          </Card>

          {/* Table header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.8fr] gap-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Project</span><span>Researcher</span><span className="text-center">Similarity</span><span className="text-center">AI Score</span><span className="text-center">Integrity</span><span className="text-center">Status</span>
          </div>

          {institution.projects.map(p => {
            const simRisk = p.similarityIndex <= 20 ? "safe" : p.similarityIndex <= 35 ? "borderline" : "critical";
            const aiRisk = p.aiDetectionScore <= 20 ? "safe" : p.aiDetectionScore <= 45 ? "borderline" : "critical";
            const simColor = simRisk === "safe" ? "text-success" : simRisk === "borderline" ? "text-warning" : "text-destructive";
            const aiColor = aiRisk === "safe" ? "text-success" : aiRisk === "borderline" ? "text-warning" : "text-destructive";
            const simBg = simRisk === "safe" ? "bg-success" : simRisk === "borderline" ? "bg-warning" : "bg-destructive";
            const aiBg = aiRisk === "safe" ? "bg-success" : aiRisk === "borderline" ? "bg-warning" : "bg-destructive";
            return (
              <Card key={p.id} className="shadow-card">
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.8fr] gap-2 items-center px-4 py-3">
                  <span className="text-sm font-medium truncate">{p.title}</span>
                  <span className="text-xs text-muted-foreground truncate">{p.researcher}</span>
                  <div className="text-center">
                    <span className={`text-sm font-bold ${simColor}`}>{p.similarityIndex}%</span>
                    <Progress value={p.similarityIndex} className={`h-1 mt-1 [&>div]:${simBg}`} />
                  </div>
                  <div className="text-center">
                    <span className={`text-sm font-bold ${aiColor}`}>{p.aiDetectionScore}%</span>
                    <Progress value={p.aiDetectionScore} className={`h-1 mt-1 [&>div]:${aiBg}`} />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold">{p.integrityScore}</span>
                  </div>
                  <div className="text-center">
                    {simRisk === "safe" && aiRisk === "safe" ? (
                      <CheckCircle2 className="h-4 w-4 text-success mx-auto" />
                    ) : simRisk === "critical" || aiRisk === "critical" ? (
                      <AlertTriangle className="h-4 w-4 text-destructive mx-auto" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning mx-auto" />
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="ai-usage" className="space-y-3">
          {aiUsageItems.map((item, i) => {
            const s = severityStyles[item.severity];
            return (
              <Card key={i} className={`p-4 shadow-card border ${s.bg}`}>
                <div className="flex items-start gap-3">
                  <s.icon className={`h-5 w-5 ${s.color} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-sm">{item.researcher}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">{item.project}</span>
                    </div>
                    <p className="text-sm text-foreground mb-1">{item.detail}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px]">{item.mode}</Badge>
                      <Badge className={`text-[10px] ${item.level === "High" ? "bg-destructive/10 text-destructive" : item.level === "Moderate" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{item.level}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="citations" className="space-y-3">
          {citationItems.map((item, i) => {
            const s = severityStyles[item.severity];
            return (
              <Card key={i} className={`p-4 shadow-card border ${s.bg}`}>
                <div className="flex items-start gap-3">
                  <s.icon className={`h-5 w-5 ${s.color} shrink-0 mt-0.5`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{item.researcher}</span>
                      <span className="text-xs text-muted-foreground">• {item.project}</span>
                    </div>
                    <p className="text-sm">{item.issue}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="ethics" className="space-y-3">
          {ethicsItems.map((item, i) => {
            const s = severityStyles[item.severity];
            return (
              <Card key={i} className={`p-4 shadow-card border ${s.bg}`}>
                <div className="flex items-start gap-3">
                  <s.icon className={`h-5 w-5 ${s.color} shrink-0 mt-0.5`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{item.researcher}</span>
                      <span className="text-xs text-muted-foreground">• {item.project}</span>
                    </div>
                    <p className="text-sm">{item.issue}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCompliance;
