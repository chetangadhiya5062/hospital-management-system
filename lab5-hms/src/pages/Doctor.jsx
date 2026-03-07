import { useEffect, useState } from "react";
import API from "../services/api";

function Doctor() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const res = await API.get("/doctor/appointments");
    setAppointments(res.data.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ NEW: Approve function
  const handleApprove = async (id) => {
    await API.put(`/doctor/approve/${id}`);
    fetchAppointments(); // refresh list
  };

  // ✅ NEW: Reject function
  const handleReject = async (id) => {
    await API.put(`/doctor/reject/${id}`);
    fetchAppointments(); // refresh list
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt._id}
            className="bg-gray-900 border border-gray-800 shadow-lg p-5 rounded mb-4"
          >
            <p><b>Patient:</b> {appt.patient?.name}</p>
            <p><b>Date:</b> {new Date(appt.date).toLocaleDateString()}</p>
            <p><b>Time:</b> {appt.timeSlot}</p>
            <p><b>Status:</b> {appt.status}</p>

            {appt.status === "pending" && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleApprove(appt._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(appt._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Doctor;