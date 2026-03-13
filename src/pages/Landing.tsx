import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import ToolsReplacedSection from "@/components/landing/ToolsReplacedSection";
import StatsAnalysisSection from "@/components/landing/StatsAnalysisSection";
import PlagiarismSection from "@/components/landing/PlagiarismSection";
import ComparisonQuotesSection from "@/components/landing/ComparisonQuotesSection";
import AudienceSection from "@/components/landing/AudienceSection";
import PricingSection from "@/components/landing/PricingSection";
import heroBg from "@/assets/hero-bg.jpg";
import cognitaLogo from "@/assets/cognita-logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  const dashPath = isAdmin ? "/admin/dashboard" : "/app/proj-001/dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
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

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(224,64%,15%)] via-[hsl(224,64%,20%/0.9)] to-[hsl(224,64%,25%/0.85)]" />
        <div className="relative max-w-4xl mx-auto text-center pt-28 pb-32 px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6 animate-fade-in border border-primary-foreground/20">
            <Sparkles className="h-4 w-4" />
            The Research Operating System
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-5 text-primary-foreground animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            The Complete Research{" "}
            <span className="bg-gradient-to-r from-[hsl(200,80%,70%)] to-[hsl(260,70%,75%)] bg-clip-text text-transparent">Operating System</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            Cognita unifies research intelligence, statistical analysis, and plagiarism checking into one academic-grade system — from idea to publication.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <Button size="lg" className="text-base px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate(isAuthenticated ? dashPath : "/auth")}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" className="text-base px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => setDemoOpen(true)}>
              <Play className="h-4 w-4 mr-2" /> See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>See Cognita in Action</DialogTitle></DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="font-medium">Demo Video Placeholder</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Narrative Sections ── */}
      <ProblemSection />
      <SolutionSection />
      <ToolsReplacedSection />
      <StatsAnalysisSection />
      <PlagiarismSection />
      <ComparisonQuotesSection />
      <AudienceSection />

      {/* ── Pricing ── */}
      <PricingSection />

      {/* ── Final CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop Switching Tools. Start Finishing Research.</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of researchers using Cognita to write better, faster.</p>
        <Button size="lg" className="text-base px-10" onClick={() => navigate(isAuthenticated ? dashPath : "/auth")}>
          Build Your Research in Cognita <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={cognitaLogo} alt="Cognita Logo – Academic cap on book" className="h-6 w-6 object-contain" />
          <span className="font-display font-semibold text-foreground">Cognita</span>
        </div>
        © 2026 Cognita. The Research Operating System.
      </footer>
    </div>
  );
};

export default Landing;
