import { Outlet } from "react-router-dom";
import SupervisorSidebar from "./SupervisorSidebar";
import TopNav from "./TopNav";

const SupervisorLayout = () => (
  <div className="flex min-h-screen w-full">
    <SupervisorSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <TopNav />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default SupervisorLayout;
