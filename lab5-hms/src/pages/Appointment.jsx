import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ ADDED
import API from "../services/api";
import { toast } from "react-toastify";

function Appointment() {
  const [doctor, setDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const timeSlots = [
    "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "02:00 PM","02:30 PM","03:00 PM","03:30 PM"
  ];

  const fetchAppointments = async () => {
    const res = await API.get("/appointments");
    setAppointments(res.data.data || res.data);
  };

  const fetchDoctors = async () => {
    const res = await API.get("/doctors");
    setDoctors(res.data.data || res.data);
  };

  const fetchBookedSlots = async () => {
    if (!doctor || !date) return;
    const res = await API.get(`/appointments/slots?doctor=${doctor}&date=${date}`);
    setBookedSlots(res.data.data || res.data);
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchBookedSlots();
  }, [doctor, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/appointments", {
        doctor,
        date,
        timeSlot,
        reason
      });

      toast.success("Appointment booked successfully");

      setDoctor("");
      setDate("");
      setTimeSlot("");
      setReason("");
      fetchAppointments();
      fetchBookedSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }

    setLoading(false);
  };

  const cancelAppointment = async (id) => {
    try {
      await API.put(`/appointments/cancel/${id}`);
      toast.info("Appointment cancelled");
      fetchAppointments();
      fetchBookedSlots();
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold text-gray-800">
        Book Appointment
      </h1>

      <div className="bg-white rounded-xl shadow p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Select Doctor
            </label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Choose Doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} - {doc.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

        </div>

        <div>
          <label className="block mb-3 text-sm font-medium text-gray-600">
            Select Time Slot
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = timeSlot === slot;

              return (
                <button
                  type="button"
                  key={slot}
                  disabled={isBooked}
                  onClick={() => setTimeSlot(slot)}
                  className={`p-3 rounded-lg border transition ${
                    isBooked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:border-blue-500"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Reason
          </label>
          <input
            type="text"
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          My Appointments
        </h2>

        {appointments.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500 text-center">
            No appointments booked yet.
          </div>
        )}

        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              {/* ✅ UPDATED DOCTOR NAME TO CLICKABLE LINK */}
              <p className="font-semibold">
                <Link
                  to={`/doctor/view/${appt.doctor?._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {appt.doctor?.name}
                </Link>
              </p>

              <p className="text-sm text-gray-500">
                {new Date(appt.date).toLocaleDateString()} • {appt.timeSlot}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StatusBadge status={appt.status} />

              {appt.status === "pending" && (
                <button
                  onClick={() => cancelAppointment(appt._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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

export default Appointment;