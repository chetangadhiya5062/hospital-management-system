import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Upload from "../pages/Upload";
import Appointment from "../pages/Appointment";
import Payment from "../pages/Payment";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
import Doctor from "../pages/Doctor";
import DoctorRoute from "./DoctorRoute";
import DoctorProfile from "../pages/DoctorProfile";
import PublicDoctor from "../pages/PublicDoctor";
import Landing from "../pages/Landing";

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Doctor Profile (No Protection) */}
        <Route
          path="/doctor/view/:id"
          element={<PublicDoctor />}
        />

        {/* Protected User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* DOCTOR */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <Doctor />
            </DoctorRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <DoctorRoute>
              <DoctorProfile />
            </DoctorRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;