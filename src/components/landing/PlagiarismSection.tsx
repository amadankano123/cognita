import { ShieldCheck, FileSearch, LayoutList, Eye, GitCompareArrows } from "lucide-react";

const features = [
  { icon: FileSearch, title: "Similarity Checking", desc: "Scan your work against millions of academic sources and publications." },
  { icon: ShieldCheck, title: "Citation-Aware Detection", desc: "Distinguishes properly cited passages from uncited similarities." },
  { icon: LayoutList, title: "Section-by-Section Reports", desc: "Granular reports per chapter and section — not just a single score." },
  { icon: Eye, title: "Supervisor Visibility", desc: "Supervisors can review integrity reports alongside the manuscript." },
  { icon: GitCompareArrows, title: "Revision Tracking", desc: "Track how originality improves across drafts over time." },
];

const PlagiarismSection = () => (
  <section className="max-w-5xl mx-auto px-6 py-24">
    <div className="text-center mb-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Academic Integrity</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Build Originality Into Your Writing
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
        Cognita doesn't just check for plagiarism after the fact — it helps you write with integrity from the start.
      </p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-4">
            <f.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default PlagiarismSection;
