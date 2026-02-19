import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Users, AlertTriangle, CheckCircle, GraduationCap } from "lucide-react";
import { mockSupervisedStudents } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";

const SupervisorOverview = () => {
  const students = mockSupervisedStudents;
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length);
  const critical = students.filter(s => s.complianceStatus === "Critical");
  const warning = students.filter(s => s.complianceStatus === "Warning");
  const byDegree = {
    PhD: students.filter(s => s.degreeLevel === "PhD"),
    "Master's": students.filter(s => s.degreeLevel === "Master's"),
    Undergraduate: students.filter(s => s.degreeLevel === "Undergraduate"),
  };

  const needsAttention = students
    .filter(s => s.complianceStatus !== "Good" || s.notifications.some(n => !n.read))
    .sort((a, b) => (a.complianceStatus === "Critical" ? -1 : 1));

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Supervisor Overview" subtitle="Summary of research supervision across all degree levels" />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 shadow-card text-center">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.length}</p>
          <p className="text-xs text-muted-foreground">Total Students</p>
        </Card>
        <Card className="p-4 shadow-card text-center">
          <GraduationCap className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{avgProgress}%</p>
          <p className="text-xs text-muted-foreground">Avg. Progress</p>
        </Card>
        <Card className="p-4 shadow-card text-center">
          <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{warning.length + critical.length}</p>
          <p className="text-xs text-muted-foreground">Need Attention</p>
        </Card>
        <Card className="p-4 shadow-card text-center">
          <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.filter(s => s.complianceStatus === "Good").length}</p>
          <p className="text-xs text-muted-foreground">On Track</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* By degree */}
        <Card className="shadow-card">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Progress by Degree Level</h3></div>
          <div className="p-4 space-y-5">
            {(Object.entries(byDegree) as [string, typeof students][]).map(([level, group]) => {
              if (group.length === 0) return null;
              const avg = Math.round(group.reduce((a, s) => a + s.progress, 0) / group.length);
              return (
                <div key={level}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{level} ({group.length})</span>
                    <span className="text-sm font-semibold">{avg}%</span>
                  </div>
                  <Progress value={avg} className="h-3" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {group.map(s => (
                      <Badge key={s.id} variant="secondary" className="text-xs">{s.name.split(" ")[0]} · {s.progress}%</Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI suggestions */}
        <Card className="shadow-card">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold">AI Recommendations</h3>
          </div>
          <div className="p-4 space-y-3">
            {needsAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">All students are on track. No immediate actions needed.</p>
            ) : (
              needsAttention.map(s => (
                <div key={s.id} className={cn("p-3 rounded-lg border", s.complianceStatus === "Critical" ? "border-destructive/30 bg-destructive/5" : "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5")}>
                  <p className="text-sm font-medium mb-1">{s.name} — {s.degreeLevel}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.complianceStatus === "Critical" 
                      ? `Critical: Similarity ${s.similarityIndex}%, AI detection ${s.aiDetectionScore}%. Revision needed before submission.`
                      : `Warning: Similarity at ${s.similarityIndex}%. Monitor and advise paraphrasing.`}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Stage distribution */}
        <Card className="shadow-card lg:col-span-2">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Students by Current Stage</h3></div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {["Proposal", "Literature Review", "Data Collection", "Analysis", "Writing", "Submission"].map(stage => {
                const count = students.filter(s => s.stage === stage).length;
                return (
                  <div key={stage} className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{stage}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorOverview;
