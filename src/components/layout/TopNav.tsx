import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { LogOut, User, HelpCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TopNav = () => {
  const { user, logout } = useAuth();
  const { project } = useProject();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      {/* Left: project name */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-foreground truncate max-w-xs">{project.title}</span>
        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize hidden sm:inline">{project.status}</span>
      </div>

      {/* Right: user + help */}
      <div className="flex items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>How Cognita Works</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              {[
                { step: "1", title: "Create a Project", desc: "Set up your research project with metadata and choose a template." },
                { step: "2", title: "Write & Organize", desc: "Use the structured editor to draft your proposal with sections." },
                { step: "3", title: "Manage References", desc: "Import references via DOI or BibTeX. Cite them inline." },
                { step: "4", title: "Upload & Analyze Data", desc: "Upload datasets and run statistical analyses directly." },
                { step: "5", title: "AI Review", desc: "Get automated feedback on clarity, rigor, and completeness." },
                { step: "6", title: "Export & Submit", desc: "Generate publication-ready DOCX, PDF, or LaTeX documents." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-foreground leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Log out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
