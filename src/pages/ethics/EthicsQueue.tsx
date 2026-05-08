import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2, Clock, FileWarning } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import { useInstitution } from "@/context/InstitutionContext";
import { eventBus } from "@/lib/eventBus";
import { useToast } from "@/hooks/use-toast";

const EthicsQueue = () => {
  const { institution } = useInstitution();
  const { toast } = useToast();
  const apps = institution.projects.slice(0, 5);

  const decide = (projectId: string, approved: boolean) => {
    eventBus.publish({ type: "audit.note", actorId: "eth-001", message: `Ethics ${approved ? "approved" : "flagged"} ${projectId}` });
    toast({ title: approved ? "Ethics approved" : "Sent back for revision" });
  };

  return (
    <div className="animate-fade-in">
      <PageHeading
        title="Ethics Committee Queue"
        subtitle="Review research ethics applications and informed-consent protocols"
        badge={<Badge variant="outline" className="text-primary border-primary/30 gap-1"><ShieldAlert className="h-3 w-3" /> Ethics</Badge>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending Applications" value={apps.length} icon={Clock} tone="warning" />
        <StatCard label="Approved this Quarter" value={17} icon={CheckCircle2} tone="success" />
        <StatCard label="Flagged for Revision" value={3} icon={FileWarning} tone="critical" />
      </div>
      <Card className="p-5 shadow-soft">
        <h3 className="font-display font-semibold mb-4">Pending Ethics Applications</h3>
        <div className="space-y-3">
          {apps.map((p) => (
            <div key={p.id} className="p-3 rounded-lg border border-border/60">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.researcher} · {p.department}</p>
                </div>
                <Badge variant="secondary">Integrity {p.integrityScore}%</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => decide(p.id, true)}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => decide(p.id, false)}>Request Revision</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default EthicsQueue;
