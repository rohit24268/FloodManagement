import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import AlertsPage from "./pages/AlertsPage";
import StatisticsPage from "./pages/StatisticsPage";
import SOSResponsePage from "./pages/SOSResponsePage";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/sos-response" element={<SOSResponsePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
