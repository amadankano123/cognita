import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import PageHeading from "@/components/dashboard/PageHeading";
import { mockPgStudents, SPGS_FACULTIES, PgDegree, PgStage } from "@/data/mockSpgs";

const STAGES: (PgStage | "all")[] = [
  "all", "Coursework", "Proposal Seminar", "Field/Lab Research",
  "Data Collection", "Data Analysis", "Draft Thesis Review", "Final Seminar",
  "External Examination", "Senate Approval",
];

const SpgsStudents = () => {
  const [q, setQ] = useState("");
  const [faculty, setFaculty] = useState<string>("all");
  const [degree, setDegree] = useState<PgDegree | "all">("all");
  const [stage, setStage] = useState<PgStage | "all">("all");
  const [risk, setRisk] = useState<"all" | "delayed" | "ok">("all");

  const filtered = useMemo(() => mockPgStudents.filter((s) => {
    if (q && !`${s.name} ${s.matric} ${s.supervisor}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (faculty !== "all" && s.faculty !== faculty) return false;
    if (degree !== "all" && s.degree !== degree) return false;
    if (stage !== "all" && s.currentStage !== stage) return false;
    if (risk === "delayed" && s.riskScore < 60) return false;
    if (risk === "ok" && s.riskScore >= 60) return false;
    return true;
  }), [q, faculty, degree, stage, risk]);

  const riskColor = (r: number) =>
    r >= 80 ? "bg-destructive text-destructive-foreground"
    : r >= 60 ? "bg-amber-500 text-white"
    : r >= 30 ? "bg-yellow-400 text-amber-950"
    : "bg-emerald-500 text-white";

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeading
        title="Postgraduate Students"
        subtitle="Institution-wide PG roster — read-only lifecycle view"
        badge={<Badge variant="outline" className="text-primary border-primary/30">SPGS Dean</Badge>}
      />

      <Card className="p-4 shadow-soft">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Filter className="h-3.5 w-3.5" /> Smart filters
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search name, matric, supervisor…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={faculty} onValueChange={setFaculty}>
            <SelectTrigger><SelectValue placeholder="Faculty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All faculties</SelectItem>
              {SPGS_FACULTIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={degree} onValueChange={(v) => setDegree(v as any)}>
            <SelectTrigger><SelectValue placeholder="Degree" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All degrees</SelectItem>
              <SelectItem value="MSc">MSc</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="PGD">PGD</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stage} onValueChange={(v) => setStage(v as any)}>
            <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All stages" : s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={(v) => setRisk(v as any)}>
            <SelectTrigger><SelectValue placeholder="Risk" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              <SelectItem value="delayed">Delayed / at risk</SelectItem>
              <SelectItem value="ok">On track</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="shadow-soft">
        <div className="p-4 border-b border-border text-xs text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filtered.length}</span> of {mockPgStudents.length} students
        </div>
        <div className="divide-y divide-border">
          {filtered.map((s) => (
            <div key={s.id} className="p-4 grid gap-3 md:grid-cols-[1fr_220px_140px] items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{s.name}</p>
                  <Badge variant="outline" className="text-[10px]">{s.degree}</Badge>
                  <span className="text-xs text-muted-foreground">{s.matric}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {s.faculty} · {s.department} · Supervisor: {s.supervisor}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  <span className="text-foreground/80">Stage:</span> {s.currentStage} ·
                  <span className="text-foreground/80"> Residency:</span> {s.residencyMonths}/{s.residencyLimitMonths}m ·
                  <span className="text-foreground/80"> Forecast:</span> {s.completionForecast}
                </p>
                {s.delayFlags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {s.delayFlags.map((f) => (
                      <Badge key={f} variant="secondary" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">{f}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{s.progress}%</span>
                </div>
                <Progress value={s.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-end">
                <div className={`px-3 py-1.5 rounded-md text-xs font-semibold ${riskColor(s.riskScore)}`}>
                  Risk · {s.riskScore}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No students match the current filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SpgsStudents;
