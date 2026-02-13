import { useNavigate } from "react-router-dom";
import { GraduationCap, FileEdit, BookOpen, Bot, BarChart3, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const features = [
  { icon: FileEdit, title: "Proposal Editor", desc: "Structured writing with real-time collaboration" },
  { icon: BookOpen, title: "Reference Manager", desc: "Organize, cite, and discover related works" },
  { icon: Bot, title: "AI Reviewer", desc: "Automated feedback on clarity, rigor, and completeness" },
  { icon: BarChart3, title: "Data & Analysis", desc: "Integrate datasets and run statistical analyses" },
  { icon: Download, title: "Multi-format Export", desc: "Generate DOCX, PDF, and LaTeX outputs" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-semibold tracking-tight">Cognita</span>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <Button onClick={() => navigate("/app/dashboard")} size="sm">
              Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center pt-20 pb-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
          Your Research,{" "}
          <span className="text-primary">Unified.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          From proposal drafting to publication-ready export — Cognita brings every stage of academic research into one seamless platform.
        </p>
        <Button size="lg" onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")}>
          Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="bg-card rounded-lg border border-border p-5 shadow-card hover:shadow-elevated transition-shadow">
            <f.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Landing;
