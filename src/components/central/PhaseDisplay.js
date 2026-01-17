import React from "react";
import { useFirebaseValue, formatTime, useServerTimer } from "../../lib/firebaseHooks";
import EventDisplay from "./EventDisplay";
import "./PhaseDisplay.css";

export default function PhaseDisplay({ sessionCode }) {
  const { value: session } = useFirebaseValue(`sessions/${sessionCode}`);
  const { value: scenario } = useFirebaseValue(
    session?.scenarioId ? `scenarios/${session.scenarioId}` : null
  );

  const phaseActuelle = session?.phaseActuelle || {};
  const phaseId = phaseActuelle.phaseId;
  const phase = scenario?.phases?.[phaseId];

  const timeRemaining = useServerTimer(
    phaseActuelle.phaseEndsAt,
    phaseActuelle.pausedAt,
    phaseActuelle.pausedTimeRemaining
  );

  if (!session || !scenario) {
    return (
      <div className="screen-loading">
        Chargement...
      </div>
    );
  }

  const currentPhaseName = phase?.nom || `Phase ${phaseId}`;
  const isPaused = !!phaseActuelle.pausedAt;
  const isRunning = !!phaseActuelle.phaseEndsAt && !isPaused;
  const timerClass = isRunning ? "running" : isPaused ? "paused" : "stopped";

  // Calcul de l'index de phase et du total
  const phases = scenario?.phases || {};
  const phaseIds = Object.keys(phases);
  const currentPhaseIndex = phaseIds.indexOf(phaseId) + 1;
  const totalPhases = phaseIds.length;

  return (
    <div className="screen-phase-display">
      <div className="screen-phase-content">
        {/* Header */}
        <div className="screen-header">
          <h1 className="screen-title">{scenario.titre || "ADMR CHANGE LAB"}</h1>
          <p className="screen-subtitle">
            Session {session.codeSession || sessionCode} • Phase {currentPhaseIndex}/{totalPhases}
          </p>
        </div>

        {/* Timer Zone */}
        <div className="screen-timer-zone">
          <div className={`screen-timer ${timerClass}`}>
            {formatTime(timeRemaining)}
          </div>
          <p className="screen-timer-status">
            {isPaused ? "⏸ Arrêté" : isRunning ? "▶ En cours" : "⏹ Arrêté"}
          </p>
        </div>

        {/* Event Display - intégré dans le flux */}
        <EventDisplay sessionCode={sessionCode} />
      </div>
    </div>
  );
}
