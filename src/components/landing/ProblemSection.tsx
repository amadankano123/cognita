import { StickyNote, BookMarked, Bot, BarChart3, ShieldAlert, FileEdit, Users } from "lucide-react";

const problems = [
  { icon: StickyNote, label: "Notes & workspace" },
  { icon: BookMarked, label: "Citations & references" },
  { icon: Bot, label: "AI explanations" },
  { icon: BarChart3, label: "Statistical analysis" },
  { icon: ShieldAlert, label: "Plagiarism checking" },
  { icon: FileEdit, label: "Academic writing" },
  { icon: Users, label: "Supervision & feedback" },
];

const ProblemSection = () => (
  <section className="relative max-w-5xl mx-auto px-6 py-24">
    <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    <div className="relative">
      <div className="text-center mb-14">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          <span className="h-px w-8 bg-primary/40" /> The Problem <span className="h-px w-8 bg-primary/40" />
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Research Shouldn't Require <span className="text-gradient-primary">Seven Different Tools</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          Today's researchers juggle disconnected software for every stage of their work — creating fragmentation, context switching, and cognitive overload.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {problems.map((p) => (
          <div
            key={p.label}
            className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-destructive/0 to-destructive/0 group-hover:from-destructive/5 group-hover:to-transparent transition-colors" />
            <div className="relative h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center ring-1 ring-destructive/15 group-hover:scale-110 transition-transform">
              <p.icon className="h-5 w-5 text-destructive" />
            </div>
            <span className="relative text-sm font-medium">{p.label}</span>
          </div>
        ))}
        <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-6 text-center bg-muted/30">
          <span className="text-sm text-muted-foreground italic">…and more fragmentation</span>
        </div>
      </div>
    </div>
  </section>
);

export default ProblemSection;
