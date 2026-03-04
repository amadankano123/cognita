import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/layout/PageHeader";
import { mockSupervisedStudents } from "@/data/mockSupervisor";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const SupervisorReviews = () => {
  const allSections = mockSupervisedStudents.flatMap(s =>
    s.sections.filter(sec => !sec.approved && sec.status !== "not-started").map(sec => ({
      ...sec,
      studentName: s.name,
      degreeLevel: s.degreeLevel,
    }))
  );

  return (
    <div className="max-w-4xl animate-fade-in">
      <PageHeader title="Section Reviews" subtitle="Pending section approvals and comments" />

      <Card className="shadow-card">
        <div className="divide-y divide-border">
          {allSections.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No sections pending review.</p>
          ) : (
            allSections.map((sec, i) => (
              <div key={`${sec.id}-${i}`} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{sec.title}</p>
                    <p className="text-xs text-muted-foreground">{sec.studentName} · {sec.degreeLevel} · {sec.wordCount} words</p>
                  </div>
                  <Badge variant={sec.status === "completed" ? "secondary" : "outline"} className="text-xs">{sec.status}</Badge>
                </div>
                {sec.supervisorComment && (
                  <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mb-2">💬 {sec.supervisorComment}</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => toast.success(`"${sec.title}" approved`)}>
                    <CheckCircle className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`"${sec.title}" marked as needs revision`)}>
                    <XCircle className="h-3 w-3 mr-1" /> Needs Revision
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default SupervisorReviews;
