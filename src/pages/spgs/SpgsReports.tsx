import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, FileBarChart2 } from "lucide-react";
import PageHeading from "@/components/dashboard/PageHeading";
import { toast } from "sonner";

const REPORTS = [
  { title: "Departmental PG Report", desc: "Per-department PG enrolment, progress and completion", icon: FileBarChart2 },
  { title: "Faculty Report", desc: "Faculty-wide rollup of all postgraduate metrics", icon: FileBarChart2 },
  { title: "Delayed Students Report", desc: "Students flagged for inactivity, residency or overdue milestones", icon: FileText },
  { title: "Seminar Status Report", desc: "Proposal, progress and final seminar tracking", icon: FileText },
  { title: "Senate-ready Students", desc: "Eligible cohort with clearance verification", icon: FileText },
  { title: "Graduation Statistics", desc: "Historical completion rates and average duration", icon: FileBarChart2 },
  { title: "External Examination Report", desc: "Examiner workload, turnaround and outcomes", icon: FileText },
  { title: "Supervisor Performance Report", desc: "Supervisor responsiveness, workload and student outcomes", icon: FileBarChart2 },
];

const FORMATS: { label: string; icon: typeof Download; mime: string }[] = [
  { label: "PDF", icon: FileText, mime: "application/pdf" },
  { label: "Excel", icon: FileSpreadsheet, mime: "application/vnd.ms-excel" },
  { label: "CSV", icon: FileText, mime: "text/csv" },
];

const SpgsReports = () => (
  <div className="animate-fade-in space-y-5">
    <PageHeading
      title="Reports & Exports"
      subtitle="Senate-ready, departmental and institutional reports for the SPGS office"
      badge={<Badge variant="outline" className="text-primary border-primary/30">SPGS Dean</Badge>}
    />

    <div className="grid md:grid-cols-2 gap-4">
      {REPORTS.map((r) => (
        <Card key={r.title} className="p-5 shadow-soft hover:shadow-glow transition-shadow">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
              <r.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-sm">{r.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <Button
                key={f.label}
                size="sm"
                variant="outline"
                onClick={() => toast.success(`${r.title} (${f.label}) export queued`)}
              >
                <f.icon className="h-3.5 w-3.5 mr-1.5" /> {f.label}
              </Button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default SpgsReports;
