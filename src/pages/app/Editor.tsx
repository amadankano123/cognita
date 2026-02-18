import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  BookOpen, Search, Save, Download, AlertTriangle, CheckCircle2, Quote, ShieldCheck,
  Sparkles, Loader2, PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen, Maximize2, Minimize2, FileText, Bot, X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ContextAwareIndicator from "@/components/layout/ContextAwareIndicator";

import SectionBuilder from "@/components/editor/SectionBuilder";
import AIChatPanel from "@/components/editor/AIChatPanel";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";


const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  major: "bg-warning text-warning-foreground",
  minor: "bg-secondary text-secondary-foreground",
  suggestion: "bg-accent text-accent-foreground",
};

const Editor = () => {
  const { project, updateSection, insertCitation } = useProject();
  const { updateProjectIntegrity, incrementAiUsage } = useInstitution();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const pid = projectId || project.id;
  const nav = (path: string) => navigate(`/app/${pid}/${path}`);

  const [activeSectionId, setActiveSectionId] = useState(project.sections[0]?.id);
  const activeSection = project.sections.find(s => s.id === activeSectionId);
  const [rightTab, setRightTab] = useState("ai-assist");
  const [citationSearch, setCitationSearch] = useState("");
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Panel state
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [pageMode, setPageMode] = useState(false);

  // Responsive auto-collapse
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 900) {
        setLeftOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState<number | undefined>(undefined);
  
  const totalScore = project.reviewScores.reduce((a, s) => a + s.score, 0);
  const maxTotal = project.reviewScores.reduce((a, s) => a + s.maxScore, 0);
  const scorePercent = Math.round((totalScore / maxTotal) * 100);
  const uncitedRefs = project.references.filter(r => !r.cited).length;
  const citedRefs = project.references.filter(r => r.cited).length;

  const citationResults = project.references.filter(r =>
    r.title.toLowerCase().includes(citationSearch.toLowerCase()) ||
    r.authors.some(a => a.toLowerCase().includes(citationSearch.toLowerCase()))
  );

  const handleInsertCitation = (ref: typeof project.references[0]) => {
    if (activeSection) {
      const citation = `(${ref.authors[0].split(",")[0]} et al., ${ref.year})`;
      insertCitation(activeSection.id, citation, cursorPos);
    }
    setCitationModalOpen(false);
  };

  const handleTextareaSelect = () => {
    if (textareaRef.current) setCursorPos(textareaRef.current.selectionStart);
  };

  const handleSaveVersion = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleApplyRewrite = () => { incrementAiUsage(project.id); };

  const handleInsertAIContent = (content: string) => {
    if (activeSection) {
      updateSection(activeSection.id, activeSection.content + "\n\n" + content);
    }
    incrementAiUsage(project.id);
  };


  const toggleFocusMode = () => {
    if (!focusMode) {
      setLeftOpen(false);
      setRightOpen(false);
      setFocusMode(true);
    } else {
      setFocusMode(false);
      if (window.innerWidth >= 900) { setLeftOpen(true); }
    }
  };

  // Get breadcrumb from active section
  const getBreadcrumb = () => {
    if (!activeSection) return null;
    const title = activeSection.title;
    // Try to find parent chapter
    const parts: string[] = [project.title];
    // Check if template section has parent
    const meta = project.sectionMeta.find(m => `tmpl-${m.key}` === activeSectionId);
    if (meta?.parentKey) {
      const parentMeta = project.sectionMeta.find(m => m.key === meta.parentKey);
      if (parentMeta) parts.push(parentMeta.key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    }
    parts.push(title);
    return parts;
  };

  const breadcrumb = getBreadcrumb();

  // ===== LEFT PANEL CONTENT =====
  const leftPanelContent = (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setLeftOpen(false)}>
                <PanelLeftClose className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p className="text-xs">Collapse panel</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <SectionBuilder activeSectionId={activeSectionId} onSelectSection={setActiveSectionId} />
    </div>
  );

  // ===== RIGHT PANEL CONTENT (floating overlay) =====
  const rightPanelContent = (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20 animate-fade-in" onClick={() => setRightOpen(false)} />
      {/* Floating panel */}
      <div className="fixed right-4 top-20 bottom-4 z-50 w-[380px] max-w-[90vw] bg-card border border-border rounded-xl shadow-elevated flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tools</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRightOpen(false)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Tabs value={rightTab} onValueChange={setRightTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full rounded-none border-b border-border h-auto p-0 bg-transparent shrink-0">
            <TabsTrigger value="ai-assist" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> AI Assist
            </TabsTrigger>
            <TabsTrigger value="reviewer" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs">Reviewer</TabsTrigger>
            <TabsTrigger value="citations" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs">Citations</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
          <TabsContent value="ai-assist" className="mt-0 h-[calc(100%-40px)]">
            <AIChatPanel activeSectionId={activeSectionId} onInsertContent={handleInsertAIContent} />
          </TabsContent>

          <TabsContent value="reviewer" className="p-3 space-y-4 mt-0">
            <div className="text-center py-3">
              <p className="text-4xl font-bold text-primary">{scorePercent}</p>
              <p className="text-xs text-muted-foreground">/ 100 overall score</p>
            </div>
            <div className="space-y-2">
              {project.reviewScores.map(s => (
                <div key={s.category} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{s.category}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(s.score / s.maxScore) * 100}%` }} /></div>
                  <span className="text-xs font-medium w-7 text-right">{s.score}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Issues</h4>
              <div className="space-y-2">
                {project.reviewIssues.map(issue => (
                  <div key={issue.id} className="p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge className={severityColors[issue.severity] + " text-[10px] px-1.5 py-0"}>{issue.severity}</Badge>
                      <button onClick={() => setActiveSectionId(issue.sectionId)} className="text-[10px] text-primary hover:underline">{issue.sectionTitle}</button>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{issue.message}</p>
                    {issue.suggestion && (
                      <Button variant="ghost" size="sm" className="text-[10px] h-6 mt-1 px-2" onClick={handleApplyRewrite}>Apply Suggested Rewrite</Button>
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
                <div><p className="text-xs font-medium">Uncited claims: 1</p><p className="text-[10px] text-muted-foreground">Introduction paragraph 1</p></div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <div><p className="text-xs font-medium">References: {project.references.length}</p><p className="text-[10px] text-muted-foreground">{citedRefs} cited · {uncitedRefs} uncited</p></div>
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Referenced</h4>
              {project.references.filter(r => r.cited).slice(0, 4).map(ref => (
                <div key={ref.id} className="py-2 border-b border-border last:border-0">
                  <p className="text-xs font-medium leading-tight">{ref.title}</p>
                  <p className="text-[10px] text-muted-foreground">{ref.authors[0]} · {ref.year}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
        </Tabs>
      </div>
    </>
  );

  // ===== COLLAPSED LEFT BAR =====
  const collapsedLeftBar = (
    <div className="w-10 shrink-0 border-r border-border bg-card flex flex-col items-center py-2 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLeftOpen(true)}>
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right"><p className="text-xs">Open sections</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="w-5 h-px bg-border" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <FileText className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right"><p className="text-xs">Sections</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  // ===== RIGHT TOOLBAR BUTTONS (in main toolbar) =====
  const rightToolbarButtons = (
    <>
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setRightOpen(true); setRightTab("ai-assist"); }}>
        <Sparkles className="h-3.5 w-3.5" /> AI Assist
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setRightOpen(true); setRightTab("reviewer"); }}>
        <ShieldCheck className="h-3.5 w-3.5" /> Review
      </Button>
      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setRightOpen(true); setRightTab("citations"); }}>
        <Quote className="h-3.5 w-3.5" /> Citations
      </Button>
    </>
  );

  // ===== MAIN EDITOR CONTENT =====
  const editorContent = (
    <div className={cn(
      "flex-1 flex flex-col h-full overflow-hidden transition-colors duration-300",
      focusMode && "bg-muted/40",
    )}>
      {/* Sticky section header with breadcrumb */}
      {activeSection && (
        <div className={cn(
          "sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shrink-0",
          focusMode && "bg-card/95 backdrop-blur-sm"
        )}>
          {breadcrumb && breadcrumb.length > 1 && (
            <Breadcrumb className="mb-1.5">
              <BreadcrumbList>
                {breadcrumb.map((item, i) => (
                  <BreadcrumbItem key={i}>
                    {i < breadcrumb.length - 1 ? (
                      <>
                        <BreadcrumbLink className="text-[10px] cursor-default">{item}</BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage className="text-[10px]">{item}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">{activeSection.title}</h2>
              <p className="text-[10px] text-muted-foreground">{activeSection.content.split(/\s+/).filter(Boolean).length} words</p>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={() => { setRightOpen(true); setRightTab("ai-assist"); }}>
              <Sparkles className="h-3 w-3" />
              AI Assist
            </Button>
          </div>
        </div>
      )}

      {/* Editor area */}
      {activeSection && (
        <div className={cn(
          "flex-1 overflow-y-auto",
          focusMode && "flex justify-center",
        )}>
          <div className={cn(
            "h-full",
            focusMode ? "w-full max-w-[900px]" : "w-full",
          )}>
            {pageMode || focusMode ? (
              <div className="p-6 md:p-10">
                <div className={cn(
                  "bg-card rounded-lg shadow-card min-h-[calc(100vh-20rem)]",
                  focusMode && "shadow-elevated",
                )}>
                  <Textarea
                    ref={textareaRef}
                    value={activeSection.content}
                    onChange={e => { updateSection(activeSection.id, e.target.value); setCursorPos(e.target.selectionStart); }}
                    onSelect={handleTextareaSelect}
                    onClick={handleTextareaSelect}
                    onKeyUp={handleTextareaSelect}
                    className={cn(
                      "w-full min-h-[calc(100vh-22rem)] border-0 resize-none focus-visible:ring-0 font-body rounded-lg",
                      focusMode
                        ? "p-8 md:p-12 text-base leading-[1.9] tracking-wide"
                        : "p-6 md:p-8 text-sm leading-relaxed"
                    )}
                    placeholder="Start writing…"
                  />
                </div>
              </div>
            ) : (
              <Textarea
                ref={textareaRef}
                value={activeSection.content}
                onChange={e => { updateSection(activeSection.id, e.target.value); setCursorPos(e.target.selectionStart); }}
                onSelect={handleTextareaSelect}
                onClick={handleTextareaSelect}
                onKeyUp={handleTextareaSelect}
                className="w-full h-full border-0 resize-none focus-visible:ring-0 p-6 md:p-8 text-sm leading-relaxed font-body"
                style={{ maxWidth: "1000px", margin: "0 auto" }}
                placeholder="Start writing…"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Focus mode: full screen editor with collapsible side panels (portal to body)
  const [focusLeftOpen, setFocusLeftOpen] = useState(false);
  const [focusRightOpen, setFocusRightOpen] = useState(false);

  if (focusMode) {
    const focusLeftBar = (
      <div className="w-10 border-r border-border bg-muted/30 flex flex-col items-center py-3 gap-2 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFocusLeftOpen(true)}>
                <PanelLeftOpen className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right"><p className="text-xs">Open Sections</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    );

    const focusRightBar = (
      <div className="w-10 border-l border-border bg-muted/30 flex flex-col items-center py-3 gap-2 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFocusRightOpen(true)}>
                <PanelRightOpen className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left"><p className="text-xs">Open AI Tools</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Bot className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    );

    const focusLeftPanel = (
      <div className="h-full flex flex-col bg-card border-r border-border" style={{ width: 280 }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFocusLeftOpen(false)}>
            <PanelLeftClose className="h-3.5 w-3.5" />
          </Button>
        </div>
        <SectionBuilder activeSectionId={activeSectionId} onSelectSection={setActiveSectionId} />
      </div>
    );

    const focusRightPanel = (
      <div className="h-full flex flex-col bg-card border-l border-border" style={{ width: 320 }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tools</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFocusRightOpen(false)}>
            <PanelRightClose className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Tabs value={rightTab} onValueChange={setRightTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full rounded-none border-b border-border h-auto p-0 bg-transparent shrink-0">
            <TabsTrigger value="ai-assist" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs">
              <Sparkles className="h-3 w-3 mr-1" /> AI Assist
            </TabsTrigger>
            <TabsTrigger value="reviewer" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs">Reviewer</TabsTrigger>
            <TabsTrigger value="citations" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs">Citations</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-hidden">
            <TabsContent value="ai-assist" className="mt-0 h-full">
              <AIChatPanel activeSectionId={activeSectionId} onInsertContent={handleInsertAIContent} />
            </TabsContent>
            <TabsContent value="reviewer" className="p-3">
              <p className="text-xs text-muted-foreground">Reviewer tools here.</p>
            </TabsContent>
            <TabsContent value="citations" className="p-3">
              <p className="text-xs text-muted-foreground">Citation tools here.</p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );

    return createPortal(
      <div className="animate-fade-in h-screen flex flex-col bg-background fixed inset-0 z-[9999]">
        {/* Focus mode toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" onClick={toggleFocusMode}>
              <Minimize2 className="h-3.5 w-3.5" /> Exit Focus
            </Button>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">{activeSection?.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{activeSection?.content.split(/\s+/).filter(Boolean).length} words</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/50 text-xs">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span className="font-medium">{project.integrityScore}</span>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleSaveVersion}>
              <Save className="h-3 w-3 mr-1" /> Save
            </Button>
            {savedToast && <span className="text-xs text-success flex items-center gap-1 animate-fade-in"><CheckCircle2 className="h-3 w-3" /> Saved</span>}
          </div>
        </div>

        {/* Focus mode body with collapsible panels */}
        <div className="flex-1 flex overflow-hidden">
          {focusLeftOpen ? focusLeftPanel : focusLeftBar}
          <div className="flex-1 overflow-y-auto">
            {editorContent}
          </div>
          {focusRightOpen ? focusRightPanel : focusRightBar}
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Document Editor" subtitle="Write and organize your research" breadcrumb={project.title} />

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/50 text-xs">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span className="font-medium">Integrity: {project.integrityScore}</span>
        </div>
        <ContextAwareIndicator />
        <Dialog open={citationModalOpen} onOpenChange={setCitationModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs"><Quote className="h-3.5 w-3.5 mr-1" /> Cite</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Insert Citation</DialogTitle></DialogHeader>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search references…" value={citationSearch} onChange={e => setCitationSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {citationResults.map(ref => (
                <div key={ref.id} className="p-3 border border-border rounded-lg flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{ref.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ref.authors[0]} · {ref.year}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleInsertCitation(ref)}>Insert</Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleSaveVersion}><Save className="h-3.5 w-3.5 mr-1" /> Save</Button>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => nav("export")}><Download className="h-3.5 w-3.5 mr-1" /> Export</Button>
        <div className="h-4 w-px bg-border mx-1" />
        {rightToolbarButtons}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={focusMode ? "default" : "outline"} size="sm" className="h-7 text-xs gap-1.5" onClick={toggleFocusMode}>
                <Maximize2 className="h-3.5 w-3.5" /> Focus
              </Button>
            </TooltipTrigger>
            <TooltipContent><p className="text-xs">Distraction-free writing mode</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {savedToast && <span className="text-xs text-success flex items-center gap-1 animate-fade-in"><CheckCircle2 className="h-3 w-3" /> Saved</span>}
      </div>

      {/* Main layout */}
      <div className="h-[calc(100vh-14rem)] flex rounded-lg border border-border overflow-hidden bg-card">
        {/* Left collapsed bar or panel */}
        {!leftOpen && !focusMode && collapsedLeftBar}

        {leftOpen ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
              {leftPanelContent}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={50}>
              {editorContent}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1">{editorContent}</div>
        )}
      </div>

      {/* Right panel as floating overlay */}
      {rightOpen && !focusMode && rightPanelContent}

      {/* Floating AI button */}
      {!rightOpen && !focusMode && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setRightOpen(true)}
                className="fixed bottom-6 right-6 h-11 w-11 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform z-40"
              >
                <Bot className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left"><p className="text-xs">Open AI Tools</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default Editor;
