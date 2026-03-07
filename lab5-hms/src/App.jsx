import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import AdminDashboard from "./pages/AdminDashboard";
import Doctor from "./pages/Doctor";

function ProtectedRoute({ children }) {
  const { user } = useContext(AppContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useContext(AppContext);
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
}

function DoctorRoute({ children }) {
  const { user } = useContext(AppContext);
  if (!user || user.role !== "doctor") {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Dashboard */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />

        {/* Doctor Dashboard */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <Doctor />
            </DoctorRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;