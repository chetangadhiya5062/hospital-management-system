import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Upload() {
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);

  const fetchUploads = async () => {
    const res = await API.get("/uploads");
    setUploads(res.data.data);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/uploads", formData);
      toast.success("File uploaded successfully");
      fetchUploads();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Upload Medical Report</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-3 rounded w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Upload
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">My Reports</h2>

        {uploads.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <span>{u.originalname}</span>
            <span className="text-gray-500 text-sm">
              {new Date(u.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Upload;