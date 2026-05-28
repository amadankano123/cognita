import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  GraduationCap, BookOpen, FlaskConical, FileCheck2, ClipboardCheck,
  Award, AlertTriangle, Timer, Building2, ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import PageHeading from "@/components/dashboard/PageHeading";
import {
  mockPgStudents, mockSpgsFacultySummary, mockSpgsTrends,
} from "@/data/mockSpgs";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const SpgsDashboard = () => {
  const students = mockPgStudents;
  const totalPg = 144;
  const phd = students.filter((s) => s.degree === "PhD").length + 28;
  const msc = students.filter((s) => s.degree === "MSc").length + 70;
  const pgd = 8;
  const proposalPending = students.filter((s) => s.currentStage === "Proposal Seminar").length + 6;
  const inResearch = students.filter((s) => ["Field/Lab Research", "Data Collection", "Data Analysis"].includes(s.currentStage)).length + 18;
  const awaitingFinal = students.filter((s) => s.currentStage === "Final Seminar").length + 4;
  const awaitingExternal = students.filter((s) => ["External Examination Readiness", "External Examination"].includes(s.currentStage)).length + 3;
  const awaitingSenate = students.filter((s) => s.currentStage === "Senate Approval").length + 5;
  const delayed = students.filter((s) => s.riskScore >= 60).length + 9;
  const exceedingResidency = students.filter((s) => s.residencyMonths >= s.residencyLimitMonths).length + 2;
  const graduated = 38;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeading
        title="SPGS Oversight & Monitoring"
        subtitle="School of Postgraduate Studies — institution-wide research progress, compliance & senate readiness"
        badge={<Badge variant="outline" className="text-primary border-primary/30">SPGS Dean</Badge>}
      />

      {/* Executive overview */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Executive Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Total PG Students" value={totalPg} icon={GraduationCap} />
          <StatCard label="MSc" value={msc} icon={BookOpen} />
          <StatCard label="PhD" value={phd} icon={BookOpen} />
          <StatCard label="PGD" value={pgd} icon={BookOpen} />
          <StatCard label="Proposal Seminar Pending" value={proposalPending} icon={FileCheck2} tone="warning" />
          <StatCard label="Active Research Stage" value={inResearch} icon={FlaskConical} />
          <StatCard label="Awaiting Final Seminar" value={awaitingFinal} icon={ClipboardCheck} tone="warning" />
          <StatCard label="Awaiting External Examination" value={awaitingExternal} icon={ClipboardCheck} tone="warning" />
          <StatCard label="Awaiting Senate Approval" value={awaitingSenate} icon={Award} tone="default" />
          <StatCard label="Graduated" value={graduated} icon={Award} tone="success" />
          <StatCard label="Delayed Students" value={delayed} icon={AlertTriangle} tone="critical" />
          <StatCard label="Exceeding Residency" value={exceedingResidency} icon={Timer} tone="critical" />
        </div>
      </section>

      {/* Faculty performance + trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Faculty Performance
            </h3>
            <Link to="/spgs/analytics" className="text-xs text-primary hover:underline">Drill down →</Link>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSpgsFacultySummary.map((f) => ({
                name: f.faculty.replace("Faculty of ", ""),
                Active: f.active, Delayed: f.delayed, Graduated: f.graduated,
              }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Delayed" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Graduated" fill="hsl(142 60% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Research Lifecycle Trends</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSpgsTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="proposals" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line dataKey="finalSeminars" stroke="hsl(38 92% 50%)" strokeWidth={2} />
                <Line dataKey="senate" stroke="hsl(142 60% 45%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Critical delay watchlist */}
      <Card className="shadow-soft">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Critical Delay Watchlist
          </h3>
          <Link to="/spgs/students" className="text-xs text-primary hover:underline">View all students →</Link>
        </div>
        <div className="divide-y divide-border">
          {students.filter((s) => s.riskScore >= 50).sort((a, b) => b.riskScore - a.riskScore).map((s) => (
            <div key={s.id} className="p-4 flex items-center gap-4">
              <div
                className="h-9 w-9 rounded-full grid place-items-center text-xs font-semibold text-white shrink-0"
                style={{ background: s.riskScore >= 80 ? "hsl(var(--destructive))" : s.riskScore >= 60 ? "hsl(38 92% 50%)" : "hsl(48 96% 53%)" }}
              >
                {s.riskScore}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{s.name} <span className="text-muted-foreground font-normal">· {s.matric}</span></p>
                <p className="text-xs text-muted-foreground truncate">
                  {s.department} · {s.degree} · Stage: {s.currentStage} · Supervisor: {s.supervisor}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {s.delayFlags.map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px] bg-destructive/10 text-destructive border-destructive/30">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-xs text-muted-foreground">Residency</p>
                <p className="text-sm font-medium">{s.residencyMonths}/{s.residencyLimitMonths}m</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 shadow-soft bg-muted/30 flex items-start gap-3">
        <ScrollText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Read-only oversight.</strong> The SPGS office monitors institution-wide
          postgraduate progress. Supervisor assignment, departmental assessment and academic decisions remain with the
          Head of Department and Dean of Faculty. All actions in this module are logged to the institutional audit trail.
        </p>
      </Card>
    </div>
  );
};

export default SpgsDashboard;
