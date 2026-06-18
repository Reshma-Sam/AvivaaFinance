import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "../src/pages/Home";
import OurJourney from "../src/pages/OurJourny";
import Apply from "../src/pages/Apply";
import Dashboard from "../src/pages/Dashboard";
import DashboardLogin from "../src/pages/DashboardLogin";
import Leads from "../src/pages/Leads";

export default function App() {
  return (
    <ReactLenis root>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-journey" element={<OurJourney />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/login" element={<DashboardLogin />} />
          <Route path="/dashboard/leads" element={<Leads />} />
        </Routes>
      </Router>
    </ReactLenis>
  );
}



