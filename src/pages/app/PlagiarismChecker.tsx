import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, RefreshCw, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";

const mockResults = [
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
  { section: "Methodology", similarity: 5, sources: [{ title: "Transfer Learning Approaches for Image Classification — Lee, 2021", matchPct: 5, url: "#" }], status: "clear" as const },
  { section: "Expected Results", similarity: 2, sources: [], status: "clear" as const },
  { section: "Timeline & Budget", similarity: 1, sources: [], status: "clear" as const },
  { section: "References", similarity: 0, sources: [], status: "clear" as const },
];

const PlagiarismChecker = () => {
  const { project } = useProject();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasResults, setHasResults] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const overallSimilarity = 8;

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
        title="Plagiarism Checker"
        subtitle="Scan your proposal against 100M+ academic sources"
        breadcrumb={project.title}
      />

      {/* Summary Card */}
      <Card className="p-5 mb-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-muted" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray={`${overallSimilarity} ${100 - overallSimilarity}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{overallSimilarity}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success">Low Risk</span>
              </div>
              <p className="text-sm text-muted-foreground">18,400 words checked · 3 matching sources found</p>
              <p className="text-xs text-muted-foreground mt-1">Last scanned 2 hours ago</p>
            </div>
          </div>
          <Button onClick={handleScan} disabled={scanning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? "Scanning…" : "Run New Scan"}
          </Button>
        </div>
        {scanning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Scanning sections…</span>
              <span>{Math.min(100, Math.round(scanProgress))}%</span>
            </div>
            <Progress value={Math.min(100, scanProgress)} className="h-2" />
          </div>
        )}
      </Card>

      {/* Section Results */}
      {hasResults && (
        <div className="space-y-3">
          {mockResults.map((r) => (
            <Card key={r.section} className="shadow-card overflow-hidden">
              <button
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === r.section ? null : r.section)}
              >
                {r.similarity > 10 ? (
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                )}
                <span className="flex-1 text-sm font-medium">{r.section}</span>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.similarity > 10 ? "bg-warning" : "bg-primary"}`}
                    style={{ width: `${r.similarity}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold">{r.similarity}%</span>
              </button>
              {expanded === r.section && (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
