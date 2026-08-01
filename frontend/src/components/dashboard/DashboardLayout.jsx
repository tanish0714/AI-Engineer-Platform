import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">

      <div className="flex">

        {/* Sidebar */}

        <Sidebar />

        {/* Main */}

        <main className="flex min-h-screen flex-1 flex-col">

          <Topbar />

          <div className="flex-1 bg-[#09090B] p-8">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;