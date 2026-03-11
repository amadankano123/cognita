import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Clock, Target, Award } from "lucide-react";
import { mockSupervisedStudents } from "@/data/mockSupervisor";

const SupervisorAnalytics = () => {
  const students = mockSupervisedStudents;
  const avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length);
  const avgSimilarity = Math.round(students.reduce((a, s) => a + s.similarityIndex, 0) / students.length);
  const avgAI = Math.round(students.reduce((a, s) => a + s.aiDetectionScore, 0) / students.length);

  const stageDistribution = ["Proposal", "Literature Review", "Data Collection", "Analysis", "Writing", "Submission"].map(stage => ({
    stage,
    count: students.filter(s => s.stage === stage).length,
  }));

  const degreeStats = [
    { level: "Undergraduate", students: students.filter(s => s.degreeLevel === "Undergraduate") },
    { level: "Master's", students: students.filter(s => s.degreeLevel === "Master's") },
    { level: "PhD", students: students.filter(s => s.degreeLevel === "PhD") },
  ].filter(d => d.students.length > 0);

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Analytics" subtitle="Performance metrics and insights across your supervised students" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 text-center shadow-card">
          <Users className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.length}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <Target className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{avgProgress}%</p>
          <p className="text-xs text-muted-foreground">Avg Progress</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <TrendingUp className="h-5 w-5 text-[hsl(var(--success))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.filter(s => s.progress >= 70).length}</p>
          <p className="text-xs text-muted-foreground">Near Completion</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <Clock className="h-5 w-5 text-[hsl(var(--warning))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{students.filter(s => s.progress < 30).length}</p>
          <p className="text-xs text-muted-foreground">Early Stage</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{avgSimilarity}%</p>
          <p className="text-xs text-muted-foreground">Avg Similarity</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <Award className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold">{avgAI}%</p>
          <p className="text-xs text-muted-foreground">Avg AI Score</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <Card className="shadow-card">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Stage Distribution</h3></div>
          <div className="p-4 space-y-3">
            {stageDistribution.map(({ stage, count }) => (
              <div key={stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{stage}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <Progress value={(count / students.length) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* By Degree Level */}
        <Card className="shadow-card">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Performance by Degree</h3></div>
          <div className="p-4 space-y-5">
            {degreeStats.map(({ level, students: group }) => {
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

        {/* Compliance Overview */}
        <Card className="shadow-card lg:col-span-2">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold">Compliance & Integrity Metrics</h3></div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {students.map(s => (
                <div key={s.id} className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm font-medium mb-2">{s.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Similarity</span><span className="font-medium text-foreground">{s.similarityIndex}%</span></div>
                    <div className="flex justify-between"><span>AI Detection</span><span className="font-medium text-foreground">{s.aiDetectionScore}%</span></div>
                    <div className="flex justify-between"><span>Progress</span><span className="font-medium text-foreground">{s.progress}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorAnalytics;
