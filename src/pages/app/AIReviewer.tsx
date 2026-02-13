import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  major: "bg-warning text-warning-foreground",
  minor: "bg-secondary text-secondary-foreground",
  suggestion: "bg-accent text-accent-foreground",
};

const AIReviewer = () => {
  const { project } = useProject();
  const navigate = useNavigate();
  const totalScore = project.reviewScores.reduce((a, s) => a + s.score, 0);
  const maxTotal = project.reviewScores.reduce((a, s) => a + s.maxScore, 0);

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="AI Reviewer"
        subtitle="Automated assessment of your proposal"
        breadcrumb={project.title}
      />

      {/* Score overview */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Overall Score</h3>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold text-primary">{totalScore}</span>
            <span className="text-lg text-muted-foreground">/ {maxTotal}</span>
          </div>
          <div className="space-y-2">
            {project.reviewScores.map((s) => (
              <div key={s.category} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-40 shrink-0">{s.category}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(s.score / s.maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-10 text-right">{s.score}/{s.maxScore}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-3">Issue Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {(["critical", "major", "minor", "suggestion"] as const).map((sev) => {
              const count = project.reviewIssues.filter((i) => i.severity === sev).length;
              return (
                <div key={sev} className="text-center p-3 rounded-md bg-muted/50">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{sev}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Issues list */}
      <Card className="shadow-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Issues & Suggestions</h3>
        </div>
        <div className="divide-y divide-border">
          {project.reviewIssues.map((issue) => (
            <div key={issue.id} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={severityColors[issue.severity] + " text-xs"}>{issue.severity}</Badge>
                <button
                  onClick={() => navigate("/app/editor")}
                  className="text-xs text-primary hover:underline"
                >
                  Jump to: {issue.sectionTitle} →
                </button>
              </div>
              <p className="text-sm">{issue.message}</p>
              {issue.suggestion && (
                <p className="text-xs text-muted-foreground mt-1 italic">💡 {issue.suggestion}</p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AIReviewer;
