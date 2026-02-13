import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from "lucide-react";
import { useState } from "react";

const References = () => {
  const { project } = useProject();
  const [search, setSearch] = useState("");

  const filtered = project.references.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader
        title="References"
        subtitle={`${project.references.length} references in your library`}
        breadcrumb={project.title}
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or author…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((ref) => (
          <Card key={ref.id} className="p-4 shadow-card hover:shadow-elevated transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h3 className="font-medium text-sm leading-snug">{ref.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {ref.authors.join(", ")} · {ref.year} · <span className="italic">{ref.journal}</span>
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {ref.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              {ref.doi && (
                <a
                  href={`https://doi.org/${ref.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No references match your search.</p>
        )}
      </div>
    </div>
  );
};

export default References;
