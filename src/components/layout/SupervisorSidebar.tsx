import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Bell, ChevronLeft, GraduationCap,
  FileSearch, CheckSquare, BarChart3, MessageSquare, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import cognitaLogo from "@/assets/cognita-logo.png";

const navItems = [
  { title: "Overview", path: "/supervisor/overview", icon: LayoutDashboard },
  { title: "My Students", path: "/supervisor/students", icon: Users },
  { title: "Reviews", path: "/supervisor/reviews", icon: FileSearch },
  { title: "Approvals", path: "/supervisor/approvals", icon: CheckSquare },
  { title: "Analytics", path: "/supervisor/analytics", icon: BarChart3 },
  { title: "Notifications", path: "/supervisor/notifications", icon: Bell },
  { title: "Messages", path: "/supervisor/messages", icon: MessageSquare },
  { title: "Settings", path: "/supervisor/settings", icon: Settings },
];

const SupervisorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn("sticky top-0 h-screen border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-200", collapsed ? "w-16" : "w-60")}>
      <div className="h-14 flex items-center gap-2 px-4 border-b border-sidebar-border shrink-0">
        <img src={cognitaLogo} alt="Cognita Logo" className="h-8 w-8 object-contain shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-display text-lg font-semibold text-foreground tracking-tight block">Cognita</span>
            <span className="text-[10px] text-primary font-medium uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> Supervisor
            </span>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground")}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="h-10 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};

export default SupervisorSidebar;
