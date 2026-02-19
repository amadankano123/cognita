import { LogIn, Brain, Workflow, Database } from "lucide-react";

const pillars = [
  { icon: LogIn, title: "One Login", desc: "Access every research capability from a single account." },
  { icon: Brain, title: "One Research Memory", desc: "Your notes, data, and citations share context automatically." },
  { icon: Workflow, title: "One Workflow", desc: "From literature review to final submission — no tab switching." },
  { icon: Database, title: "One Source of Truth", desc: "Analysis, writing, and integrity checks live together." },
];

const SolutionSection = () => (
  <section className="bg-primary text-primary-foreground">
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70 mb-3">The Solution</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Seven Tools. One Cognita.
        </h2>
        <p className="text-primary-foreground/75 max-w-2xl mx-auto text-lg">
          Cognita replaces fragmented research tooling with a single, academic-grade operating system that covers the entire lifecycle — from idea to publication.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 p-6 backdrop-blur-sm"
          >
            <div className="h-10 w-10 rounded-lg bg-primary-foreground/15 flex items-center justify-center mb-4">
              <p.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">{p.title}</h3>
            <p className="text-sm text-primary-foreground/70">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
