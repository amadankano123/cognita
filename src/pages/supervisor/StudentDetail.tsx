import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, FileText,
  BarChart3, Shield, MessageSquare, Sparkles, Check, X, Flag,
} from "lucide-react";
import { mockSupervisedStudents, type ComplianceStatus, type StageStatus } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";

const statusIcon = (s: StageStatus) => {
  const map = {
    completed: <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />, 
    "in-progress": <Clock className="h-4 w-4 text-[hsl(var(--warning))]" />,
    "not-started": <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />,
    "needs-revision": <AlertTriangle className="h-4 w-4 text-destructive" />,
  };
  return map[s];
};

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = mockSupervisedStudents.find(s => s.id === studentId);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("progress");

  if (!student) {
    return (
      <div className="max-w-5xl animate-fade-in">
        <Button variant="ghost" onClick={() => navigate("/supervisor/students")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="p-10 text-center text-muted-foreground">Student not found.</Card>
      </div>
    );
  }

  const daysToDeadline = student.deadline ? Math.max(0, Math.ceil((new Date(student.deadline).getTime() - Date.now()) / 86400000)) : null;

  const complianceColor: Record<ComplianceStatus, string> = {
    Good: "text-[hsl(var(--success))]",
    Warning: "text-[hsl(var(--warning))]",
    Critical: "text-destructive",
  };

  const aiSummary = student.complianceStatus === "Critical"
    ? `⚠️ Immediate attention required: ${student.name}'s similarity index (${student.similarityIndex}%) and AI detection (${student.aiDetectionScore}%) both exceed safe thresholds. Recommend requesting a revision of flagged sections before submission.`
    : student.complianceStatus === "Warning"
    ? `⚡ ${student.name}'s similarity index (${student.similarityIndex}%) is approaching the borderline threshold. Review the flagged sections and suggest proper paraphrasing. Overall progress is on track.`
    : `✅ ${student.name} is progressing well. All compliance metrics are within safe limits. Current focus: ${student.stage} stage.`;

  return (
    <div className="max-w-5xl animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/supervisor/students")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Students
      </Button>

      {/* Student header */}
      <Card className="p-5 mb-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {student.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="font-display text-xl font-semibold">{student.name}</h2>
              <Badge variant="outline" className="text-xs">{student.degreeLevel}</Badge>
              <Badge variant="outline" className={cn("text-xs", complianceColor[student.complianceStatus])}>
                {student.complianceStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{student.department} · {student.email}</p>
            <p className="text-sm font-medium">{student.projectTitle}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Stage: <strong className="text-foreground">{student.stage}</strong></span>
              <span>{student.wordCount.toLocaleString()} / {student.targetWordCount.toLocaleString()} words</span>
              {daysToDeadline !== null && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {daysToDeadline} days to deadline</span>}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={student.progress} className="h-2 flex-1 max-w-xs" />
              <span className="text-sm font-medium">{student.progress}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:shrink-0">
            <div className="p-2 rounded-lg bg-muted">
              <p className="text-lg font-bold">{student.integrityScore}</p>
              <p className="text-[10px] text-muted-foreground">Integrity</p>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <p className={cn("text-lg font-bold", student.similarityIndex > 20 ? "text-destructive" : "text-foreground")}>{student.similarityIndex}%</p>
              <p className="text-[10px] text-muted-foreground">Similarity</p>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <p className={cn("text-lg font-bold", student.aiDetectionScore > 30 ? "text-[hsl(var(--warning))]" : "text-foreground")}>{student.aiDetectionScore}%</p>
              <p className="text-[10px] text-muted-foreground">AI Detect</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Summary */}
      <Card className="p-4 mb-6 shadow-card border-l-4 border-l-primary">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1">AI Supervisor Summary</p>
            <p className="text-sm text-muted-foreground">{aiSummary}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          <TabsTrigger value="progress" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> Progress</TabsTrigger>
          <TabsTrigger value="writing" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Writing</TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Analysis</TabsTrigger>
          <TabsTrigger value="integrity" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Integrity</TabsTrigger>
          <TabsTrigger value="feedback" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Feedback</TabsTrigger>
        </TabsList>

        {/* ─── PROGRESS TAB ─── */}
        <TabsContent value="progress">
          <Card className="shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">Project Timeline & Milestones</h3>
            </div>
            <div className="p-4 space-y-3">
              {student.stages.map((stage, i) => (
                <div key={stage.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="shrink-0">{statusIcon(stage.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{stage.name}</p>
                    {stage.dueDate && <p className="text-xs text-muted-foreground">Due: {stage.dueDate}</p>}
                  </div>
                  <Badge variant={stage.status === "completed" ? "default" : "secondary"} className="text-xs capitalize">
                    {stage.status.replace("-", " ")}
                  </Badge>
                  {stage.supervisorApproved ? (
                    <Badge variant="outline" className="text-xs text-[hsl(var(--success))] gap-1"><Check className="h-3 w-3" /> Approved</Badge>
                  ) : stage.status === "completed" ? (
                    <Button size="sm" variant="outline" className="text-xs h-7">Approve</Button>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* ─── WRITING TAB ─── */}
        <TabsContent value="writing">
          <Card className="shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">Document Sections</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.sections.map(section => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium text-sm">{section.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{section.wordCount.toLocaleString()}</TableCell>
                    <TableCell>{statusIcon(section.status)}</TableCell>
                    <TableCell>
                      {section.approved ? (
                        <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </TableCell>
                    <TableCell>
                      {section.supervisorComment && (
                        <p className="text-xs text-muted-foreground italic max-w-[200px] truncate" title={section.supervisorComment}>
                          {section.supervisorComment}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {!section.approved && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                            <Check className="h-3 w-3" /> Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ─── ANALYSIS TAB ─── */}
        <TabsContent value="analysis">
          <Card className="shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">Statistical Analyses</h3>
            </div>
            {student.analyses.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">No analyses submitted yet.</div>
            ) : (
              <div className="p-4 space-y-4">
                {student.analyses.map(analysis => (
                  <Card key={analysis.id} className={cn("p-4", analysis.status === "flagged" && "border-destructive/50 bg-destructive/5")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold">{analysis.title}</p>
                          {analysis.aiRecommended && (
                            <Badge variant="outline" className="text-[10px] gap-1"><Sparkles className="h-3 w-3" /> AI Recommended</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Test: {analysis.testType} · p = {analysis.pValue ?? "N/A"}</p>
                        {analysis.result && <p className="text-sm text-muted-foreground">{analysis.result}</p>}
                        {analysis.supervisorNote && (
                          <p className="text-sm text-destructive mt-2 italic">⚠ Supervisor: {analysis.supervisorNote}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {analysis.status === "flagged" ? (
                          <Badge variant="destructive" className="gap-1"><Flag className="h-3 w-3" /> Flagged</Badge>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" className="h-7 text-xs"><Check className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive"><Flag className="h-3 w-3" /></Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ─── INTEGRITY TAB ─── */}
        <TabsContent value="integrity">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Card className="p-5 text-center shadow-card">
              <p className="text-3xl font-bold">{student.integrityScore}</p>
              <p className="text-sm text-muted-foreground">Integrity Score</p>
            </Card>
            <Card className={cn("p-5 text-center shadow-card", student.similarityIndex > 35 && "border-destructive")}>
              <p className={cn("text-3xl font-bold", student.similarityIndex > 20 ? student.similarityIndex > 35 ? "text-destructive" : "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]")}>
                {student.similarityIndex}%
              </p>
              <p className="text-sm text-muted-foreground">Similarity Index</p>
              <p className="text-xs text-muted-foreground mt-1">{student.similarityIndex <= 20 ? "Safe" : student.similarityIndex <= 35 ? "Borderline" : "Critical"}</p>
            </Card>
            <Card className={cn("p-5 text-center shadow-card", student.aiDetectionScore > 45 && "border-destructive")}>
              <p className={cn("text-3xl font-bold", student.aiDetectionScore > 45 ? "text-destructive" : student.aiDetectionScore > 20 ? "text-[hsl(var(--warning))]" : "text-[hsl(var(--success))]")}>
                {student.aiDetectionScore}%
              </p>
              <p className="text-sm text-muted-foreground">AI Detection</p>
              <p className="text-xs text-muted-foreground mt-1">{student.aiDetectionScore <= 20 ? "Safe" : student.aiDetectionScore <= 45 ? "Borderline" : "Risky"}</p>
            </Card>
          </div>
          <Card className="shadow-card p-4">
            <h3 className="font-display font-semibold mb-3">Section-Level Integrity</h3>
            <div className="space-y-2">
              {student.sections.map(sec => {
                const simulated = Math.min(100, Math.max(0, student.similarityIndex + Math.floor(Math.random() * 15 - 7)));
                return (
                  <div key={sec.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                    <span className="text-sm flex-1">{sec.title}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={100 - simulated} className="h-2 w-20" />
                      <span className={cn("text-xs w-8 text-right", simulated > 20 ? "text-destructive" : "text-muted-foreground")}>{simulated}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* ─── FEEDBACK TAB ─── */}
        <TabsContent value="feedback">
          <Card className="shadow-card">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">Feedback & Communication</h3>
            </div>
            <div className="p-4 space-y-4">
              {student.feedbackThreads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No feedback threads yet.</p>
              )}
              {student.feedbackThreads.map(thread => (
                <Card key={thread.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm font-semibold">{thread.subject}</p>
                    <Badge variant={thread.resolved ? "default" : "secondary"} className="text-xs">
                      {thread.resolved ? "Resolved" : "Open"}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {thread.messages.map((msg, i) => (
                      <div key={i} className={cn("flex gap-3", msg.isStudent && "flex-row-reverse")}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0", msg.isStudent ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary")}>
                          {msg.author.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className={cn("max-w-[70%] rounded-lg p-3 text-sm", msg.isStudent ? "bg-accent" : "bg-muted")}>
                          <p className="text-xs font-medium mb-1">{msg.author} · {msg.timestamp}</p>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}

              {/* New feedback */}
              <Card className="p-4 border-dashed">
                <p className="text-sm font-semibold mb-2">Send Feedback</p>
                <Textarea
                  placeholder="Write a comment, instruction, or suggestion for the student..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" disabled={!newComment.trim()}>Send Comment</Button>
                  <Button size="sm" variant="outline" disabled={!newComment.trim()}>Request Revision</Button>
                </div>
              </Card>
            </div>
          </Card>

          {/* Notifications for this student */}
          {student.notifications.length > 0 && (
            <Card className="shadow-card mt-4">
              <div className="p-4 border-b border-border">
                <h3 className="font-display font-semibold">Alerts</h3>
              </div>
              <div className="p-4 space-y-2">
                {student.notifications.map(n => {
                  const iconMap = {
                    overdue: <Clock className="h-4 w-4 text-[hsl(var(--warning))]" />,
                    "missing-data": <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />,
                    "plagiarism-risk": <XCircle className="h-4 w-4 text-destructive" />,
                    "analysis-issue": <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />,
                    deadline: <Clock className="h-4 w-4 text-primary" />,
                    milestone: <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />,
                  };
                  return (
                    <div key={n.id} className={cn("flex items-start gap-3 p-2 rounded-lg", !n.read && "bg-primary/5")}>
                      {iconMap[n.type]}
                      <div className="flex-1">
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-muted-foreground">{n.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;
