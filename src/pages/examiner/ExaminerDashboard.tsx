import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, FileSearch, CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import { useInstitution } from "@/context/InstitutionContext";
import { useAuth } from "@/context/AuthContext";

const ExaminerDashboard = () => {
  const { institution } = useInstitution();
  const { role, user } = useAuth();
  const isInternal = role === "Internal Examiner";
  const queue = institution.projects.filter((p) => p.status === "review" || p.status === "submitted");
  const recent = institution.projects.slice(0, 4);

  return (
    <div className="animate-fade-in">
      <PageHeading
        title={`Welcome, ${user?.name ?? "Examiner"}`}
        subtitle={isInternal ? "Internal examination dashboard" : "External examination dashboard — blind review"}
        badge={
          <Badge variant="outline" className="text-primary border-primary/30 gap-1">
            <Gavel className="h-3 w-3" /> {isInternal ? "Internal Examiner" : "External Examiner"}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Awaiting Review" value={queue.length} icon={Clock} tone="warning" />
        <StatCard label="In Progress" value={1} icon={FileSearch} />
        <StatCard label="Completed" value={4} icon={CheckCircle2} tone="success" />
        <StatCard label="Avg. Turnaround" value="5 days" icon={ShieldCheck} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Active Examination Queue</h3>
            <Button asChild size="sm" variant="ghost">
              <Link to="/examiner/queue">Open queue <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
          <div className="space-y-2">
            {queue.length === 0 && <p className="text-sm text-muted-foreground">No pending submissions.</p>}
            {queue.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{isInternal ? p.title : `[Anonymized] ${p.title}`}</p>
                  <p className="text-xs text-muted-foreground">{p.department} · Integrity {p.integrityScore}%</p>
                </div>
                <Badge variant="secondary" className="capitalize">{p.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Recent Verdicts</h3>
          <div className="space-y-3">
            {recent.map((p) => (
              <div key={p.id} className="text-sm border-l-2 border-primary/40 pl-3">
                <p className="font-medium truncate">{isInternal ? p.title : `[Anonymized] ${p.title}`}</p>
                <p className="text-xs text-muted-foreground">Verdict pending · {p.department}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExaminerDashboard;
