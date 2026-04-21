import { LogIn, Brain, Workflow, Database } from "lucide-react";

const pillars = [
  { icon: LogIn, title: "One Login", desc: "Access every research capability from a single account." },
  { icon: Brain, title: "One Research Memory", desc: "Your notes, data, and citations share context automatically." },
  { icon: Workflow, title: "One Workflow", desc: "From literature review to final submission — no tab switching." },
  { icon: Database, title: "One Source of Truth", desc: "Analysis, writing, and integrity checks live together." },
];

const SolutionSection = () => (
  <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
    <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
    <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[hsl(260,70%,60%)]/30 blur-3xl" />
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.07]" />

    <div className="relative max-w-5xl mx-auto px-6 py-28">
      <div className="text-center mb-16">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground/70 mb-4">
          <span className="h-px w-8 bg-primary-foreground/30" /> The Solution <span className="h-px w-8 bg-primary-foreground/30" />
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
          Seven Tools. <span className="text-gradient-hero">One Cognita.</span>
        </h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
          Cognita replaces fragmented research tooling with a single, academic-grade operating system that covers the entire lifecycle — from idea to publication.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="group relative rounded-2xl bg-primary-foreground/[0.07] border border-primary-foreground/15 p-7 backdrop-blur-md hover:bg-primary-foreground/[0.12] hover:border-primary-foreground/25 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-foreground/25 to-primary-foreground/5 flex items-center justify-center mb-5 ring-1 ring-primary-foreground/20 group-hover:scale-110 transition-transform">
              <p.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-primary-foreground/75 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
