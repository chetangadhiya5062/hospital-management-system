import { useEffect, useState } from "react";
import API from "../services/api";
import Skeleton from "../components/ui/Skeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      setUpdatingId(id);

      await API.put(`/appointments/${action}/${id}`);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id
            ? { ...appt, status: action === "approve" ? "approved" : "rejected" }
            : appt
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    approved: appointments.filter((a) => a.status === "approved").length,
    rejected: appointments.filter((a) => a.status === "rejected").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  /* ---------------- PIE CHART DATA ---------------- */

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
    { name: "Cancelled", value: stats.cancelled },
  ];

  const COLORS = ["#FACC15", "#22C55E", "#EF4444", "#9CA3AF"];

  const hasData =
    stats.pending +
      stats.approved +
      stats.rejected +
      stats.cancelled >
    0;

  /* ---------------- LINE CHART DATA ---------------- */

  const dateMap = {};

  appointments.forEach((a) => {
    const d = new Date(a.date).toLocaleDateString();
    dateMap[d] = (dateMap[d] || 0) + 1;
  });

  const lineData = Object.keys(dateMap).map((date) => ({
    date,
    count: dateMap[date],
  }));

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* 🔥 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))
          : (
            <>
              <StatCard title="Total" value={stats.total} color="blue" />
              <StatCard title="Pending" value={stats.pending} color="yellow" />
              <StatCard title="Approved" value={stats.approved} color="green" />
              <StatCard title="Rejected" value={stats.rejected} color="red" />
              <StatCard title="Cancelled" value={stats.cancelled} color="gray" />
            </>
          )}
      </div>

      {/* 🔥 Charts Section */}
      {loading ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6">
            Appointment Status Distribution
          </h2>

          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No appointment data available
            </div>
          )}

          {/* 🔥 LINE CHART */}
          <h2 className="text-xl font-bold mt-10 mb-4">
            Appointments Over Time
          </h2>

          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No timeline data available
            </div>
          )}
        </div>
      )}

      {/* 🔥 Filters */}
      <div className="flex gap-3 flex-wrap">
        {["all", "pending", "approved", "rejected", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-white border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 Table */}
      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow text-center text-gray-500">
          No appointments found for this filter.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{appt.patient?.name || "N/A"}</td>
                  <td className="px-6 py-4">{appt.doctor?.name || "N/A"}</td>
                  <td className="px-6 py-4">
                    {new Date(appt.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{appt.timeSlot}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {appt.status === "pending" && (
                      <>
                        <button
                          disabled={updatingId === appt._id}
                          onClick={() => updateStatus(appt._id, "approve")}
                          className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                        >
                          {updatingId === appt._id ? "..." : "Approve"}
                        </button>
                        <button
                          disabled={updatingId === appt._id}
                          onClick={() => updateStatus(appt._id, "reject")}
                          className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                        >
                          {updatingId === appt._id ? "..." : "Reject"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ title, value, color }) {
  const colorMap = {
    blue: "text-blue-500",
    yellow: "text-yellow-500",
    green: "text-green-500",
    red: "text-red-500",
    gray: "text-gray-500",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
      <h2 className="text-sm text-gray-500 uppercase mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-200 text-gray-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default Admin;