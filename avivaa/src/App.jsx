import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Maintenance from "./pages/Maintenance";

// Original page imports preserved for easy restoration when maintenance concludes:
// import { ReactLenis } from "lenis/react";
// import Home from "./pages/Home";
// import OurJourney from "./pages/OurJourny";
// import Apply from "./pages/Apply";
// import Dashboard from "./pages/Dashboard";
// import DashboardLogin from "./pages/DashboardLogin";
// import Leads from "./pages/Leads";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* All website links and routes automatically route to the Server Maintenance page */}
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/" element={<Maintenance />} />
        <Route path="*" element={<Navigate to="/maintenance" replace />} />
      </Routes>
    </Router>
  );
}
