import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Topbar() {
  const { user, logout } = useContext(AppContext);

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-700">
        Welcome, {user?.name}
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;