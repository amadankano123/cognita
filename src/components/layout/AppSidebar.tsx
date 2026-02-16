import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileEdit,
  BookOpen,
  Bot,
  Database,
  BarChart3,
  ClipboardCheck,
  Download,
  Users,
  Settings,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import cognitaLogo from "@/assets/cognita-logo.jpeg";

const navItems = [
  { title: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { title: "Editor", path: "/app/editor", icon: FileEdit },
  { title: "References", path: "/app/references", icon: BookOpen },
  { title: "Data & Files", path: "/app/data", icon: Database },
  { title: "Analysis", path: "/app/analysis", icon: BarChart3 },
  { title: "Results", path: "/app/results", icon: ClipboardCheck },
  { title: "AI Reviewer", path: "/app/ai-reviewer", icon: Bot },
  { title: "Plagiarism Checker", path: "/app/plagiarism", icon: ShieldCheck },
  { title: "Export", path: "/app/export", icon: Download },
  { title: "Collaboration", path: "/app/collaboration", icon: Users },
  { title: "Settings", path: "/app/settings", icon: Settings },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border shrink-0">
        <img src={cognitaLogo} alt="Cognita" className="h-7 w-7 rounded-md object-cover shrink-0" />
        {!collapsed && (
          <span className="font-display text-lg font-semibold text-foreground tracking-tight">
            Cognita
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};

export default AppSidebar;
