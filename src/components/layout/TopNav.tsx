import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { LogOut, User, HelpCircle, Bell, ArrowLeftRight, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppRole, ADMIN_ROLES, ROLE_GROUPS } from "@/types/research";
import ProjectContextDrawer from "./ProjectContextDrawer";

const TopNav = () => {
  const { user, logout, role, isAdmin, switchRole } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  // Only use project context on researcher routes
  let projectTitle = "";
  try {
    if (!isAdminRoute) {
      const { project } = useProject();
      projectTitle = project.title;
    }
  } catch { /* admin route, no project context */ }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSwitchRole = (newRole: AppRole) => {
    switchRole(newRole);
    const isNewAdmin = ADMIN_ROLES.includes(newRole);
    navigate(isNewAdmin ? "/admin/dashboard" : "/app/proj-001/dashboard");
  };

  const notifications = [
    { id: 1, text: "AI review completed for your document", time: "2 min ago" },
    { id: 2, text: "Prof. Mwangi commented on Methodology", time: "1 hour ago" },
    { id: 3, text: "Export ready for download", time: "3 hours ago" },
  ];

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {!isAdminRoute && projectTitle && (
          <span className="text-sm font-medium text-foreground truncate max-w-xs">{projectTitle}</span>
        )}
        {isAdminRoute && (
          <span className="text-sm font-medium text-foreground">Institutional Dashboard</span>
        )}
        <Badge variant="outline" className="text-xs capitalize shrink-0">
          {role}
        </Badge>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {!isAdminRoute && <ProjectContextDrawer />}

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive border-2 border-card" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map(n => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
                <span className="text-sm">{n.text}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Switch Role */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Switch role">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLE_GROUPS.map(group => (
              <div key={group.label}>
                <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase tracking-wider">{group.label}</DropdownMenuLabel>
                {group.roles.map(r => (
                  <DropdownMenuItem
                    key={r.value}
                    onClick={() => handleSwitchRole(r.value)}
                    className={role === r.value ? "bg-accent" : ""}
                  >
                    <span className="flex items-center gap-2">
                      {ADMIN_ROLES.includes(r.value) && <Shield className="h-3 w-3 text-primary" />}
                      {r.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
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
                { step: "2", title: "Write & Organize", desc: "Use the structured editor to draft with sections." },
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

        {/* Profile */}
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
