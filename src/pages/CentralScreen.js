import React from "react";
import { useParams } from "react-router-dom";
import PhaseDisplay from "../components/central/PhaseDisplay";

export default function CentralScreen() {
  const { code } = useParams();

  return (
    <div style={{ position: "relative", width: "100vw", minHeight: "100vh" }}>
      <PhaseDisplay sessionCode={code} />
    </div>
  );
}
