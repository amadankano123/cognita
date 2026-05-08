import { Outlet } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import RoleSidebar, { RoleNavItem } from "./RoleSidebar";
import TopNav from "./TopNav";

interface Props {
  roleLabel: string;
  roleIcon: LucideIcon;
  items: RoleNavItem[];
}

const RoleShell = ({ roleLabel, roleIcon, items }: Props) => (
  <div className="flex min-h-screen w-full">
    <RoleSidebar roleLabel={roleLabel} roleIcon={roleIcon} items={items} />
    <div className="flex-1 flex flex-col min-w-0">
      <TopNav />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default RoleShell;
