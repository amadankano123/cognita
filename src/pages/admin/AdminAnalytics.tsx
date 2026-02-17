import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
  const { institution } = useInstitution();

  const pubsByDept = [
    { dept: "Computer Sci", pubs: 12 },
    { dept: "Medicine", pubs: 9 },
    { dept: "Env Science", pubs: 6 },
    { dept: "Engineering", pubs: 4 },
    { dept: "Chemistry", pubs: 3 },
    { dept: "Social Sci", pubs: 3 },
    { dept: "Biology", pubs: 1 },
  ];

  const grantRate = [
    { year: "2022", rate: 28 },
    { year: "2023", rate: 34 },
    { year: "2024", rate: 41 },
    { year: "2025", rate: 45 },
    { year: "2026", rate: 52 },
  ];

  const avgIntegrity = [
    { faculty: "Chemistry", score: 95 },
    { faculty: "Medicine", score: 88 },
    { faculty: "Env Science", score: 92 },
    { faculty: "Computer Sci", score: 79 },
    { faculty: "Social Sci", score: 89 },
    { faculty: "Engineering", score: 81 },
  ];

  const aiAdoption = [
    { name: "Reviewer Only", value: 45 },
    { name: "Reviewer + Rewrite", value: 35 },
    { name: "Full AI", value: 12 },
    { name: "Disabled", value: 8 },
  ];

  const COLORS = ["hsl(142, 60%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(210, 14%, 83%)"];

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Research performance and AI adoption metrics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Publications by Department */}
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Publications by Department</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pubsByDept} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="pubs" fill="hsl(224, 64%, 33%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grant Success Rate */}
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Grant Success Rate (%)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grantRate}>
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 60]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="hsl(224, 64%, 33%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Average Integrity Score */}
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Avg Integrity Score by Faculty</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgIntegrity}>
                <XAxis dataKey="faculty" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[60, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {avgIntegrity.map((entry) => (
                    <Cell key={entry.faculty} fill={entry.score >= 85 ? "hsl(142, 60%, 40%)" : entry.score >= 70 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Adoption Rate */}
        <Card className="p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">AI Adoption Rate</h3>
          <div className="h-56 flex items-center justify-center gap-6">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={aiAdoption} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {aiAdoption.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {aiAdoption.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
