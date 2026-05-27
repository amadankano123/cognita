import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeading from "@/components/dashboard/PageHeading";
import { mockSpgsFacultySummary, mockSpgsTrends, mockPgStudents } from "@/data/mockSpgs";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const PIE_COLORS = ["hsl(var(--primary))", "hsl(38 92% 50%)", "hsl(142 60% 45%)", "hsl(var(--destructive))"];

const SpgsAnalytics = () => {
  const stageBreakdown = Object.entries(
    mockPgStudents.reduce<Record<string, number>>((acc, s) => {
      acc[s.currentStage] = (acc[s.currentStage] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const supervisorWorkload = Object.entries(
    mockPgStudents.reduce<Record<string, number>>((acc, s) => {
      acc[s.supervisor] = (acc[s.supervisor] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, students]) => ({ name: name.replace(/^(Dr\.|Prof\.)\s/, ""), students }));

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeading
        title="Institutional Analytics"
        subtitle="Faculty performance, completion trends, supervisor workload & senate pipeline"
        badge={<Badge variant="outline" className="text-primary border-primary/30">SPGS Dean</Badge>}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Avg. Completion Time by Faculty (months)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSpgsFacultySummary.map((f) => ({ name: f.faculty.replace("Faculty of ", ""), months: f.avgCompletionMonths }))}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="months" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Lifecycle Stage Distribution</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageBreakdown} dataKey="value" nameKey="name" outerRadius={90} label={(d) => d.name}>
                  {stageBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Senate Pipeline (6-month)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSpgsTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="senate" name="Senate-ready" stroke="hsl(142 60% 45%)" strokeWidth={2} />
                <Line dataKey="finalSeminars" name="Final seminars" stroke="hsl(38 92% 50%)" strokeWidth={2} />
                <Line dataKey="proposals" name="Proposals" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-4">Supervisor Workload</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supervisorWorkload} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="shadow-soft">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Delayed-Student Heatmap by Faculty</h3>
        </div>
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {mockSpgsFacultySummary.map((f) => {
            const pct = (f.delayed / f.students) * 100;
            const heat = pct > 15 ? "bg-destructive/15 border-destructive/40 text-destructive"
              : pct > 8 ? "bg-amber-500/15 border-amber-500/40 text-amber-700"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700";
            return (
              <div key={f.faculty} className={`border rounded-lg p-4 ${heat}`}>
                <p className="text-xs uppercase tracking-wider opacity-80">{f.faculty.replace("Faculty of ", "")}</p>
                <p className="text-3xl font-display font-semibold mt-1">{f.delayed}</p>
                <p className="text-xs mt-1">{pct.toFixed(1)}% delayed · {f.students} total</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SpgsAnalytics;
