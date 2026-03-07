import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Users } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-5">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">HMS Admin</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/admin" className={linkClass("/admin")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/admin/appointments" className={linkClass("/admin/appointments")}>
          <CalendarDays size={18} />
          Appointments
        </Link>

        <Link to="/admin/doctors" className={linkClass("/admin/doctors")}>
          <Users size={18} />
          Doctors
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;