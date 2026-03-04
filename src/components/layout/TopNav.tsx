import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, HelpCircle, Bell, ArrowLeftRight, Shield, GraduationCap, Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AppRole, ALL_ROLES } from "@/types/research";

const TopNav = () => {
  const { user, logout, role, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHodRoute = location.pathname.startsWith("/hod");
  const isSupervisorRoute = location.pathname.startsWith("/supervisor");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRouteForRole = (r: AppRole) => {
    switch (r) {
      case "Research Director": return "/admin/dashboard";
      case "Head of Department": return "/hod/dashboard";
      case "Supervisor": return "/supervisor/dashboard";
      case "Student": return "/app/student/dashboard";
    }
  };

  const handleSwitchRole = (newRole: AppRole) => {
    switchRole(newRole);
    navigate(getRouteForRole(newRole));
  };

  const getRoleIcon = (r: AppRole) => {
    switch (r) {
      case "Research Director": return <Shield className="h-3 w-3 text-primary" />;
      case "Head of Department": return <Building2 className="h-3 w-3 text-primary" />;
      case "Supervisor": return <GraduationCap className="h-3 w-3 text-primary" />;
      default: return null;
    }
  };

  const getDashboardLabel = () => {
    if (isAdminRoute) return "Institutional Dashboard";
    if (isHodRoute) return "Department Dashboard";
    if (isSupervisorRoute) return "Supervisor Dashboard";
    return "Student Workspace";
  };

  const notifications = [
    { id: 1, text: "AI review completed for your document", time: "2 min ago" },
    { id: 2, text: "Supervisor commented on Methodology", time: "1 hour ago" },
    { id: 3, text: "Export ready for download", time: "3 hours ago" },
  ];

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium text-foreground">{getDashboardLabel()}</span>
        <Badge variant="outline" className="text-xs capitalize shrink-0">{role}</Badge>
        {user?.studentCategory && (
          <Badge variant="secondary" className="text-xs shrink-0">{user.studentCategory}</Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
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
            {ALL_ROLES.map(r => (
              <DropdownMenuItem key={r} onClick={() => handleSwitchRole(r)} className={role === r ? "bg-accent" : ""}>
                <span className="flex items-center gap-2">
                  {getRoleIcon(r)}
                  {r}
                </span>
              </DropdownMenuItem>
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
            <DialogHeader><DialogTitle>How Cognita Works</DialogTitle></DialogHeader>
            <div className="space-y-4 text-sm">
              {[
                { step: "1", title: "Create a Project", desc: "Set up your research project with metadata." },
                { step: "2", title: "Write & Organize", desc: "Use the structured editor to draft sections." },
                { step: "3", title: "Manage References", desc: "Import references via DOI or BibTeX." },
                { step: "4", title: "Upload & Analyze Data", desc: "Upload datasets and run analyses." },
                { step: "5", title: "AI Review", desc: "Get automated feedback on quality." },
                { step: "6", title: "Export & Submit", desc: "Generate publication-ready documents." },
              ].map(item => (
                <div key={item.step} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">{item.step}</div>
                  <div><p className="font-medium">{item.title}</p><p className="text-muted-foreground text-xs">{item.desc}</p></div>
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
