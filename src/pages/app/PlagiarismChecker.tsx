import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShieldCheck, RefreshCw, ExternalLink, AlertTriangle, CheckCircle2, Bot, FileText, Info } from "lucide-react";

/* ── Threshold helpers ── */
type RiskLevel = "safe" | "borderline" | "critical";

const getSimilarityRisk = (pct: number): RiskLevel =>
  pct <= 20 ? "safe" : pct <= 35 ? "borderline" : "critical";

const getAiRisk = (pct: number): RiskLevel =>
  pct <= 20 ? "safe" : pct <= 45 ? "borderline" : "critical";

const riskConfig: Record<RiskLevel, { label: string; bg: string; text: string; ring: string; stroke: string }> = {
  safe: { label: "Acceptable", bg: "bg-success/10", text: "text-success", ring: "ring-success/30", stroke: "stroke-success" },
  borderline: { label: "Borderline", bg: "bg-warning/10", text: "text-warning", ring: "ring-warning/30", stroke: "stroke-warning" },
  critical: { label: "Unacceptable", bg: "bg-destructive/10", text: "text-destructive", ring: "ring-destructive/30", stroke: "stroke-destructive" },
};

/* ── Mock data ── */
const mockSimilarityResults = [
  { section: "Introduction", similarity: 3, sources: [], status: "clear" as const },
  {
    section: "Literature Review",
    similarity: 12,
    sources: [
      { title: "Deep Learning for Plant Disease Detection — Zhang et al., 2023", matchPct: 8, url: "#" },
      { title: "Computer Vision in Agriculture: A Survey — Patel & Kumar, 2022", matchPct: 4, url: "#" },
    ],
    status: "warning" as const,
  },
  { section: "Statement of Problem", similarity: 5, sources: [{ title: "Transfer Learning Approaches for Image Classification — Lee, 2021", matchPct: 5, url: "#" }], status: "clear" as const },
  { section: "Methodology", similarity: 7, sources: [{ title: "CNN-Based Agricultural Diagnostics — Okonkwo, 2022", matchPct: 7, url: "#" }], status: "clear" as const },
  { section: "Expected Results", similarity: 2, sources: [], status: "clear" as const },
  { section: "References", similarity: 0, sources: [], status: "clear" as const },
];

const mockAiResults = [
  { section: "Introduction", aiPct: 8, detail: "Minor grammar corrections detected" },
  { section: "Literature Review", aiPct: 22, detail: "Moderate AI-assisted paraphrasing detected in 3 paragraphs" },
  { section: "Statement of Problem", aiPct: 14, detail: "Minimal AI involvement — mostly human-authored" },
  { section: "Methodology", aiPct: 6, detail: "Structure appears fully human-written" },
  { section: "Expected Results", aiPct: 38, detail: "Significant AI-generated phrasing detected in results projections" },
  { section: "References", aiPct: 0, detail: "No AI content detected" },
];

/* ── Donut ring component ── */
const ScoreRing = ({ pct, risk, size = 96 }: { pct: number; risk: RiskLevel; size?: number }) => {
  const cfg = riskConfig[risk];
  const r = 15.9;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90" viewBox="0 0 36 36" width={size} height={size}>
        <circle cx="18" cy="18" r={r} fill="none" className="stroke-muted" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" className={cfg.stroke} strokeWidth="3" strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xl font-bold ${cfg.text}`}>{pct}%</span>
      </div>
    </div>
  );
};

/* ── Threshold legend ── */
const ThresholdLegend = ({ type }: { type: "similarity" | "ai" }) => {
  const rows =
    type === "similarity"
      ? [
          { range: "0–20%", level: "Acceptable", color: "bg-success" },
          { range: "21–35%", level: "Borderline", color: "bg-warning" },
          { range: "36%+", level: "Unacceptable", color: "bg-destructive" },
        ]
      : [
          { range: "0–20%", level: "Acceptable", color: "bg-success" },
          { range: "21–45%", level: "Borderline", color: "bg-warning" },
          { range: "46%+", level: "Unacceptable", color: "bg-destructive" },
        ];
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {rows.map((r) => (
        <span key={r.range} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${r.color}`} />
          {r.range} — {r.level}
        </span>
      ))}
    </div>
  );
};

/* ── Main page ── */
const PlagiarismChecker = () => {
  const { project } = useProject();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasResults, setHasResults] = useState(true);
  const [expandedSim, setExpandedSim] = useState<string | null>(null);
  const [expandedAi, setExpandedAi] = useState<string | null>(null);

  const overallSimilarity = 8;
  const overallAi = 15;

  const simRisk = getSimilarityRisk(overallSimilarity);
  const aiRisk = getAiRisk(overallAi);

  const handleScan = () => {
    setScanning(true);
    setScanProgress(0);
    setHasResults(false);
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setScanning(false);
          setHasResults(true);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 400);
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Integrity Report"
        subtitle="Similarity index & AI detection analysis"
        breadcrumb={project.title}
      />

      {/* ── Summary Cards ── */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Similarity Index */}
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Similarity Index</h3>
          </div>
          <div className="flex items-center gap-4">
            <ScoreRing pct={overallSimilarity} risk={simRisk} />
            <div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${riskConfig[simRisk].bg} ${riskConfig[simRisk].text}`}>
                {riskConfig[simRisk].label}
              </span>
              <p className="text-xs text-muted-foreground mt-2">18,400 words checked</p>
              <p className="text-xs text-muted-foreground">3 matching sources</p>
            </div>
          </div>
        </Card>

        {/* AI Detection */}
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">AI Detection Score</h3>
          </div>
          <div className="flex items-center gap-4">
            <ScoreRing pct={overallAi} risk={aiRisk} />
            <div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${riskConfig[aiRisk].bg} ${riskConfig[aiRisk].text}`}>
                {riskConfig[aiRisk].label}
              </span>
              <p className="text-xs text-muted-foreground mt-2">Core writing is human-authored</p>
              <p className="text-xs text-muted-foreground">AI assisted grammar & phrasing</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Scan button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">Last scanned 2 hours ago</p>
        <Button onClick={handleScan} disabled={scanning} size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning…" : "Run Full Scan"}
        </Button>
      </div>

      {scanning && (
        <Card className="p-4 mb-6 shadow-card">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Scanning sections…</span>
            <span>{Math.min(100, Math.round(scanProgress))}%</span>
          </div>
          <Progress value={Math.min(100, scanProgress)} className="h-2" />
        </Card>
      )}

      {/* ── Detailed Results Tabs ── */}
      {hasResults && (
        <Tabs defaultValue="similarity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="similarity" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Similarity Index
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-1.5">
              <Bot className="h-3.5 w-3.5" /> AI Detection
            </TabsTrigger>
          </TabsList>

          {/* ── Similarity Tab ── */}
          <TabsContent value="similarity" className="space-y-3">
            <Card className="p-3 shadow-card border-dashed flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>0–20%</strong> is acceptable if similarity comes from properly cited quotations, reference lists, or common terms.</p>
                <p><strong>21–35%</strong> may require explanation — acceptable if correctly cited, otherwise revision needed.</p>
                <p><strong>36%+</strong> is unacceptable — large uncited text blocks, close paraphrasing, or missing citations.</p>
              </div>
            </Card>
            <ThresholdLegend type="similarity" />

            {mockSimilarityResults.map((r) => {
              const sRisk = getSimilarityRisk(r.similarity);
              return (
                <Card key={r.section} className="shadow-card overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedSim(expandedSim === r.section ? null : r.section)}
                  >
                    {sRisk === "safe" ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    ) : sRisk === "borderline" ? (
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                    )}
                    <span className="flex-1 text-sm font-medium">{r.section}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sRisk === "safe" ? "bg-success" : sRisk === "borderline" ? "bg-warning" : "bg-destructive"}`}
                        style={{ width: `${Math.max(r.similarity, 2)}%` }}
                      />
                    </div>
                    <span className={`w-12 text-right text-sm font-semibold ${riskConfig[sRisk].text}`}>{r.similarity}%</span>
                  </button>
                  {expandedSim === r.section && (
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
                      {r.sources.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No matching sources found. This section is clear.</p>
                      ) : (
                        r.sources.map((src, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-muted/40 rounded-md px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <ShieldCheck className="h-4 w-4 text-warning shrink-0" />
                              <span className="truncate">{src.title}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                              <span className="text-xs font-medium text-warning">{src.matchPct}% match</span>
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* ── AI Detection Tab ── */}
          <TabsContent value="ai" className="space-y-3">
            <Card className="p-3 shadow-card border-dashed flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>0–20%</strong> is acceptable — AI may help with grammar or phrasing, core writing is human.</p>
                <p><strong>21–45%</strong> is borderline — moderate AI involvement, justification may be required.</p>
                <p><strong>46%+</strong> is unacceptable — excessive AI use, may trigger academic integrity review.</p>
              </div>
            </Card>
            <ThresholdLegend type="ai" />

            {mockAiResults.map((r) => {
              const aRisk = getAiRisk(r.aiPct);
              return (
                <Card key={r.section} className="shadow-card overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedAi(expandedAi === r.section ? null : r.section)}
                  >
                    {aRisk === "safe" ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    ) : aRisk === "borderline" ? (
                      <Bot className="h-5 w-5 text-warning shrink-0" />
                    ) : (
                      <Bot className="h-5 w-5 text-destructive shrink-0" />
                    )}
                    <span className="flex-1 text-sm font-medium">{r.section}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${aRisk === "safe" ? "bg-success" : aRisk === "borderline" ? "bg-warning" : "bg-destructive"}`}
                        style={{ width: `${Math.max(r.aiPct, 2)}%` }}
                      />
                    </div>
                    <span className={`w-12 text-right text-sm font-semibold ${riskConfig[aRisk].text}`}>{r.aiPct}%</span>
                  </button>
                  {expandedAi === r.section && (
                    <div className="px-4 pb-4 border-t border-border pt-3">
                      <p className="text-sm text-muted-foreground">{r.detail}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PlagiarismChecker;
