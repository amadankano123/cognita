import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, AlertTriangle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { mockSupervisedStudents, type SupervisedStudent, type DegreeLevel, type ComplianceStatus } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";

const complianceBadge = (status: ComplianceStatus) => {
  const map: Record<ComplianceStatus, { icon: typeof CheckCircle; className: string }> = {
    Good: { icon: CheckCircle, className: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20" },
    Warning: { icon: AlertTriangle, className: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20" },
    Critical: { icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const { icon: Icon, className } = map[status];
  return (
    <Badge variant="outline" className={cn("gap-1 text-xs font-medium", className)}>
      <Icon className="h-3 w-3" /> {status}
    </Badge>
  );
};

const degreeBadge = (level: DegreeLevel) => {
  const colors: Record<DegreeLevel, string> = {
    Undergraduate: "bg-accent text-accent-foreground",
    "Master's": "bg-primary/10 text-primary",
    PhD: "bg-primary/20 text-primary",
  };
  return <Badge variant="outline" className={cn("text-xs", colors[level])}>{level}</Badge>;
};

const StudentTable = ({ students, navigate }: { students: SupervisedStudent[]; navigate: (path: string) => void }) => (
  <Card className="shadow-card overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Degree</TableHead>
          <TableHead className="hidden lg:table-cell">Project</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Compliance</TableHead>
          <TableHead className="hidden md:table-cell">Last Active</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map(student => (
          <TableRow key={student.id} className="cursor-pointer" onClick={() => navigate(`/supervisor/students/${student.id}`)}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {student.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{student.department}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{degreeBadge(student.degreeLevel)}</TableCell>
            <TableCell className="hidden lg:table-cell">
              <p className="text-sm truncate max-w-[200px]">{student.projectTitle}</p>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs">{student.stage}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 min-w-[80px]">
                <Progress value={student.progress} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground w-8 text-right">{student.progress}%</span>
              </div>
            </TableCell>
            <TableCell>{complianceBadge(student.complianceStatus)}</TableCell>
            <TableCell className="hidden md:table-cell">
              <span className="text-xs text-muted-foreground">{student.lastActivity}</span>
            </TableCell>
            <TableCell>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </TableCell>
          </TableRow>
        ))}
        {students.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No students match your filters.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Card>
);

const SupervisorStudents = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [tab, setTab] = useState("undergraduate");

  const undergradStudents = mockSupervisedStudents.filter(s => s.degreeLevel === "Undergraduate");
  const postgradStudents = mockSupervisedStudents.filter(s => ["Master's", "PhD"].includes(s.degreeLevel));

  const applyFilters = (list: SupervisedStudent[]) => {
    let result = [...list];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.projectTitle.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
    }
    if (complianceFilter !== "all") result = result.filter(s => s.complianceStatus === complianceFilter);
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "compliance") return a.complianceStatus.localeCompare(b.complianceStatus);
      return 0;
    });
    return result;
  };

  const filteredUG = applyFilters(undergradStudents);
  const filteredPG = applyFilters(postgradStudents);

  const summary = {
    total: mockSupervisedStudents.length,
    undergrad: undergradStudents.length,
    postgrad: postgradStudents.length,
    critical: mockSupervisedStudents.filter(s => s.complianceStatus === "Critical").length,
    warning: mockSupervisedStudents.filter(s => s.complianceStatus === "Warning").length,
    good: mockSupervisedStudents.filter(s => s.complianceStatus === "Good").length,
  };

  return (
    <div className="max-w-6xl animate-fade-in">
      <PageHeader title="My Students" subtitle="Track progress, compliance, and research quality across all supervised students" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total", value: summary.total, color: "text-foreground" },
          { label: "Undergraduate", value: summary.undergrad, color: "text-accent-foreground" },
          { label: "Postgraduate", value: summary.postgrad, color: "text-primary" },
          { label: "On Track", value: summary.good, color: "text-[hsl(var(--success))]" },
          { label: "Warnings", value: summary.warning, color: "text-[hsl(var(--warning))]" },
          { label: "Critical", value: summary.critical, color: "text-destructive" },
        ].map(c => (
          <Card key={c.label} className="p-3 text-center shadow-card">
            <p className={cn("text-2xl font-bold", c.color)}>{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, project, or department..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={complianceFilter} onValueChange={setComplianceFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Compliance" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabbed Student Tables */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="undergraduate">Undergraduate ({undergradStudents.length})</TabsTrigger>
          <TabsTrigger value="postgraduate">Postgraduate ({postgradStudents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="undergraduate">
          <StudentTable students={filteredUG} navigate={navigate} />
        </TabsContent>
        <TabsContent value="postgraduate">
          <StudentTable students={filteredPG} navigate={navigate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisorStudents;
