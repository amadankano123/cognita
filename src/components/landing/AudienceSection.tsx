import { GraduationCap, FlaskConical, Users, Building2 } from "lucide-react";

const audiences = [
  { icon: GraduationCap, title: "Undergraduate & Postgraduate Students", desc: "Structure your thesis, run analysis, and check integrity — all in one workspace.", color: "from-blue-500/15 to-indigo-500/5" },
  { icon: FlaskConical, title: "Academic Researchers", desc: "Manage the full lifecycle from literature review to publication-ready manuscripts.", color: "from-purple-500/15 to-fuchsia-500/5" },
  { icon: Users, title: "Supervisors & Research Groups", desc: "Monitor progress, review integrity reports, and provide contextual feedback.", color: "from-emerald-500/15 to-teal-500/5" },
  { icon: Building2, title: "Universities & Institutions", desc: "Govern research output, track AI usage, and ensure compliance at scale.", color: "from-amber-500/15 to-orange-500/5" },
];

const AudienceSection = () => (
  <section className="max-w-5xl mx-auto px-6 py-28">
    <div className="text-center mb-14">
      <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-3">
        <span className="h-px w-8 bg-primary/40" /> Who It's For <span className="h-px w-8 bg-primary/40" />
      </p>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
        Built for Every <span className="text-gradient-primary">Research Role</span>
      </h2>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
      {audiences.map((a) => (
        <div
          key={a.title}
          className="group relative flex gap-5 rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center ring-1 ring-primary/10 group-hover:scale-110 transition-transform">
            <a.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="relative">
            <h3 className="font-display font-semibold text-lg mb-1.5">{a.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AudienceSection;
