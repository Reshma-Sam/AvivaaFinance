import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Home from "./pages/Home";
import OurJourney from "./pages/OurJourny";
import Apply from "./pages/Apply";
import Dashboard from "./pages/Dashboard";
import DashboardLogin from "./pages/DashboardLogin";
import Leads from "./pages/Leads";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

export default function App() {
  // =========================================================================
  // TEMPORARY CHANGE: Entire website showing 404 Page Not Found screen.
  // To restore the website, remove/comment the line below and uncomment the routes.
  // =========================================================================
  return <NotFound />;

  /*
  return (
    <Router>
      <Routes>
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

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/login" element={<DashboardLogin />} />
        <Route path="/dashboard/leads" element={<Leads />} />

        <Route path="/maintenance" element={<Maintenance />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
  */
}

