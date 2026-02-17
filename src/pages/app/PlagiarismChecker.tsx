import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShieldCheck, RefreshCw, ExternalLink, AlertTriangle, CheckCircle2, Bot, FileText, Info, Download, Loader2 } from "lucide-react";

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

const riskColor = (level: RiskLevel) =>
  level === "safe" ? "#22c55e" : level === "borderline" ? "#f59e0b" : "#ef4444";

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

/* ── PDF Generation ── */
function generateIntegrityPdf(
  projectTitle: string,
  overallSimilarity: number,
  overallAi: number,
  simResults: typeof mockSimilarityResults,
  aiResults: typeof mockAiResults,
) {
  const simRisk = getSimilarityRisk(overallSimilarity);
  const aiRisk = getAiRisk(overallAi);
  const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const simRows = simResults
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${r.section}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:${riskColor(getSimilarityRisk(r.similarity))};font-weight:600">${r.similarity}%</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${riskConfig[getSimilarityRisk(r.similarity)].label}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px">${r.sources.length ? r.sources.map(s => s.title).join("; ") : "—"}</td></tr>`,
    )
    .join("");

  const aiRows = aiResults
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${r.section}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:${riskColor(getAiRisk(r.aiPct))};font-weight:600">${r.aiPct}%</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${riskConfig[getAiRisk(r.aiPct)].label}</td>` +
        `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px">${r.detail}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Integrity Report — ${projectTitle}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;margin:40px;color:#1a1a2e;font-size:13px;line-height:1.6}
  h1{font-size:22px;margin-bottom:4px}
  h2{font-size:16px;margin-top:32px;margin-bottom:10px;border-bottom:2px solid #1a1a2e;padding-bottom:4px}
  .meta{color:#666;font-size:12px;margin-bottom:24px}
  .summary{display:flex;gap:32px;margin-bottom:8px}
  .score-box{border:1px solid #e5e7eb;border-radius:8px;padding:16px 24px;text-align:center;min-width:180px}
  .score-box .value{font-size:36px;font-weight:700}
  .score-box .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:4px}
  table{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}
  th{padding:8px 12px;text-align:left;background:#f3f4f6;font-weight:600;border-bottom:2px solid #d1d5db}
  .legend{display:flex;gap:20px;font-size:11px;margin:8px 0 12px;color:#666}
  .legend span::before{content:"●";margin-right:4px}
  .safe::before{color:#22c55e} .borderline::before{color:#f59e0b} .critical::before{color:#ef4444}
  .footer{margin-top:40px;border-top:1px solid #e5e7eb;padding-top:12px;font-size:10px;color:#999;text-align:center}
</style></head><body>
  <h1>Integrity Report</h1>
  <p class="meta">${projectTitle}<br>${now} · Cognita Research Platform</p>

  <div class="summary">
    <div class="score-box">
      <div class="value" style="color:${riskColor(simRisk)}">${overallSimilarity}%</div>
      <div class="label">Similarity Index</div>
      <div style="margin-top:6px;font-size:12px;color:${riskColor(simRisk)};font-weight:600">${riskConfig[simRisk].label}</div>
    </div>
    <div class="score-box">
      <div class="value" style="color:${riskColor(aiRisk)}">${overallAi}%</div>
      <div class="label">AI Detection</div>
      <div style="margin-top:6px;font-size:12px;color:${riskColor(aiRisk)};font-weight:600">${riskConfig[aiRisk].label}</div>
    </div>
  </div>

  <h2>1. Similarity Index — Section Breakdown</h2>
  <div class="legend"><span class="safe">0–20% Acceptable</span><span class="borderline">21–35% Borderline</span><span class="critical">36%+ Unacceptable</span></div>
  <table><thead><tr><th>Section</th><th style="text-align:center">Similarity</th><th>Status</th><th>Matching Sources</th></tr></thead><tbody>${simRows}</tbody></table>

  <h2>2. AI Detection — Section Breakdown</h2>
  <div class="legend"><span class="safe">0–20% Acceptable</span><span class="borderline">21–45% Borderline</span><span class="critical">46%+ Unacceptable</span></div>
  <table><thead><tr><th>Section</th><th style="text-align:center">AI %</th><th>Status</th><th>Details</th></tr></thead><tbody>${aiRows}</tbody></table>

  <div class="footer">Generated by Cognita Research Platform · This report is for institutional review purposes only.</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}

/* ── Main page ── */
const PlagiarismChecker = () => {
  const { project } = useProject();
  const { updateIntegrityMetrics } = useInstitution();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasResults, setHasResults] = useState(true);
  const [expandedSim, setExpandedSim] = useState<string | null>(null);
  const [expandedAi, setExpandedAi] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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
          // Sync metrics to admin dashboard after scan completes
          updateIntegrityMetrics(project.id, overallSimilarity, overallAi);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 400);
  };

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      generateIntegrityPdf(project.title, overallSimilarity, overallAi, mockSimilarityResults, mockAiResults);
      setDownloadingPdf(false);
    }, 800);
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

      {/* Action buttons */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">Last scanned 2 hours ago</p>
        <div className="flex items-center gap-2">
          {hasResults && (
            <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={downloadingPdf}>
              {downloadingPdf ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Download PDF
            </Button>
          )}
          <Button onClick={handleScan} disabled={scanning} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning…" : "Run Full Scan"}
          </Button>
        </div>
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
