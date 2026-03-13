import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  LayoutDashboard, FileEdit, BookOpen, Bot, Database, BarChart3,
  ClipboardCheck, Download, Users, Settings, ChevronLeft, ShieldCheck, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import cognitaLogo from "@/assets/cognita-logo.png";

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { projectId } = useParams();
  const pid = projectId || "proj-001";

  const navItems = [
    { title: "Dashboard", path: `/app/${pid}/dashboard`, icon: LayoutDashboard },
    { title: "Editor", path: `/app/${pid}/editor`, icon: FileEdit },
    { title: "References", path: `/app/${pid}/references`, icon: BookOpen },
    { title: "Data & Files", path: `/app/${pid}/data`, icon: Database },
    { title: "Analysis", path: `/app/${pid}/analysis`, icon: BarChart3 },
    { title: "Results", path: `/app/${pid}/results`, icon: ClipboardCheck },
    { title: "AI Reviewer", path: `/app/${pid}/ai-reviewer`, icon: Bot },
    { title: "Plagiarism Checker", path: `/app/${pid}/plagiarism`, icon: ShieldCheck },
    { title: "Export", path: `/app/${pid}/export`, icon: Download },
    { title: "Collaboration", path: `/app/${pid}/collaboration`, icon: Users },
    { title: "Settings", path: `/app/${pid}/settings`, icon: Settings },
  ];

  return (
    <aside className={cn("sticky top-0 h-screen border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-200", collapsed ? "w-16" : "w-60")}>
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border shrink-0">
        <img src={cognitaLogo} alt="Cognita Logo – Academic cap on book" className="h-8 w-8 object-contain shrink-0" />
        {!collapsed && <span className="font-display text-lg font-semibold text-foreground tracking-tight">Cognita</span>}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.path} to={item.path} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground")}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="h-10 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};

export default AppSidebar;
