import { Outlet } from "react-router-dom";
import HodSidebar from "./HodSidebar";
import TopNav from "./TopNav";

const HodLayout = () => (
  <div className="flex min-h-screen w-full">
    <HodSidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <TopNav />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default HodLayout;
