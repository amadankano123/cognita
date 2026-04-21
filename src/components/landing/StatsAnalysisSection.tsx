import { BarChart3, TrendingUp, PieChart, Table2, Bot } from "lucide-react";

const capabilities = [
  { icon: BarChart3, title: "Descriptive Statistics", desc: "Mean, median, standard deviation, and frequency tables — generated instantly." },
  { icon: TrendingUp, title: "Inferential Tests", desc: "t-tests, ANOVA, chi-square, and more — no syntax required." },
  { icon: PieChart, title: "Regression & Correlation", desc: "Linear and logistic regression with visual output and interpretation." },
  { icon: Table2, title: "Charts & Tables", desc: "Publication-ready visuals that embed directly into your chapters." },
  { icon: Bot, title: "AI Interpretation", desc: "Plain-language explanations of your results, linked to your research questions." },
];

const StatsAnalysisSection = () => (
  <section className="relative bg-gradient-subtle border-t border-border overflow-hidden">
    <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
    <div className="relative max-w-5xl mx-auto px-6 py-28">
      <div className="text-center mb-16">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          <span className="h-px w-8 bg-primary/40" /> Built-In Statistical Analysis <span className="h-px w-8 bg-primary/40" />
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
          No Exporting. No SPSS. <span className="text-gradient-primary">No R Scripts.</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          Run analyses inside Cognita and connect results directly to your writing and conclusions — without ever leaving the platform.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <div
            key={c.title}
            className="group relative rounded-2xl border border-border bg-card p-7 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:from-primary/10 transition-colors" />
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-5 ring-1 ring-primary/10 group-hover:scale-110 transition-transform">
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="relative font-display font-semibold text-lg mb-2">{c.title}</h3>
            <p className="relative text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsAnalysisSection;
