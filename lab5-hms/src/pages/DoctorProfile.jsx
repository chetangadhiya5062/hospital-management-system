import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/doctor/profile");
      setProfile(res.data.data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put("/doctor/profile", {
        specialization: profile.specialization,
        bio: profile.bio,
        photo: profile.photo
      });

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-10">Profile not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold text-gray-800">
        My Profile
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow space-y-6">

        {/* Profile Image */}
        <div className="flex items-center gap-6">
          <img
            src={
              profile.photo ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Doctor"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <div>
            <h2 className="text-xl font-semibold">
              {profile.name}
            </h2>
            <p className="text-gray-500">
              {profile.specialization}
            </p>
          </div>
        </div>

        {/* Editable Fields */}

        <div className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Profile Photo URL
            </label>
            <input
              type="text"
              value={profile.photo || ""}
              onChange={(e) =>
                setProfile({ ...profile, photo: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Specialization
            </label>
            <input
              type="text"
              value={profile.specialization || ""}
              onChange={(e) =>
                setProfile({ ...profile, specialization: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bio
            </label>
            <textarea
              rows="4"
              value={profile.bio || ""}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              placeholder="Write about your experience..."
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;