import { ShieldCheck, FileSearch, LayoutList, Eye, GitCompareArrows } from "lucide-react";

const features = [
  { icon: FileSearch, title: "Similarity Checking", desc: "Scan your work against millions of academic sources and publications." },
  { icon: ShieldCheck, title: "Citation-Aware Detection", desc: "Distinguishes properly cited passages from uncited similarities." },
  { icon: LayoutList, title: "Section-by-Section Reports", desc: "Granular reports per chapter and section — not just a single score." },
  { icon: Eye, title: "Supervisor Visibility", desc: "Supervisors can review integrity reports alongside the manuscript." },
  { icon: GitCompareArrows, title: "Revision Tracking", desc: "Track how originality improves across drafts over time." },
];

const PlagiarismSection = () => (
  <section className="relative max-w-5xl mx-auto px-6 py-28">
    <div className="text-center mb-16">
      <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-3">
        <span className="h-px w-8 bg-primary/40" /> Academic Integrity <span className="h-px w-8 bg-primary/40" />
      </p>
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-5">
        <ShieldCheck className="h-8 w-8 text-primary-foreground" />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
        Build <span className="text-gradient-primary">Originality</span> Into Your Writing
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
        Cognita doesn't just check for plagiarism after the fact — it helps you write with integrity from the start.
      </p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="group relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
        >
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-5 ring-1 ring-primary/10 group-hover:scale-110 transition-transform">
            <f.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default PlagiarismSection;
