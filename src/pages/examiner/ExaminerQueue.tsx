import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, FileSearch, CheckCircle2, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";
import { eventBus } from "@/lib/eventBus";
import { useToast } from "@/hooks/use-toast";

const ExaminerQueue = () => {
  const { institution } = useInstitution();
  const { role, user } = useAuth();
  const { toast } = useToast();
  const isInternal = role === "Internal Examiner";
  const queue = institution.projects.filter((p) => p.status === "review" || p.status === "submitted");

  const submit = (projectId: string) => {
    eventBus.publish({
      type: "audit.note",
      actorId: user?.id ?? "examiner",
      message: `${isInternal ? "Internal" : "External"} examiner verdict submitted for ${projectId}`,
    });
    toast({ title: "Verdict submitted", description: "Your examination report has been recorded." });
  };

  return (
    <div className="animate-fade-in">
      <PageHeading
        title={isInternal ? "Internal Examination Queue" : "External Examination Queue"}
        subtitle={isInternal ? "Submissions assigned for internal review" : "Blind-review submissions assigned to you"}
        badge={
          <Badge variant="outline" className="text-primary border-primary/30 gap-1">
            <Gavel className="h-3 w-3" /> {isInternal ? "Internal Examiner" : "External Examiner"}
          </Badge>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Awaiting Review" value={queue.length} icon={Clock} tone="warning" />
        <StatCard label="Completed" value={4} icon={CheckCircle2} tone="success" />
        <StatCard label="In Progress" value={1} icon={FileSearch} />
      </div>
      <Card className="p-5 shadow-soft">
        <h3 className="font-display font-semibold mb-4">Submissions to Examine</h3>
        <div className="space-y-3">
          {queue.length === 0 && <p className="text-sm text-muted-foreground">No pending submissions.</p>}
          {queue.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{isInternal ? p.title : `[Anonymized] ${p.title}`}</p>
                <p className="text-xs text-muted-foreground">{p.department} · Integrity {p.integrityScore}%</p>
              </div>
              <Button size="sm" onClick={() => submit(p.id)}>Submit Verdict</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ExaminerQueue;
