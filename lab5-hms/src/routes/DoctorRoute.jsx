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

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
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
          path="/register"
          element={<Register />}
        />

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

        {/* ✅ NEW DOCTOR ROUTE */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <Doctor />
            </DoctorRoute>
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
      </Routes>
    </Layout>
  );
}

export default AppRoutes;