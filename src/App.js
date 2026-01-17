import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ScenarioEditor from "./pages/ScenarioEditor";
import SessionCreator from "./pages/SessionCreator";
import AnimatorPanel from "./pages/AnimatorPanel";
import ParticipantPanel from "./pages/ParticipantPanel";
import CentralScreen from "./pages/CentralScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/scenario/:scenarioId" element={<ScenarioEditor />} />
        <Route path="/admin/scenario" element={<ScenarioEditor />} />

        <Route path="/session/create" element={<SessionCreator />} />

        <Route path="/animator/:code" element={<AnimatorPanel />} />
        <Route path="/play" element={<ParticipantPanel />} />
        <Route path="/screen/:code" element={<CentralScreen />} />
      </Routes>
    </BrowserRouter>
  );
}