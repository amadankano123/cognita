import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { useInstitution } from "@/context/InstitutionContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  BookOpen, Search, Save, Download, AlertTriangle, CheckCircle2, Quote, ShieldCheck,
  Sparkles, PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen, Maximize2, Minimize2, FileText, Bot, X,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo2, Redo2, Minus, Highlighter, Subscript, Superscript,
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

const FONT_FAMILIES = [
  "Times New Roman", "Arial", "Calibri", "Georgia", "Garamond", "Cambria", "Helvetica", "Verdana",
];
const FONT_SIZES = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"];
const LINE_SPACINGS = ["1.0", "1.15", "1.5", "2.0", "2.5", "3.0"];

// A4 page constants (in px approximation at 96dpi)
const PAGE_HEIGHT_PX = 1056; // ~11in
const PAGE_PADDING_TOP = 96; // 1in
const PAGE_PADDING_BOTTOM = 96;
const PAGE_PADDING_X = 72; // ~0.75in
const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT_PX - PAGE_PADDING_TOP - PAGE_PADDING_BOTTOM;

// ===== FORMATTING TOOLBAR COMPONENT =====
const FormattingToolbar = ({
  fontFamily, setFontFamily,
  fontSize, setFontSize,
  lineSpacing, setLineSpacing,
  compact = false,
}: {
  fontFamily: string; setFontFamily: (v: string) => void;
  fontSize: string; setFontSize: (v: string) => void;
  lineSpacing: string; setLineSpacing: (v: string) => void;
  compact?: boolean;
}) => {
  const btnClass = cn("h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors", compact && "h-6 w-6");
  const iconSize = compact ? "h-3 w-3" : "h-3.5 w-3.5";
  const divider = <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {/* Undo / Redo */}
      <TooltipProvider delayDuration={300}>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Undo2 className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Undo</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Redo2 className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Redo</p></TooltipContent></Tooltip>
      </TooltipProvider>

      {divider}

      {/* Font Family */}
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <SelectTrigger className="h-7 w-[130px] text-xs border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILIES.map(f => (
            <SelectItem key={f} value={f} className="text-xs" style={{ fontFamily: f }}>{f}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Font Size */}
      <Select value={fontSize} onValueChange={setFontSize}>
        <SelectTrigger className="h-7 w-[60px] text-xs border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_SIZES.map(s => (
            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {divider}

      {/* Text formatting */}
      <TooltipProvider delayDuration={300}>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Bold className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Bold (Ctrl+B)</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Italic className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Italic (Ctrl+I)</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Underline className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Underline (Ctrl+U)</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Strikethrough className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Strikethrough</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Subscript className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Subscript</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Superscript className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Superscript</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Highlighter className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Highlight</p></TooltipContent></Tooltip>
      </TooltipProvider>

      {divider}

      {/* Alignment */}
      <TooltipProvider delayDuration={300}>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><AlignLeft className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Align Left</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><AlignCenter className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Center</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><AlignRight className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Align Right</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><AlignJustify className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Justify</p></TooltipContent></Tooltip>
      </TooltipProvider>

      {divider}

      {/* Lists */}
      <TooltipProvider delayDuration={300}>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><List className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Bullet List</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><ListOrdered className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Numbered List</p></TooltipContent></Tooltip>
      </TooltipProvider>

      {divider}

      {/* Line Spacing */}
      <Select value={lineSpacing} onValueChange={setLineSpacing}>
        <SelectTrigger className="h-7 w-[65px] text-xs border-border">
          <SelectValue placeholder="1.5" />
        </SelectTrigger>
        <SelectContent>
          {LINE_SPACINGS.map(s => (
            <SelectItem key={s} value={s} className="text-xs">{s}x</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {divider}

      {/* Horizontal Rule */}
      <TooltipProvider delayDuration={300}>
        <Tooltip><TooltipTrigger asChild><button className={btnClass}><Minus className={iconSize} /></button></TooltipTrigger><TooltipContent><p className="text-xs">Horizontal Line</p></TooltipContent></Tooltip>
      </TooltipProvider>
    </div>
  );
};

// ===== PAGINATED EDITOR COMPONENT =====
const PaginatedEditor = ({
  content, onChange, fontFamily, fontSize, lineSpacing, textareaRef, onSelect,
}: {
  content: string;
  onChange: (val: string) => void;
  fontFamily: string;
  fontSize: string;
  lineSpacing: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onSelect: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineHeightNum = parseFloat(lineSpacing) * parseFloat(fontSize) * 1.333; // px approx
  const linesPerPage = Math.floor(PAGE_CONTENT_HEIGHT / lineHeightNum);
  const lines = content.split("\n");
  
  // Calculate how many pages we need (minimum 1)
  const charsPerLine = Math.floor((816 - PAGE_PADDING_X * 2) / (parseFloat(fontSize) * 0.6));
  let totalVisualLines = 0;
  for (const line of lines) {
    totalVisualLines += Math.max(1, Math.ceil((line.length || 1) / Math.max(1, charsPerLine)));
  }
  const pageCount = Math.max(1, Math.ceil(totalVisualLines / Math.max(1, linesPerPage)));

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-muted/30 py-8">
      <div className="flex flex-col items-center gap-6">
        {/* Pages */}
        {Array.from({ length: pageCount }, (_, pageIdx) => (
          <div
            key={pageIdx}
            className="bg-card shadow-elevated rounded-sm relative"
            style={{
              width: 816, // ~8.5in at 96dpi
              minHeight: PAGE_HEIGHT_PX,
              padding: `${PAGE_PADDING_TOP}px ${PAGE_PADDING_X}px ${PAGE_PADDING_BOTTOM}px`,
            }}
          >
            {/* Page number */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-[10px] text-muted-foreground">{pageIdx + 1}</span>
            </div>
            {pageIdx === 0 && (
              <textarea
                ref={textareaRef as any}
                value={content}
                onChange={e => onChange(e.target.value)}
                onSelect={onSelect}
                onClick={onSelect}
                onKeyUp={onSelect}
                className="w-full bg-transparent border-0 outline-none resize-none focus:ring-0 focus-visible:ring-0 text-foreground"
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineSpacing,
                  minHeight: `${PAGE_CONTENT_HEIGHT * pageCount}px`,
                }}
                placeholder="Start writing…"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  // Formatting state
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [fontSize, setFontSize] = useState("12");
  const [lineSpacing, setLineSpacing] = useState("1.5");

  // Responsive auto-collapse
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 900) setLeftOpen(false); };
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
      if (window.innerWidth >= 900) setLeftOpen(true);
    }
  };

  const getBreadcrumb = () => {
    if (!activeSection) return null;
    const parts: string[] = [project.title];
    const meta = project.sectionMeta.find(m => `tmpl-${m.key}` === activeSectionId);
    if (meta?.parentKey) {
      const parentMeta = project.sectionMeta.find(m => m.key === meta.parentKey);
      if (parentMeta) parts.push(parentMeta.key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    }
    parts.push(activeSection.title);
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
      <div className="fixed inset-0 z-40 bg-black/20 animate-fade-in" onClick={() => setRightOpen(false)} />
      <div className="fixed right-4 top-20 bottom-4 z-50 w-[380px] max-w-[90vw] bg-card border border-border rounded-xl shadow-elevated flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Tools</span>
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

  // ===== MAIN EDITOR CONTENT =====
  const editorContent = (
    <div className={cn(
      "flex-1 flex flex-col h-full overflow-hidden transition-colors duration-300",
      focusMode && "bg-muted/40",
    )}>
      {/* Sticky section header with breadcrumb */}
      {activeSection && (
        <div className={cn(
          "sticky top-0 z-10 bg-card border-b border-border px-6 py-2 shrink-0",
          focusMode && "bg-card/95 backdrop-blur-sm"
        )}>
          {breadcrumb && breadcrumb.length > 1 && (
            <Breadcrumb className="mb-1">
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
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      {activeSection && (
        <div className="bg-card border-b border-border px-4 py-1.5 shrink-0 overflow-x-auto">
          <FormattingToolbar
            fontFamily={fontFamily} setFontFamily={setFontFamily}
            fontSize={fontSize} setFontSize={setFontSize}
            lineSpacing={lineSpacing} setLineSpacing={setLineSpacing}
          />
        </div>
      )}

      {/* Paginated Editor area */}
      {activeSection && (
        <PaginatedEditor
          content={activeSection.content}
          onChange={(val) => { updateSection(activeSection.id, val); }}
          fontFamily={fontFamily}
          fontSize={fontSize}
          lineSpacing={lineSpacing}
          textareaRef={textareaRef}
          onSelect={handleTextareaSelect}
        />
      )}
    </div>
  );

  // Focus mode
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

        {/* Focus mode body */}
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

      {/* Toolbar — only Integrity, Context AI, Cite, Save, Export, Focus */}
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
