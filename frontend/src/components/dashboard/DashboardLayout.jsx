import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-transparent">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        <Topbar />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div
            className="
              mx-auto
              w-full
              max-w-[1800px]
              px-6
              py-8
              sm:px-8
              lg:px-10
              xl:px-12
              2xl:px-16
            "
          >
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;