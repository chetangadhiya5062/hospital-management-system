import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white dark:bg-gray-800 shadow">

        <h1 className="text-2xl font-bold text-blue-600">
          HMS
        </h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Login
          </Link>
        </div>

      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 space-y-8">

        <h2 className="text-5xl font-bold text-gray-800 dark:text-white leading-tight">
          Smart Hospital <br />
          Management System
        </h2>

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
          Seamlessly manage appointments, doctors, payments, and medical reports —
          all in one modern healthcare platform.
        </p>

        <div className="flex gap-6">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition"
          >
            Get Started
          </Link>

          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 dark:text-white px-8 py-3 rounded-lg text-lg transition hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Create Account
          </Link>
        </div>

      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-10 px-10 py-16 bg-white dark:bg-gray-800">

        <Feature
          title="Easy Appointments"
          desc="Book and manage appointments instantly with real-time updates."
        />

        <Feature
          title="Doctor Dashboard"
          desc="Doctors can manage approvals and track upcoming patients."
        />

        <Feature
          title="Secure Reports"
          desc="Upload and manage medical reports securely."
        />

      </div>

    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {desc}
      </p>
    </div>
  );
}

export default Landing;