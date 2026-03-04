import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { SECTION_TEMPLATES, PROJECT_TYPES, ProjectType, TemplateSectionDef } from "@/data/sectionTemplates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  Lock, Plus, ChevronDown, ChevronRight, GripVertical,
  CheckCircle2, AlertCircle, AlertTriangle, MessageSquare,
  FileText, Eye,
} from "lucide-react";

interface SectionBuilderProps {
  activeSectionId: string | undefined;
  onSelectSection: (id: string) => void;
}

const SectionBuilder = ({ activeSectionId, onSelectSection }: SectionBuilderProps) => {
  const {
    project, switchProjectType, toggleSectionEnabled, addCustomSection,
    reorderSections, approveSection, commentOnSection, getComplianceStats,
  } = useProject();
  const { role } = useAuth();

  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [pendingType, setPendingType] = useState<ProjectType | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set(["ch1-introduction", "ch2-literature-review", "ch3-methodology", "introduction", "methodology"]));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [commentKey, setCommentKey] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const isStudent = role === "Undergraduate Student" || role === "Master's Student" || role === "PhD Student";
  const isSupervisor = role === "Supervisor";
  const isAdmin = role === "Research Director" || role === "Compliance Officer";
  const isResearcher = role === "Researcher";
  const canEdit = !isAdmin;
  const canDelete = isResearcher || isSupervisor;

  const currentType = project.projectType as ProjectType;
  const template = SECTION_TEMPLATES[currentType] || SECTION_TEMPLATES["Journal Article"];
  const compliance = getComplianceStats();

  const handleTypeChange = (val: string) => {
    setPendingType(val as ProjectType);
    setSwitchModalOpen(true);
  };

  const confirmSwitch = () => {
    if (pendingType) switchProjectType(pendingType);
    setSwitchModalOpen(false);
    setPendingType(null);
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addCustomSection(newSectionTitle.trim());
      setNewSectionTitle("");
      setAddSectionOpen(false);
    }
  };

  const toggleParent = (key: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleDragStart = (idx: number) => {
    if (!canEdit) return;
    setDragIdx(idx);
  };

  const handleDrop = (toIdx: number) => {
    if (dragIdx !== null && dragIdx !== toIdx && canEdit) {
      reorderSections(dragIdx, toIdx);
    }
    setDragIdx(null);
  };

  const getSectionStatus = (def: TemplateSectionDef): "approved" | "empty" | "missing" | "ok" => {
    const meta = project.sectionMeta.find(m => m.key === def.key);
    if (meta?.approved) return "approved";
    const sec = project.sections.find(s => s.id === `tmpl-${def.key}`);
    if (!sec) return "missing";
    if (!sec.content.trim()) return "empty";
    return "ok";
  };

  const getStatusBadge = (def: TemplateSectionDef) => {
    const status = getSectionStatus(def);
    if (status === "approved") return <CheckCircle2 className="h-3 w-3 text-success shrink-0" />;
    if (status === "missing" && def.mandatory) return <AlertCircle className="h-3 w-3 text-destructive shrink-0" />;
    if (status === "empty" && def.mandatory) return <AlertTriangle className="h-3 w-3 text-warning shrink-0" />;
    return null;
  };

  const renderSection = (def: TemplateSectionDef, idx: number, isChild = false) => {
    const sectionId = `tmpl-${def.key}`;
    const meta = project.sectionMeta.find(m => m.key === def.key);
    const isEnabled = meta?.enabled !== false;
    const isActive = activeSectionId === sectionId;
    const hasChildren = def.children && def.children.length > 0;
    const isExpanded = expandedParents.has(def.key);

    return (
      <div key={def.key}>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 text-xs rounded-md transition-colors group",
            isChild && "ml-4",
            isActive && isEnabled ? "bg-accent text-accent-foreground font-medium" : "",
            !isEnabled && "opacity-40",
            isAdmin && "cursor-default",
          )}
          draggable={canEdit && !isChild}
          onDragStart={() => handleDragStart(idx)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop(idx)}
        >
          {canEdit && !isChild && (
            <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
          )}

          {hasChildren ? (
            <button onClick={() => toggleParent(def.key)} className="shrink-0">
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
          )}

          <button
            onClick={() => isEnabled && onSelectSection(sectionId)}
            className={cn("flex-1 text-left truncate", !isEnabled && "line-through")}
            disabled={!isEnabled || isAdmin}
          >
            {def.title}
          </button>

          {getStatusBadge(def)}

          {def.mandatory && (
            <Lock className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
          )}

          {isSupervisor && (
            <button
              onClick={() => approveSection(def.key)}
              className="opacity-0 group-hover:opacity-100 shrink-0"
              title={meta?.approved ? "Unapprove" : "Approve"}
            >
              <CheckCircle2 className={cn("h-3 w-3", meta?.approved ? "text-success" : "text-muted-foreground")} />
            </button>
          )}

          {isSupervisor && (
            <button
              onClick={() => { setCommentKey(def.key); setCommentText(meta?.supervisorComment || ""); }}
              className="opacity-0 group-hover:opacity-100 shrink-0"
              title="Comment"
            >
              <MessageSquare className={cn("h-3 w-3", meta?.supervisorComment ? "text-primary" : "text-muted-foreground")} />
            </button>
          )}

          {isAdmin && (
            <Eye className="h-3 w-3 text-muted-foreground shrink-0" />
          )}

          {!def.mandatory && canEdit && !isChild && (
            <Switch
              checked={isEnabled}
              onCheckedChange={() => {
                if (isStudent && def.mandatory) return;
                toggleSectionEnabled(def.key);
              }}
              className="h-3.5 w-7 opacity-0 group-hover:opacity-100"
            />
          )}
        </div>

        {meta?.supervisorComment && (
          <div className={cn("mx-2 mb-1 px-2 py-1 text-[10px] bg-primary/5 text-primary rounded border border-primary/10", isChild && "ml-6")}>
            💬 {meta.supervisorComment}
          </div>
        )}

        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {def.children!.map((child, ci) => renderSection(child, idx + ci + 1, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Project Type Selector */}
      <div className="p-3 border-b border-border space-y-2">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Project Type</label>
        <Select value={currentType} onValueChange={handleTypeChange} disabled={isAdmin}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_TYPES.map(t => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Compliance Summary */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 flex-wrap">
        {compliance.missing > 0 && (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 gap-1">
            <AlertCircle className="h-2.5 w-2.5" /> {compliance.missing} missing
          </Badge>
        )}
        {compliance.empty > 0 && (
          <Badge className="bg-warning text-warning-foreground text-[10px] px-1.5 py-0 gap-1">
            <AlertTriangle className="h-2.5 w-2.5" /> {compliance.empty} empty
          </Badge>
        )}
        {compliance.approved > 0 && (
          <Badge className="bg-success text-success-foreground text-[10px] px-1.5 py-0 gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" /> {compliance.approved} approved
          </Badge>
        )}
        {compliance.missing === 0 && compliance.empty === 0 && (
          <span className="text-[10px] text-success flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> All sections complete
          </span>
        )}
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto py-2 px-1 space-y-0.5">
        <div className="px-2 mb-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Sections</span>
        </div>
        {template.map((def, idx) => renderSection(def, idx))}
      </div>

      {/* Add Section */}
      {canEdit && (
        <div className="p-2 border-t border-border">
          <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => setAddSectionOpen(true)}>
            <Plus className="h-3 w-3" /> Add Section
          </Button>
        </div>
      )}

      {/* Switch Type Confirmation Modal */}
      <Dialog open={switchModalOpen} onOpenChange={setSwitchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Project Type?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Switching from <strong>{currentType}</strong> to <strong>{pendingType}</strong> will restructure your sections. Existing content will be mapped to matching sections where possible. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSwitchModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmSwitch}>Switch Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Custom Section</DialogTitle></DialogHeader>
          <Input placeholder="Section title…" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddSection()} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSectionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={commentKey !== null} onOpenChange={() => setCommentKey(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Supervisor Comment</DialogTitle></DialogHeader>
          <Input placeholder="Leave a comment…" value={commentText} onChange={e => setCommentText(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentKey(null)}>Cancel</Button>
            <Button onClick={() => { if (commentKey) commentOnSection(commentKey, commentText); setCommentKey(null); }}>Save Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionBuilder;
