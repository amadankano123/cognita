import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, Clock, FileSignature } from "lucide-react";
import PageHeading from "@/components/dashboard/PageHeading";
import StatCard from "@/components/dashboard/StatCard";
import { mockSenateBatches, mockPgStudents } from "@/data/mockSpgs";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  compiling: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  ready: "bg-primary/15 text-primary border-primary/30",
  submitted: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  approved: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const SpgsSenate = () => {
  const senateReady = mockPgStudents.filter((s) => s.currentStage === "Senate Approval");
  const pendingCorrections = mockPgStudents.filter((s) => s.currentStage === "Correction & SPGS Submission");

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeading
        title="Senate & Graduation Readiness"
        subtitle="Compile senate-ready cohorts, verify clearance and prepare award recommendations"
        badge={<Badge variant="outline" className="text-primary border-primary/30">SPGS Dean</Badge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Senate-ready" value={senateReady.length + 13} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending Corrections" value={pendingCorrections.length + 4} icon={Clock} tone="warning" />
        <StatCard label="Awaiting Clearance" value={6} icon={FileSignature} tone="warning" />
        <StatCard label="Approved (YTD)" value={38} icon={Award} tone="default" />
      </div>

      <Card className="shadow-soft">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold">Upcoming Senate Batches</h3>
          <Button size="sm" variant="outline" onClick={() => toast.success("Senate batch compilation queued")}>
            Compile Next Batch
          </Button>
        </div>
        <div className="divide-y divide-border">
          {mockSenateBatches.map((b) => (
            <div key={b.id} className="p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{b.session}</p>
                <p className="text-xs text-muted-foreground">Scheduled {b.scheduled}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Ready</p>
                <p className="text-sm font-medium">{b.studentsReady}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-sm font-medium">{b.pendingClearance}</p>
              </div>
              <Badge variant="outline" className={`capitalize ${statusStyles[b.status]}`}>{b.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="shadow-soft">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold">Students at Senate Approval</h3>
          <Button size="sm" variant="ghost" onClick={() => toast.success("Award recommendation sheet generated")}>
            Generate Award Sheet
          </Button>
        </div>
        <div className="divide-y divide-border">
          {senateReady.map((s) => (
            <div key={s.id} className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{s.name} · {s.degree}</p>
                <p className="text-xs text-muted-foreground truncate">{s.programme} · {s.department} · Supervisor: {s.supervisor}</p>
              </div>
              <Badge variant="outline" className="text-emerald-700 border-emerald-500/30">Cleared</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SpgsSenate;
