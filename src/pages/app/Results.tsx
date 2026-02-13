import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Results = () => {
  const { project } = useProject();
  const completedAnalyses = project.analysisResults.filter((a) => a.status === "completed");

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="Results"
        subtitle="Summary of your research findings"
        breadcrumb={project.title}
      />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Project Completion</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-primary">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2 mb-3" />
          <p className="text-sm text-muted-foreground">
            {project.wordCount.toLocaleString()} of {project.targetWordCount.toLocaleString()} target words written
          </p>
        </Card>

        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Analysis Results</h3>
          <p className="text-3xl font-bold text-primary mb-2">{completedAnalyses.length}</p>
          <p className="text-sm text-muted-foreground">completed analyses out of {project.analysisResults.length}</p>
        </Card>
      </div>

      {completedAnalyses.length > 0 && (
        <Card className="shadow-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-display font-semibold">Key Findings</h3>
          </div>
          <div className="divide-y divide-border">
            {completedAnalyses.map((a) => (
              <div key={a.id} className="p-4">
                <h4 className="font-medium text-sm">{a.title}</h4>
                {a.summary && <p className="text-sm text-muted-foreground mt-1">{a.summary}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Results;
