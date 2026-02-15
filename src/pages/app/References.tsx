import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, ExternalLink, Plus, Upload, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const References = () => {
  const { project } = useProject();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showIntegrity, setShowIntegrity] = useState(false);
  const [doiModalOpen, setDoiModalOpen] = useState(false);
  const [bibtexModalOpen, setBibtexModalOpen] = useState(false);

  const filtered = project.references.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  const uncited = project.references.filter((r) => !r.cited);
  const missingDoi = project.references.filter((r) => r.status === "missing-doi");

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="References"
        subtitle={`${project.references.length} references in your library`}
        breadcrumb={project.title}
      />

      {/* Actions bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Dialog open={doiModalOpen} onOpenChange={setDoiModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add via DOI</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Reference by DOI</DialogTitle></DialogHeader>
            <Input placeholder="e.g. 10.1234/example.2023" className="mb-3" />
            <p className="text-xs text-muted-foreground mb-3">Enter a DOI and we'll fetch the metadata automatically.</p>
            <Button onClick={() => setDoiModalOpen(false)}>Lookup & Add</Button>
          </DialogContent>
        </Dialog>

        <Dialog open={bibtexModalOpen} onOpenChange={setBibtexModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1" /> Import BibTeX</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Import BibTeX</DialogTitle></DialogHeader>
            <textarea className="w-full h-32 border border-border rounded-md p-3 text-xs font-mono resize-none" placeholder="Paste your BibTeX entries here…" />
            <Button onClick={() => setBibtexModalOpen(false)} className="mt-3">Import References</Button>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={() => setShowIntegrity(!showIntegrity)}>
          <ShieldCheck className="h-4 w-4 mr-1" /> Run Integrity Check
        </Button>
      </div>

      {/* Integrity Check Panel */}
      {showIntegrity && (
        <Card className="p-4 mb-4 shadow-card border-warning/30 bg-warning/5 animate-fade-in">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-warning" /> Integrity Check Results
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{uncited.length} references uncited</p>
                <p className="text-xs text-muted-foreground">{uncited.map((r) => r.authors[0].split(",")[0]).join(", ")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">1 claim without citation in Introduction</p>
                <button onClick={() => navigate("/app/editor")} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                  Go to Introduction <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
            {missingDoi.length > 0 && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{missingDoi.length} reference(s) missing DOI</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by title or author…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Reference table */}
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-32">Author</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-16">Year</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-24">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground w-16">Cited</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((ref) => (
                <tr key={ref.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <p className="font-medium leading-tight">{ref.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 italic">{ref.journal}</p>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{ref.authors[0]?.split(",")[0]}</td>
                  <td className="p-3 text-xs">{ref.year}</td>
                  <td className="p-3">
                    <Badge variant={ref.status === "valid" ? "secondary" : "destructive"} className="text-[10px]">
                      {ref.status === "missing-doi" ? "Missing DOI" : "Valid"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {ref.cited ? (
                      <span className="text-xs text-success font-medium">Yes</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="p-3">
                    {ref.doi && (
                      <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No references match your search.</p>
      )}
    </div>
  );
};

export default References;
