import { GraduationCap, FlaskConical, Users, Building2 } from "lucide-react";

const audiences = [
  { icon: GraduationCap, title: "Undergraduate & Postgraduate Students", desc: "Structure your thesis, run analysis, and check integrity — all in one workspace." },
  { icon: FlaskConical, title: "Academic Researchers", desc: "Manage the full lifecycle from literature review to publication-ready manuscripts." },
  { icon: Users, title: "Supervisors & Research Groups", desc: "Monitor progress, review integrity reports, and provide contextual feedback." },
  { icon: Building2, title: "Universities & Institutions", desc: "Govern research output, track AI usage, and ensure compliance at scale." },
];

const AudienceSection = () => (
  <section className="max-w-5xl mx-auto px-6 py-24">
    <div className="text-center mb-14">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Who It's For</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Built for Every Research Role
      </h2>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
      {audiences.map((a) => (
        <div
          key={a.title}
          className="flex gap-5 rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <div className="h-12 w-12 shrink-0 rounded-lg bg-accent flex items-center justify-center">
            <a.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg mb-1">{a.title}</h3>
            <p className="text-sm text-muted-foreground">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AudienceSection;
