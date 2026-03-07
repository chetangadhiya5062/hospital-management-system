import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AppContext } from "../context/AppContext";
import Skeleton from "../components/ui/Skeleton";

function Home() {
  const { user } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data.data || res.data);
    } finally {
      setLoading(false); // ✅ Stop loading after fetch
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const upcoming = appointments.find(
    (a) => a.status === "approved"
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-10">

      {/* 🔥 Welcome */}
      <div className="bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>
      </div>

      {/* 🔥 Stats (Updated with Loading Skeleton) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : (
            <>
              <StatCard title="Total Appointments" value={stats.total} />
              <StatCard title="Pending" value={stats.pending} />
              <StatCard title="Approved" value={stats.approved} />
              <StatCard title="Rejected" value={stats.rejected} />
            </>
          )}
      </div>

      {/* 🔥 Upcoming */}
      <div className="bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Upcoming Appointment
        </h2>

        {upcoming ? (
          <div>
            <p className="font-semibold text-lg">
              {upcoming.doctor?.name}
            </p>
            <p className="text-gray-500">
              {new Date(upcoming.date).toLocaleDateString()} • {upcoming.timeSlot}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">
            No upcoming approved appointments.
          </p>
        )}
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <h2 className="text-sm text-gray-500 uppercase">
        {title}
      </h2>
      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}

export default Home;