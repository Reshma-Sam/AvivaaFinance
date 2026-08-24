import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "./pages/Home";
import OurJourney from "./pages/OurJourny";
import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";
import DashboardLogin from "./pages/DashboardLogin";
import Leads from "./pages/Leads";
import Maintenance from "./pages/Maintenance";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages with Lenis Smooth Scroll */}
        <Route 
          path="/" 
          element={
            <ReactLenis root>
              <Home />
            </ReactLenis>
          } 
        />
        <Route 
          path="/our-journey" 
          element={
            <ReactLenis root>
              <OurJourney />
            </ReactLenis>
          } 
        />
        <Route path="/apply" element={<Apply />} />

        {/* Admin Pages (Native Scroll) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/login" element={<DashboardLogin />} />
        <Route path="/dashboard/leads" element={<Leads />} />

        {/* Dedicated Maintenance Page (if needed) */}
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Router>
  );
}

