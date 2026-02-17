import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, X, FileText, Bot, Download, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { InstitutionalProject } from "@/types/research";

const aiColors: Record<string, string> = { None: "bg-muted text-muted-foreground", Low: "bg-success/10 text-success", Moderate: "bg-warning/10 text-warning", High: "bg-destructive/10 text-destructive" };
const statusColors: Record<string, string> = { draft: "bg-muted text-muted-foreground", "in-progress": "bg-primary/10 text-primary", review: "bg-warning/10 text-warning", submitted: "bg-success/10 text-success", exported: "bg-accent text-accent-foreground" };

const AdminProjects = () => {
  const { institution } = useInstitution();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<InstitutionalProject | null>(null);

  const filtered = institution.projects.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.researcher.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter !== "all" && p.department !== deptFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Monitor all research projects across the institution</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects or researchers…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {institution.departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {["draft", "in-progress", "review", "submitted", "exported"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Project Title</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-36">Researcher</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-32">Department</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-24">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-24">AI Usage</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-24">Integrity</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-28">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p => (
                <tr key={p.id} onClick={() => setSelected(p)} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-muted-foreground text-xs">{p.researcher}</td>
                  <td className="p-3 text-xs">{p.department}</td>
                  <td className="p-3"><Badge className={`${statusColors[p.status]} text-[10px] capitalize`}>{p.status}</Badge></td>
                  <td className="p-3"><Badge className={`${aiColors[p.aiUsageLevel]} text-[10px]`}>{p.aiUsageLevel}</Badge></td>
                  <td className="p-3">
                    <span className={`text-sm font-semibold ${p.integrityScore >= 85 ? "text-success" : p.integrityScore >= 70 ? "text-warning" : "text-destructive"}`}>
                      {p.integrityScore}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{p.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Project Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg leading-tight">{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground text-xs block">Researcher</span><span className="font-medium">{selected.researcher}</span></div>
                  <div><span className="text-muted-foreground text-xs block">Department</span><span className="font-medium">{selected.department}</span></div>
                  <div><span className="text-muted-foreground text-xs block">Status</span><Badge className={`${statusColors[selected.status]} capitalize`}>{selected.status}</Badge></div>
                  <div><span className="text-muted-foreground text-xs block">Integrity Score</span><span className={`text-xl font-bold ${selected.integrityScore >= 85 ? "text-success" : selected.integrityScore >= 70 ? "text-warning" : "text-destructive"}`}>{selected.integrityScore}</span></div>
                  <div><span className="text-muted-foreground text-xs block">Dataset</span><span className="font-medium capitalize">{selected.datasetStatus.replace("-", " ")}</span></div>
                  <div><span className="text-muted-foreground text-xs block">Last Updated</span><span className="font-medium">{selected.lastUpdated}</span></div>
                </div>

                {/* AI Mode indicator */}
                <div className="bg-accent/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase">AI Mode</span>
                  </div>
                  <p className="text-sm font-medium">{selected.aiMode}</p>
                  <Badge className={`${aiColors[selected.aiUsageLevel]} text-xs mt-1`}>{selected.aiUsageLevel} Usage</Badge>
                </div>

                {/* Document sections (read-only preview) */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Eye className="h-3 w-3" /> Document Sections</h4>
                  <div className="space-y-1">
                    {selected.sections.map(s => (
                      <div key={s.title} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                        <span>{s.title}</span>
                        <span className="text-xs text-muted-foreground">{s.wordCount} words</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Review History */}
                {selected.aiReviewHistory.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Bot className="h-3 w-3" /> AI Review History</h4>
                    <div className="space-y-1">
                      {selected.aiReviewHistory.map((r, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                          <span className="text-muted-foreground">{r.date}</span>
                          <span className={`font-semibold ${r.score >= 85 ? "text-success" : r.score >= 70 ? "text-warning" : "text-destructive"}`}>{r.score}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export History */}
                {selected.exportHistory.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Download className="h-3 w-3" /> Export History</h4>
                    {selected.exportHistory.map((e, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                        <span className="text-muted-foreground">{e.date}</span>
                        <Badge variant="secondary" className="text-xs">{e.format}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Integrity Issues */}
                {selected.integrityIssues.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-destructive" /> Integrity Issues</h4>
                    {selected.integrityIssues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-destructive/5 rounded-md text-sm">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProjects;
