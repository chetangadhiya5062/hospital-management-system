import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

function Login() {
  const { login } = useContext(AppContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({
        email: form.email,
        password: form.password,
        role: form.role,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          className="border p-2 rounded"
          placeholder="Email"
          required
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="border p-2 rounded"
          placeholder="Password"
          required
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;