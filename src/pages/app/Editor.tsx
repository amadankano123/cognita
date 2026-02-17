import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  BookOpen, Search, Save, Download, AlertTriangle, CheckCircle2, Quote, ShieldCheck,
  Sparkles, Wand2, Loader2, ChevronDown, ChevronRight, Target, HelpCircle, Scale,
  Crosshair, FlaskConical, Lightbulb
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ContextAwareIndicator from "@/components/layout/ContextAwareIndicator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// --- AI Content Templates ---
interface AiSubSection {
  id: string;
  label: string;
  icon: React.ElementType;
  prompt: string;
  generated: string;
}

const introductionSubSections: AiSubSection[] = [
  {
    id: "statement-of-problem",
    label: "Statement of Problem",
    icon: Target,
    prompt: "Generate a statement of the problem for this research topic.",
    generated: "",
  },
  {
    id: "research-questions",
    label: "Research Questions",
    icon: HelpCircle,
    prompt: "Generate research questions for this study.",
    generated: "",
  },
  {
    id: "justification",
    label: "Justification",
    icon: Scale,
    prompt: "Generate the justification / rationale for this study.",
    generated: "",
  },
  {
    id: "aim-objectives",
    label: "Aim & Objectives",
    icon: Crosshair,
    prompt: "Generate the aim and specific objectives for this study.",
    generated: "",
  },
  {
    id: "research-hypothesis",
    label: "Research Hypothesis",
    icon: FlaskConical,
    prompt: "Generate research hypotheses aligned with each objective.",
    generated: "",
  },
];

// Simulated AI content generator
function simulateAiContent(projectTitle: string, subSectionId: string): string {
  const map: Record<string, string> = {
    "statement-of-problem":
      `Crop diseases remain one of the most significant threats to global food security, causing estimated annual losses exceeding $220 billion worldwide (FAO, 2023). In sub-Saharan Africa, where agriculture employs over 60% of the population, late detection of plant diseases leads to yield losses of 20–40% per season. Traditional diagnostic methods rely on visual inspection by trained pathologists, whose availability is critically limited in rural farming communities. While recent advances in computer vision and deep learning have shown promise for automated disease identification, existing models exhibit poor generalization to real-world field conditions characterized by variable lighting, background complexity, and disease co-occurrence. There is therefore an urgent need for robust, deployable AI systems that can accurately detect crop diseases from field-captured imagery in resource-constrained settings.`,
    "research-questions":
      `This study seeks to answer the following research questions:\n\n1. How effectively can a channel-attention convolutional neural network classify crop diseases from field-captured images compared to existing baseline models?\n\n2. What is the impact of Squeeze-and-Excitation (SE) attention mechanisms on classification accuracy for visually similar disease pairs?\n\n3. To what extent does training on combined laboratory and field imagery improve model generalization to real-world conditions?\n\n4. Can the proposed model achieve inference latency suitable for real-time deployment on mobile and edge devices used by smallholder farmers?`,
    "justification":
      `The justification for this study is threefold:\n\n**Scientific Relevance:** While deep learning models have achieved near-perfect accuracy on curated datasets like PlantVillage, their performance under field conditions drops by 10–15%, limiting practical applicability (Ferentinos, 2018). This study addresses this critical gap through attention-enhanced architectures and mixed-source training data.\n\n**Socio-Economic Impact:** Smallholder farmers, who produce approximately 80% of food in developing nations, lack access to expert pathologists. An affordable, mobile-based diagnostic tool could prevent up to $50 billion in annual crop losses across Africa and South Asia.\n\n**Technological Contribution:** The study contributes a novel CropNet architecture that balances classification accuracy with computational efficiency, enabling edge deployment—an area underexplored in current agricultural AI research.`,
    "aim-objectives":
      `**Aim:**\nTo develop and evaluate a deep learning-based framework for the automated early detection and classification of crop diseases from field-captured imagery, optimized for deployment on mobile and edge devices.\n\n**Specific Objectives:**\n\n1. To curate and preprocess a composite dataset of 54,000+ crop disease images from both laboratory (PlantVillage) and field survey sources.\n\n2. To design and implement a channel-attention CNN architecture (CropNet) based on EfficientNet-B3 with Squeeze-and-Excitation blocks.\n\n3. To evaluate CropNet's classification performance against baseline models (ResNet-50, standard EfficientNet-B3) across 38 disease categories.\n\n4. To assess model generalization by comparing performance on laboratory versus field-captured test images.\n\n5. To optimize the model for mobile deployment and benchmark inference latency on mid-range smartphone hardware.`,
    "research-hypothesis":
      `The following hypotheses correspond to each research objective:\n\n**H₁:** A composite dataset combining laboratory and field-captured images will produce statistically significantly higher field-condition accuracy than training on laboratory images alone (α = 0.05).\n\n**H₂:** The CropNet architecture with SE attention blocks will achieve significantly higher classification accuracy (≥95%) compared to baseline EfficientNet-B3 and ResNet-50 models on the test set.\n\n**H₃:** CropNet will demonstrate ≤5% accuracy degradation between laboratory and field test sets, compared to ≥10% degradation in baseline models.\n\n**H₄:** Attention mechanisms will produce the largest accuracy improvements for visually similar disease pairs (e.g., early blight vs. late blight).\n\n**H₅:** The optimized CropNet model will achieve inference latency of ≤100ms on mid-range smartphone devices, enabling real-time field diagnosis.`,
  };
  return map[subSectionId] || `AI-generated content for "${projectTitle}" — ${subSectionId}. This is simulated content for the prototype.`;
}

// Generic section AI content
function simulateGenericAiContent(sectionTitle: string, projectTitle: string): string {
  const map: Record<string, string> = {
    "Abstract": `This study presents a comprehensive investigation into ${projectTitle.toLowerCase()}. Employing a mixed-methods approach combining quantitative analysis and qualitative validation, the research addresses critical gaps identified in current literature. The findings demonstrate significant improvements over existing approaches, with implications for both academic understanding and practical deployment in resource-constrained environments.`,
    "Literature Review": `A systematic review of the literature reveals three dominant themes in this field:\n\n**Theme 1: Foundational Approaches**\nEarly work established baseline methodologies that subsequent studies built upon. Key contributions include foundational datasets and benchmark evaluations.\n\n**Theme 2: Modern Computational Methods**\nRecent advances in machine learning and deep learning have transformed the field, with studies reporting significant accuracy improvements. However, generalization to real-world conditions remains a challenge.\n\n**Theme 3: Deployment and Accessibility**\nA growing body of literature addresses the gap between research accuracy and practical deployment, particularly in resource-limited settings.`,
    "Methodology": `**Research Design**\nThis study employs a quantitative experimental research design with a comparative evaluation framework.\n\n**Data Collection**\nData was systematically collected from multiple sources to ensure diversity and representativeness. Preprocessing steps include normalization, quality filtering, and stratified partitioning.\n\n**Analysis Framework**\nThe analysis pipeline consists of three stages: (1) feature extraction, (2) model training with cross-validation, and (3) statistical evaluation using standard metrics.`,
    "Results": `The experimental results demonstrate the effectiveness of the proposed approach:\n\n**Primary Findings:**\n- The proposed method achieved superior performance compared to all baseline approaches (p < 0.001)\n- Robustness testing confirmed consistent performance across varied conditions\n- Ablation studies validated the contribution of each architectural component\n\n**Statistical Significance:**\nAll primary comparisons reached statistical significance at α = 0.05 with appropriate corrections for multiple testing.`,
    "Discussion": `The findings of this study contribute to the field in several important ways:\n\n**Theoretical Implications:**\nThe results support and extend existing theoretical frameworks, providing evidence for the effectiveness of attention-based approaches in complex classification tasks.\n\n**Practical Implications:**\nThe demonstrated feasibility of deployment on resource-constrained devices opens new avenues for practical application in underserved communities.\n\n**Limitations:**\nSeveral limitations should be acknowledged, including dataset representation bias, single-label classification constraints, and the need for longitudinal validation studies.`,
    "Conclusion": `This study has achieved its primary objectives by developing and evaluating an effective approach for the stated research problem. The key contributions include: (1) a novel methodology with demonstrated superiority over existing baselines, (2) comprehensive evaluation under both controlled and real-world conditions, and (3) practical deployment considerations for resource-constrained settings. Future work should address the identified limitations and extend the approach to additional domains.`,
  };
  return map[sectionTitle] || `AI-generated content suggestion for the "${sectionTitle}" section of your research on "${projectTitle}". Review and customize this content to match your specific research context and findings.`;
}

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

  // AI Assist state
  const [aiSubSections, setAiSubSections] = useState<AiSubSection[]>(introductionSubSections.map(s => ({ ...s })));
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const [aiGeneratingSection, setAiGeneratingSection] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState(project.title);
  const [aiSectionTarget, setAiSectionTarget] = useState("introduction");

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
      insertCitation(activeSection.id, `(${ref.authors[0].split(",")[0]} et al., ${ref.year})`);
    }
    setCitationModalOpen(false);
  };

  const handleSaveVersion = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleApplyRewrite = () => {
    incrementAiUsage(project.id);
  };

  // AI: Generate intro sub-section
  const handleGenerateSubSection = (subId: string) => {
    setGeneratingId(subId);
    setTimeout(() => {
      const content = simulateAiContent(project.title, subId);
      setAiSubSections(prev => prev.map(s => s.id === subId ? { ...s, generated: content } : s));
      setExpandedSubs(prev => new Set(prev).add(subId));
      setGeneratingId(null);
      incrementAiUsage(project.id);
    }, 1500);
  };

  // AI: Insert generated sub-section content into the Introduction section
  const handleInsertSubContent = (content: string) => {
    const introSection = project.sections.find(s => s.title === "Introduction");
    if (introSection) {
      updateSection(introSection.id, introSection.content + "\n\n" + content);
      setActiveSectionId(introSection.id);
    }
    incrementAiUsage(project.id);
  };

  // AI: Generate content for any section
  const handleGenerateSectionContent = () => {
    setAiGeneratingSection(true);
    const sectionTitle = project.sections.find(s => s.id === activeSectionId)?.title || "Abstract";
    setTimeout(() => {
      const content = simulateGenericAiContent(sectionTitle, aiTopicInput || project.title);
      if (activeSection) {
        updateSection(activeSection.id, content);
      }
      setAiGeneratingSection(false);
      incrementAiUsage(project.id);
    }, 2000);
  };

  // AI: Generate topic suggestion
  const handleGenerateTopic = () => {
    setAiGeneratingSection(true);
    setTimeout(() => {
      setAiTopicInput("AI-Based Early Detection of Crop Diseases Using Computer Vision and Attention Mechanisms for Smallholder Farmers in Sub-Saharan Africa");
      setAiGeneratingSection(false);
    }, 1000);
  };

  const toggleExpanded = (id: string) => {
    setExpandedSubs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Document Editor" subtitle="Write and organize your research" breadcrumb={project.title} />

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/50 text-xs">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span className="font-medium">Integrity: {project.integrityScore}</span>
        </div>
        <ContextAwareIndicator />
        <Dialog open={citationModalOpen} onOpenChange={setCitationModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><Quote className="h-4 w-4 mr-1" /> Insert Citation</Button>
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
        <Button variant="outline" size="sm" onClick={handleSaveVersion}><Save className="h-4 w-4 mr-1" /> Save</Button>
        <Button variant="outline" size="sm" onClick={() => nav("export")}><Download className="h-4 w-4 mr-1" /> Export</Button>
        {savedToast && <span className="text-xs text-success flex items-center gap-1 animate-fade-in"><CheckCircle2 className="h-3 w-3" /> Saved</span>}
      </div>

      <div className="flex gap-4 h-[calc(100vh-15rem)]">
        {/* Section Navigator */}
        <Card className="w-48 shrink-0 shadow-card overflow-y-auto">
          <div className="p-3 border-b border-border"><h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections</h3></div>
          <div className="py-1">
            {project.sections.map(s => (
              <button key={s.id} onClick={() => setActiveSectionId(s.id)} className={cn("w-full text-left px-3 py-2 text-sm transition-colors", activeSectionId === s.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted")}>
                {s.order}. {s.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Main editor */}
        <Card className="flex-1 shadow-card flex flex-col overflow-hidden">
          {activeSection && (
            <>
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold">{activeSection.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{activeSection.content.split(/\s+/).length} words</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={handleGenerateSectionContent} disabled={aiGeneratingSection}>
                  {aiGeneratingSection ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  AI Generate
                </Button>
              </div>
              <Textarea value={activeSection.content} onChange={e => updateSection(activeSection.id, e.target.value)} className="flex-1 border-0 rounded-none resize-none focus-visible:ring-0 p-4 text-sm leading-relaxed font-body" placeholder="Start writing…" />
            </>
          )}
        </Card>

        {/* Right sidebar */}
        <Card className="w-80 shrink-0 shadow-card overflow-y-auto">
          <Tabs value={rightTab} onValueChange={setRightTab}>
            <TabsList className="w-full rounded-none border-b border-border h-auto p-0 bg-transparent">
              <TabsTrigger value="ai-assist" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> AI Assist
              </TabsTrigger>
              <TabsTrigger value="reviewer" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-xs">Reviewer</TabsTrigger>
              <TabsTrigger value="citations" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 text-xs">Citations</TabsTrigger>
            </TabsList>

            {/* AI Assist Tab */}
            <TabsContent value="ai-assist" className="p-3 space-y-4 mt-0">
              {/* Topic Generator */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Research Topic</Label>
                <div className="flex gap-1.5">
                  <Input
                    value={aiTopicInput}
                    onChange={e => setAiTopicInput(e.target.value)}
                    placeholder="Enter or generate a topic…"
                    className="text-xs h-8"
                  />
                  <Button size="sm" variant="outline" className="h-8 px-2 shrink-0" onClick={handleGenerateTopic} disabled={aiGeneratingSection}>
                    <Lightbulb className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Introduction Sub-sections */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Wand2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Introduction Builder</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">Generate structured content for your introduction section with AI.</p>

                {aiSubSections.map(sub => (
                  <Collapsible key={sub.id} open={expandedSubs.has(sub.id)} onOpenChange={() => toggleExpanded(sub.id)}>
                    <div className="border border-border rounded-lg overflow-hidden mb-1.5">
                      <div className="flex items-center justify-between px-3 py-2 bg-muted/30">
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors flex-1 text-left">
                          {expandedSubs.has(sub.id) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          <sub.icon className="h-3.5 w-3.5 text-primary" />
                          {sub.label}
                          {sub.generated && <CheckCircle2 className="h-3 w-3 text-primary ml-auto" />}
                        </CollapsibleTrigger>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[10px] gap-1"
                          onClick={(e) => { e.stopPropagation(); handleGenerateSubSection(sub.id); }}
                          disabled={generatingId === sub.id}
                        >
                          {generatingId === sub.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          {sub.generated ? "Regenerate" : "Generate"}
                        </Button>
                      </div>
                      <CollapsibleContent>
                        {sub.generated ? (
                          <div className="p-3 space-y-2">
                            <div className="text-xs text-foreground leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto bg-background rounded p-2 border border-border">
                              {sub.generated}
                            </div>
                            <div className="flex gap-1.5">
                              <Button size="sm" className="h-7 text-[10px] flex-1 gap-1" onClick={() => handleInsertSubContent(sub.generated)}>
                                <Download className="h-3 w-3" /> Insert into Introduction
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center">
                            <p className="text-[10px] text-muted-foreground">Click "Generate" to create content</p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>

              {/* Quick AI actions */}
              <div className="border-t border-border pt-3 space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</span>
                <div className="grid gap-1.5">
                  <Button size="sm" variant="outline" className="justify-start h-8 text-xs gap-2" onClick={() => { setActiveSectionId(project.sections[0]?.id); handleGenerateSectionContent(); }}>
                    <Sparkles className="h-3 w-3 text-primary" /> Generate Abstract
                  </Button>
                  <Button size="sm" variant="outline" className="justify-start h-8 text-xs gap-2" onClick={() => {
                    const litSection = project.sections.find(s => s.title === "Literature Review");
                    if (litSection) { setActiveSectionId(litSection.id); setTimeout(handleGenerateSectionContent, 100); }
                  }}>
                    <Sparkles className="h-3 w-3 text-primary" /> Generate Literature Review
                  </Button>
                  <Button size="sm" variant="outline" className="justify-start h-8 text-xs gap-2" onClick={() => {
                    const methSection = project.sections.find(s => s.title === "Methodology");
                    if (methSection) { setActiveSectionId(methSection.id); setTimeout(handleGenerateSectionContent, 100); }
                  }}>
                    <Sparkles className="h-3 w-3 text-primary" /> Generate Methodology
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Reviewer Tab */}
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

            {/* Citations Tab */}
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
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
