import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Causes from "./pages/Causes";
import CauseDetails from "./pages/CauseDetails";
import Donate from "./pages/Donate";
import MatchCauses from "./pages/MatchCauses";
import Dashboard from "./pages/Dashboard";
import DonorDashboard from "./pages/DonorDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/causes/:id" element={<CauseDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirects each user to their own dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Donor only */}
          <Route path="/match" element={<ProtectedRoute roles={["donor"]}><MatchCauses /></ProtectedRoute>} />
          <Route path="/donate/:id" element={<ProtectedRoute roles={["donor"]}><Donate /></ProtectedRoute>} />
          <Route path="/donor-dashboard" element={<ProtectedRoute roles={["donor"]}><DonorDashboard /></ProtectedRoute>} />

          {/* Collector only */}
          <Route path="/collector-dashboard" element={<ProtectedRoute roles={["collector"]}><CollectorDashboard /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin-dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}