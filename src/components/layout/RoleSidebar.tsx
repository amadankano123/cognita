import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, LucideIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import cognitaLogo from "@/assets/cognita-logo.png";

export interface RoleNavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

interface Props {
  roleLabel: string;
  roleIcon: LucideIcon;
  items: RoleNavItem[];
}

const RoleSidebar = ({ roleLabel, roleIcon: RoleIcon, items }: Props) => {
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
              <RoleIcon className="h-3 w-3" /> {roleLabel}
            </span>
          </div>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground")}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="h-10 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors" aria-label={collapsed ? "Expand" : "Collapse"}>
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};

export default RoleSidebar;
