import { ArrowRight } from "lucide-react";

const replacements = [
  { legacy: "Notes & Workspace", cognita: "Cognita Research Memory" },
  { legacy: "Citation Manager", cognita: "Native Referencing System" },
  { legacy: "AI Research Assistant", cognita: "Context-Aware AI" },
  { legacy: "Writing Software", cognita: "Research-Aware Editor" },
  { legacy: "Plagiarism Checker (Turnitin)", cognita: "Built-in Originality Engine" },
  { legacy: "Statistical Software (SPSS / SAS)", cognita: "Integrated Statistical Analysis" },
  { legacy: "Programming Tools (R)", cognita: "Guided Analytical Workflows" },
];

const ToolsReplacedSection = () => (
  <section className="max-w-5xl mx-auto px-6 py-28">
    <div className="text-center mb-14">
      <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-3">
        <span className="h-px w-8 bg-primary/40" /> Replace, Don't Add <span className="h-px w-8 bg-primary/40" />
      </p>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
        7 Tools Cognita <span className="text-gradient-primary">Replaces</span>
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto text-lg">
        Every capability you need — integrated natively, not bolted on.
      </p>
    </div>

    <div className="space-y-3 max-w-3xl mx-auto">
      {replacements.map((r, i) => (
        <div
          key={r.legacy}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-soft hover:border-primary/30 transition-all duration-300"
        >
          <span className="hidden sm:flex h-8 w-8 shrink-0 rounded-lg bg-muted items-center justify-center text-xs font-bold text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 text-sm text-muted-foreground line-through decoration-muted-foreground/40">
            {r.legacy}
          </span>
          <div className="flex h-8 w-8 shrink-0 rounded-full bg-primary/10 items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
            <ArrowRight className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <span className="flex-1 text-sm font-semibold text-foreground">
            {r.cognita}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default ToolsReplacedSection;
