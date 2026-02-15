import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, FileEdit, BookOpen, Bot, BarChart3, Download, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: FileEdit, title: "Proposal Editor", desc: "Structured writing with real-time collaboration" },
  { icon: BookOpen, title: "Reference Manager", desc: "Organize, cite, and discover related works" },
  { icon: Bot, title: "AI Reviewer", desc: "Automated feedback on clarity, rigor, and completeness" },
  { icon: BarChart3, title: "Data & Analysis", desc: "Integrate datasets and run statistical analyses" },
  { icon: Download, title: "Multi-format Export", desc: "Generate DOCX, PDF, and LaTeX outputs" },
  { icon: ShieldCheck, title: "Plagiarism Checker", desc: "Scan your work against millions of sources instantly" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/80 backdrop-blur-md sticky top-0 z-50">
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log in</Button>
              <Button size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(224,64%,20%/0.88)] via-[hsl(224,64%,25%/0.75)] to-background" />
        <div className="relative max-w-4xl mx-auto text-center pt-24 pb-28 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 animate-fade-in border border-primary/30">
            <Sparkles className="h-4 w-4" />
            The Operating System for Academic Research
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-5 text-primary-foreground animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            Write. Analyze.{" "}
            <span className="bg-gradient-to-r from-[hsl(200,80%,70%)] to-[hsl(260,70%,75%)] bg-clip-text text-transparent">
              Publish.
            </span>
            {" "}In One Place.
          </h1>
          <p className="text-lg md:text-xl text-[hsl(210,20%,80%)] max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            Stop juggling multiple subscriptions. Cognita brings proposal drafting, reference management, data analysis, and export into one seamless platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <Button size="lg" className="text-base px-8" onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")}>
              Start Free Project <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 border-primary/40 text-primary-foreground hover:bg-primary/20 hover:text-primary-foreground" onClick={() => setDemoOpen(true)}>
              <Play className="h-4 w-4 mr-2" /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Watch Cognita in Action</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="font-medium">Demo Video Placeholder</p>
              <p className="text-sm mt-1">A walkthrough of the Cognita platform will appear here.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Everything You Need</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          A complete toolkit designed for researchers, from first draft to final submission.
        </p>
        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
          {features.map((f, i) => (
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

      {/* Plagiarism Panel */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5" />
        <div className="relative max-w-5xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                Built-in Integrity Check
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Plagiarism Checker{" "}
                <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">You Can Trust</span>
              </h2>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                Ensure academic integrity before submission. Our plagiarism checker scans your entire proposal against a vast database of published papers, preprints, and web sources.
              </p>
              <ul className="space-y-3 mb-8">
                {["Cross-reference against 100M+ academic papers", "Real-time similarity scoring per section", "Highlighted overlapping passages with source links", "Exportable plagiarism report for submission"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => navigate(isAuthenticated ? "/app/plagiarism" : "/auth")}>
                Try Plagiarism Checker <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-elevated">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-display font-semibold text-lg">Similarity Report</h4>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success">Low Risk</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-24 w-24">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-muted" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="8 92" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">8%</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong className="text-foreground">2</strong> matching sources found</p>
                  <p><strong className="text-foreground">142</strong> words flagged of 18,400</p>
                  <p className="text-success font-medium">Ready for submission</p>
                </div>
              </div>
              <div className="space-y-2">
                {[{ section: "Introduction", pct: 3 }, { section: "Literature Review", pct: 12 }, { section: "Methodology", pct: 5 }, { section: "Expected Results", pct: 2 }].map((s) => (
                  <div key={s.section} className="flex items-center gap-3 text-sm">
                    <span className="w-36 text-muted-foreground truncate">{s.section}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-foreground transition-all duration-700" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-medium text-foreground">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to elevate your research?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of researchers using Cognita to write better proposals, faster.</p>
        <Button size="lg" className="text-base px-10" onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/auth")}>
          Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="font-display font-semibold text-foreground">Cognita</span>
        </div>
        © 2026 Cognita. Built for researchers, by researchers.
      </footer>
    </div>
  );
};

export default Landing;
