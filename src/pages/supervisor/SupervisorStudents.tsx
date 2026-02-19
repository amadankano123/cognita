import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, AlertTriangle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { mockSupervisedStudents, type DegreeLevel, type ComplianceStatus } from "@/data/mockSupervisor";
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

const SupervisorStudents = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState<string>("all");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const filtered = useMemo(() => {
    let list = [...mockSupervisedStudents];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.projectTitle.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
    }
    if (degreeFilter !== "all") list = list.filter(s => s.degreeLevel === degreeFilter);
    if (complianceFilter !== "all") list = list.filter(s => s.complianceStatus === complianceFilter);
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return b.progress - a.progress;
      if (sortBy === "compliance") return a.complianceStatus.localeCompare(b.complianceStatus);
      return 0;
    });
    return list;
  }, [search, degreeFilter, complianceFilter, sortBy]);

  const summary = {
    total: mockSupervisedStudents.length,
    phd: mockSupervisedStudents.filter(s => s.degreeLevel === "PhD").length,
    masters: mockSupervisedStudents.filter(s => s.degreeLevel === "Master's").length,
    undergrad: mockSupervisedStudents.filter(s => s.degreeLevel === "Undergraduate").length,
    critical: mockSupervisedStudents.filter(s => s.complianceStatus === "Critical").length,
    warning: mockSupervisedStudents.filter(s => s.complianceStatus === "Warning").length,
  };

  return (
    <div className="max-w-6xl animate-fade-in">
      <PageHeader title="My Students" subtitle="Track progress, compliance, and research quality across all supervised students" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total", value: summary.total, color: "text-foreground" },
          { label: "PhD", value: summary.phd, color: "text-primary" },
          { label: "Master's", value: summary.masters, color: "text-primary" },
          { label: "Undergraduate", value: summary.undergrad, color: "text-accent-foreground" },
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
          <Select value={degreeFilter} onValueChange={setDegreeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Degree" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Degrees</SelectItem>
              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
              <SelectItem value="Master's">Master's</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Student Table */}
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
            {filtered.map(student => (
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No students match your filters.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SupervisorStudents;
