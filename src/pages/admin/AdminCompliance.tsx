import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle2, Bot, BookOpen, FileWarning } from "lucide-react";

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
  const [tab, setTab] = useState("ai-usage");

  return (
    <div className="max-w-5xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Compliance</h1>
        <p className="text-muted-foreground">Monitor AI usage, citation integrity, and ethics across all projects</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="ai-usage" className="gap-1.5"><Bot className="h-3.5 w-3.5" /> AI Usage Monitoring</TabsTrigger>
          <TabsTrigger value="citations" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Citation & Integrity</TabsTrigger>
          <TabsTrigger value="ethics" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Ethics Alerts</TabsTrigger>
        </TabsList>

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
