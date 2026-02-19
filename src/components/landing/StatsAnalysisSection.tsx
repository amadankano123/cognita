import { BarChart3, TrendingUp, PieChart, Table2, Bot } from "lucide-react";

const capabilities = [
  { icon: BarChart3, title: "Descriptive Statistics", desc: "Mean, median, standard deviation, and frequency tables — generated instantly." },
  { icon: TrendingUp, title: "Inferential Tests", desc: "t-tests, ANOVA, chi-square, and more — no syntax required." },
  { icon: PieChart, title: "Regression & Correlation", desc: "Linear and logistic regression with visual output and interpretation." },
  { icon: Table2, title: "Charts & Tables", desc: "Publication-ready visuals that embed directly into your chapters." },
  { icon: Bot, title: "AI Interpretation", desc: "Plain-language explanations of your results, linked to your research questions." },
];

const StatsAnalysisSection = () => (
  <section className="bg-muted/50 border-t border-border">
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Built-In Statistical Analysis</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          No Exporting. No SPSS. No R Scripts.
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Run analyses inside Cognita and connect results directly to your writing and conclusions — without ever leaving the platform.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center mb-4">
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-1">{c.title}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsAnalysisSection;
