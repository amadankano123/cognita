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
  <section className="max-w-5xl mx-auto px-6 py-24">
    <div className="text-center mb-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">The Problem</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Research Shouldn't Require Seven Different Tools
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
        Today's researchers juggle disconnected software for every stage of their work — creating fragmentation, context switching, and cognitive overload.
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {problems.map((p) => (
        <div
          key={p.label}
          className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-card"
        >
          <div className="h-11 w-11 rounded-lg bg-destructive/10 flex items-center justify-center">
            <p.icon className="h-5 w-5 text-destructive" />
          </div>
          <span className="text-sm font-medium">{p.label}</span>
        </div>
      ))}
      {/* Empty cell to balance 7 items on 4-col grid */}
      <div className="hidden lg:flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
        <span className="text-sm text-muted-foreground italic">…and more fragmentation</span>
      </div>
    </div>
  </section>
);

export default ProblemSection;
