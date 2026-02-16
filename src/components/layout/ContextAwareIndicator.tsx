import { useProject } from "@/context/ProjectContext";
import { Brain, FileText, BookOpen, Database } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ContextAwareIndicator = () => {
  const { project } = useProject();

  const citedRefs = project.references.filter((r) => r.cited).length;
  const dataStatus = project.dataset.uploaded;

  const contextItems = [
    {
      icon: FileText,
      label: "Sections",
      value: `${project.sections.length} sections · ${project.wordCount.toLocaleString()} words`,
      active: true,
    },
    {
      icon: BookOpen,
      label: "References",
      value: `${project.references.length} refs · ${citedRefs} cited`,
      active: project.references.length > 0,
    },
    {
      icon: Database,
      label: "Dataset",
      value: dataStatus ? project.dataset.name : "Not loaded",
      active: dataStatus,
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-lg">
        <Brain className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-xs font-medium text-primary mr-1">Context-aware AI</span>
        <div className="flex items-center gap-1">
          {contextItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div
                  className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${
                    item.active
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p className="font-medium">{item.label}</p>
                <p className="text-muted-foreground">{item.value}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContextAwareIndicator;
