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
  <section className="max-w-5xl mx-auto px-6 py-24">
    <div className="text-center mb-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Replace, Don't Add</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        7 Tools Cognita Replaces
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Every capability you need — integrated natively, not bolted on.
      </p>
    </div>

    <div className="space-y-3 max-w-3xl mx-auto">
      {replacements.map((r) => (
        <div
          key={r.legacy}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <span className="flex-1 text-sm text-muted-foreground line-through decoration-muted-foreground/40">
            {r.legacy}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
          <span className="flex-1 text-sm font-semibold text-foreground">
            {r.cognita}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default ToolsReplacedSection;
