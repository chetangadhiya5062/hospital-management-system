import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const res = await API.get("/appointments");
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/appointments/${id}`, { status });
    fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    await API.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Admin Dashboard</h1>

      {appointments.map((appt) => (
        <div key={appt._id} className="bg-gray-800 p-4 mb-3 rounded">
          <p><b>Patient:</b> {appt.patient?.name} ({appt.patient?.email})</p>
          <p><b>Doctor:</b> {appt.doctorName}</p>
          <p><b>Date:</b> {new Date(appt.date).toLocaleDateString()}</p>
          <p><b>Status:</b> {appt.status}</p>

          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-600 px-3 py-1 rounded"
              onClick={() => updateStatus(appt._id, "approved")}
            >
              Approve
            </button>

            <button
              className="bg-red-600 px-3 py-1 rounded"
              onClick={() => updateStatus(appt._id, "rejected")}
            >
              Reject
            </button>

            <button
              className="bg-gray-600 px-3 py-1 rounded"
              onClick={() => deleteAppointment(appt._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;