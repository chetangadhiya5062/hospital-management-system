import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function PublicDoctor() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  const fetchDoctor = async () => {
    try {
      const res = await API.get(`/doctor/public/${id}`);
      setDoctor(res.data.data);
    } catch (err) {
      toast.error("Doctor not found");
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  if (!doctor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">

      <div className="bg-white p-8 rounded-2xl shadow space-y-6">

        <div className="flex items-center gap-6">
          <img
            src={
              doctor.photo ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Doctor"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {doctor.name}
            </h1>
            <p className="text-gray-500">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-600">
            {doctor.bio || "No bio provided yet."}
          </p>
        </div>

      </div>

    </div>
  );
}

export default PublicDoctor;