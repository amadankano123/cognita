import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileEdit, BookOpen, Bot, BarChart3, Download, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import PricingSection from "@/components/landing/PricingSection";
import heroBg from "@/assets/hero-bg.jpg";
import cognitaLogo from "@/assets/cognita-logo.png";

const features = [
  { icon: FileEdit, title: "Structured Editor", desc: "Write with real-time collaboration and AI review" },
  { icon: BookOpen, title: "Reference Manager", desc: "Organize, cite, and discover related works" },
  { icon: Bot, title: "AI Reviewer", desc: "Automated feedback on clarity, rigor, and completeness" },
  { icon: BarChart3, title: "Data & Analysis", desc: "Integrate datasets and run statistical analyses" },
  { icon: Download, title: "Multi-format Export", desc: "Generate DOCX, PDF, and LaTeX outputs" },
  { icon: ShieldCheck, title: "Plagiarism Checker", desc: "Scan your work against millions of sources" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  const dashPath = isAdmin ? "/admin/dashboard" : "/app/proj-001/dashboard";

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={cognitaLogo} alt="Cognita Logo – Academic cap on book" className="h-9 w-9 object-contain" />
          <span className="font-display text-xl font-semibold tracking-tight">Cognita</span>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <Button onClick={() => navigate(dashPath)} size="sm">
              Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log in</Button>
              <Button size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
            </>
          )}
        </div>
      </nav>

      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(224,64%,15%)] via-[hsl(224,64%,20%/0.9)] to-[hsl(224,64%,25%/0.85)]" />
        <div className="relative max-w-4xl mx-auto text-center pt-24 pb-28 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-6 animate-fade-in border border-white/20">
            <Sparkles className="h-4 w-4" />
            Unified Research Intelligence Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-5 text-white animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            Write. Analyze.{" "}
            <span className="bg-gradient-to-r from-[hsl(200,80%,70%)] to-[hsl(260,70%,75%)] bg-clip-text text-transparent">Publish.</span>
            {" "}In One Place.
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            Cognita brings researcher workspaces and institutional oversight into one seamless platform. Write proposals, manage data, and ensure compliance — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <Button size="lg" className="text-base px-8 bg-white text-primary hover:bg-white/90" onClick={() => navigate(isAuthenticated ? dashPath : "/auth")}>
              Start Free Project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 border-white/30 text-white hover:bg-white/10 hover:text-white" onClick={() => setDemoOpen(true)}>
              <Play className="h-4 w-4 mr-2" /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Watch Cognita in Action</DialogTitle></DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="font-medium">Demo Video Placeholder</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Everything You Need</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">A complete toolkit designed for researchers, from first draft to final submission.</p>
        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
          {features.map(f => (
            <div key={f.title} className="group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
              <div className="h-11 w-11 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <PricingSection />

      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to elevate your research?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of researchers using Cognita to write better, faster.</p>
        <Button size="lg" className="text-base px-10" onClick={() => navigate(isAuthenticated ? dashPath : "/auth")}>
          Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={cognitaLogo} alt="Cognita Logo – Academic cap on book" className="h-6 w-6 object-contain" />
          <span className="font-display font-semibold text-foreground">Cognita</span>
        </div>
        © 2026 Cognita. Unified Research Intelligence Platform.
      </footer>
    </div>
  );
};

export default Landing;
