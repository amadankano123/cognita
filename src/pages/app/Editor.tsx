import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const Editor = () => {
  const { project, updateSection } = useProject();
  const [activeSectionId, setActiveSectionId] = useState(project.sections[0]?.id);
  const activeSection = project.sections.find((s) => s.id === activeSectionId);

  return (
    <div className="max-w-6xl animate-fade-in">
      <PageHeader
        title="Proposal Editor"
        subtitle="Write and organize your research proposal"
        breadcrumb={project.title}
      />

      <div className="flex gap-4 h-[calc(100vh-13rem)]">
        {/* Section outline */}
        <Card className="w-56 shrink-0 shadow-card overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sections</h3>
          </div>
          <div className="py-1">
            {project.sections.map((s) => (
              <button
                key={s.id}
                id={`section-${s.id}`}
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
      </div>
    </div>
  );
};

export default Editor;
