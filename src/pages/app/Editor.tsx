import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BookOpen, Search, Save, Download, AlertTriangle, CheckCircle2, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";

const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  major: "bg-warning text-warning-foreground",
  minor: "bg-secondary text-secondary-foreground",
  suggestion: "bg-accent text-accent-foreground",
};

const Editor = () => {
  const { project, updateSection, insertCitation } = useProject();
  const navigate = useNavigate();
  const [activeSectionId, setActiveSectionId] = useState(project.sections[0]?.id);
  const activeSection = project.sections.find((s) => s.id === activeSectionId);
  const [rightTab, setRightTab] = useState("reviewer");
  const [citationSearch, setCitationSearch] = useState("");
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const totalScore = project.reviewScores.reduce((a, s) => a + s.score, 0);
  const maxTotal = project.reviewScores.reduce((a, s) => a + s.maxScore, 0);
  const scorePercent = Math.round((totalScore / maxTotal) * 100);

  const uncitedRefs = project.references.filter((r) => !r.cited).length;
  const citedRefs = project.references.filter((r) => r.cited).length;

  const citationResults = project.references.filter(
    (r) => r.title.toLowerCase().includes(citationSearch.toLowerCase()) ||
      r.authors.some((a) => a.toLowerCase().includes(citationSearch.toLowerCase()))
  );

  const handleInsertCitation = (ref: typeof project.references[0]) => {
    if (activeSection) {
      const citation = `(${ref.authors[0].split(",")[0]} et al., ${ref.year})`;
      insertCitation(activeSection.id, citation);
    }
    setCitationModalOpen(false);
  };

  const handleSaveVersion = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Proposal Editor"
        subtitle="Write and organize your research proposal"
        breadcrumb={project.title}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Dialog open={citationModalOpen} onOpenChange={setCitationModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><Quote className="h-4 w-4 mr-1" /> Insert Citation</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Insert Citation</DialogTitle>
            </DialogHeader>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search references…" value={citationSearch} onChange={(e) => setCitationSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {citationResults.map((ref) => (
                <div key={ref.id} className="p-3 border border-border rounded-lg flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{ref.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ref.authors[0]} · {ref.year} · {ref.journal}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleInsertCitation(ref)}>
                    Insert APA
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" onClick={handleSaveVersion}>
          <Save className="h-4 w-4 mr-1" /> Save Version
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate("/app/export")}>
          <Download className="h-4 w-4 mr-1" /> Quick Export
        </Button>
        {savedToast && (
          <span className="text-xs text-success flex items-center gap-1 animate-fade-in">
            <CheckCircle2 className="h-3 w-3" /> Version saved
          </span>
        )}
      </div>

      <div className="flex gap-4 h-[calc(100vh-15rem)]">
        {/* Section outline */}
        <Card className="w-48 shrink-0 shadow-card overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections</h3>
          </div>
          <div className="py-1">
            {project.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSectionId(s.id)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  activeSectionId === s.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {s.order}. {s.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Editor area */}
        <Card className="flex-1 shadow-card flex flex-col overflow-hidden">
          {activeSection && (
            <>
              <div className="p-4 border-b border-border">
                <h2 className="font-display text-xl font-semibold">{activeSection.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeSection.content.split(/\s+/).length} words
                </p>
              </div>
              <Textarea
                value={activeSection.content}
                onChange={(e) => updateSection(activeSection.id, e.target.value)}
                className="flex-1 border-0 rounded-none resize-none focus-visible:ring-0 p-4 text-sm leading-relaxed font-body"
                placeholder="Start writing…"
              />
            </>
          )}
        </Card>

        {/* Right panel */}
        <Card className="w-72 shrink-0 shadow-card overflow-y-auto">
          <Tabs value={rightTab} onValueChange={setRightTab}>
            <TabsList className="w-full rounded-none border-b border-border h-auto p-0 bg-transparent">
              <TabsTrigger value="reviewer" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-xs">
                Reviewer Mode
              </TabsTrigger>
              <TabsTrigger value="citations" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-xs">
                Citations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviewer" className="p-3 space-y-4 mt-0">
              {/* Score */}
              <div className="text-center py-3">
                <p className="text-4xl font-bold text-primary">{scorePercent}</p>
                <p className="text-xs text-muted-foreground">/ 100 overall score</p>
              </div>

              {/* Category scores */}
              <div className="space-y-2">
                {project.reviewScores.map((s) => (
                  <div key={s.category} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{s.category}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(s.score / s.maxScore) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium w-7 text-right">{s.score}</span>
                  </div>
                ))}
              </div>

              {/* Issues */}
              <div className="border-t border-border pt-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Issues</h4>
                <div className="space-y-2">
                  {project.reviewIssues.map((issue) => (
                    <div key={issue.id} className="p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge className={severityColors[issue.severity] + " text-[10px] px-1.5 py-0"}>{issue.severity}</Badge>
                        <button
                          onClick={() => setActiveSectionId(issue.sectionId)}
                          className="text-[10px] text-primary hover:underline"
                        >
                          {issue.sectionTitle}
                        </button>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{issue.message}</p>
                      {issue.suggestion && (
                        <Button variant="ghost" size="sm" className="text-[10px] h-6 mt-1 px-2">See Suggested Edit</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="citations" className="p-3 space-y-4 mt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                  <div>
                    <p className="text-xs font-medium">Uncited claims: 1</p>
                    <p className="text-[10px] text-muted-foreground">Introduction paragraph 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-medium">References in library: {project.references.length}</p>
                    <p className="text-[10px] text-muted-foreground">{citedRefs} cited · {uncitedRefs} uncited</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Referenced In This Section</h4>
                {project.references.filter((r) => r.cited).slice(0, 4).map((ref) => (
                  <div key={ref.id} className="py-2 border-b border-border last:border-0">
                    <p className="text-xs font-medium leading-tight">{ref.title}</p>
                    <p className="text-[10px] text-muted-foreground">{ref.authors[0]} · {ref.year}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
