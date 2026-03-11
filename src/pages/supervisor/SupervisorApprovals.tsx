import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, X, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { mockSupervisedStudents } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface ApprovalRequest {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  description: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  degreeLevel: string;
}

const generateApprovals = (): ApprovalRequest[] => {
  const types = ["Section Submission", "Topic Change", "Extension Request", "Ethics Clearance", "Final Submission"];
  return mockSupervisedStudents.slice(0, 8).map((s, i) => ({
    id: `appr-${s.id}`,
    studentName: s.name,
    studentId: s.id,
    type: types[i % types.length],
    description: `${s.name} has requested approval for ${types[i % types.length].toLowerCase()} related to "${s.projectTitle}".`,
    submittedAt: `${i + 1} day${i > 0 ? "s" : ""} ago`,
    status: i < 4 ? "pending" : i < 6 ? "approved" : "rejected",
    degreeLevel: s.degreeLevel,
  }));
};

const SupervisorApprovals = () => {
  const [approvals, setApprovals] = useState(generateApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [feedback, setFeedback] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const pending = approvals.filter(a => a.status === "pending");
  const resolved = approvals.filter(a => a.status !== "pending");

  const handleAction = () => {
    if (!selectedApproval || !action) return;
    setApprovals(prev => prev.map(a => a.id === selectedApproval.id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a));
    toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully.`);
    setSelectedApproval(null);
    setFeedback("");
    setAction(null);
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Approvals" subtitle="Review and act on student requests requiring your authorization" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center shadow-card">
          <Clock className="h-5 w-5 text-[hsl(var(--warning))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{pending.length}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mx-auto mb-1" />
          <p className="text-2xl font-bold">{approvals.filter(a => a.status === "approved").length}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <XCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-bold">{approvals.filter(a => a.status === "rejected").length}</p>
          <p className="text-xs text-muted-foreground">Rejected</p>
        </Card>
      </div>

      <h3 className="font-display font-semibold text-lg mb-3">Pending Requests</h3>
      <div className="space-y-3 mb-8">
        {pending.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No pending approvals.</p>}
        {pending.map(a => (
          <Card key={a.id} className="p-4 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-sm">{a.type}</span>
                  <Badge variant="secondary" className="text-xs">{a.degreeLevel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{a.description}</p>
                <p className="text-xs text-muted-foreground">Submitted {a.submittedAt}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" className="text-[hsl(var(--success))] border-[hsl(var(--success))]/30 hover:bg-[hsl(var(--success))]/10" onClick={() => { setSelectedApproval(a); setAction("approve"); }}>
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { setSelectedApproval(a); setAction("reject"); }}>
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h3 className="font-display font-semibold text-lg mb-3">Resolved</h3>
      <div className="space-y-2">
        {resolved.map(a => (
          <Card key={a.id} className={cn("p-3 shadow-card flex items-center gap-3", a.status === "approved" ? "border-[hsl(var(--success))]/20" : "border-destructive/20")}>
            {a.status === "approved" ? <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium">{a.studentName}</span>
              <span className="text-xs text-muted-foreground ml-2">{a.type}</span>
            </div>
            <Badge variant={a.status === "approved" ? "secondary" : "destructive"} className="text-xs capitalize">{a.status}</Badge>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedApproval} onOpenChange={() => { setSelectedApproval(null); setAction(null); setFeedback(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve" : "Reject"} Request</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedApproval?.description}</p>
          <Textarea placeholder="Add feedback or comments (optional)..." value={feedback} onChange={e => setFeedback(e.target.value)} className="min-h-[80px]" />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedApproval(null); setAction(null); }}>Cancel</Button>
            <Button variant={action === "approve" ? "default" : "destructive"} onClick={handleAction}>
              {action === "approve" ? "Confirm Approval" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisorApprovals;
