import { useState } from "react";
import { useInstitution } from "@/context/InstitutionContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";

const AdminResearchers = () => {
  const { institution } = useInstitution();
  const [search, setSearch] = useState("");

  const filtered = institution.researchers.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Researchers</h1>
        <p className="text-muted-foreground">{institution.totalResearchers} researchers across {institution.departments.length} departments</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name, department, or email…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Researcher</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-36">Department</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-28">Role</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-20">Projects</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-24">Publications</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-24">Integrity</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-28">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                        {r.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs">{r.department}</td>
                  <td className="p-3"><Badge variant="secondary" className="text-[10px]">{r.role}</Badge></td>
                  <td className="p-3 text-center font-medium">{r.projectCount}</td>
                  <td className="p-3 text-center font-medium">{r.publications}</td>
                  <td className="p-3">
                    <span className={`font-semibold ${r.integrityScore >= 85 ? "text-success" : r.integrityScore >= 70 ? "text-warning" : "text-destructive"}`}>
                      {r.integrityScore}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{r.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminResearchers;
