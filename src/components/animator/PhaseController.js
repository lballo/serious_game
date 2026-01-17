import React from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";
import { useFirebaseValue, formatTime, useServerTimer } from "../../lib/firebaseHooks";

export default function PhaseController({ sessionCode }) {
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

  const isPaused = !!phaseActuelle.pausedAt;

  const handleStartPhase = async () => {
    if (!scenario?.phases || !scenario.phases[phaseId]) return;

    const phase = scenario.phases[phaseId];
    const dureeMs = (phase.dureeMinutes || 10) * 60 * 1000;
    const endsAt = Date.now() + dureeMs;

    await update(ref(database, `sessions/${sessionCode}/phaseActuelle`), {
      phaseId: phaseId,
      phaseEndsAt: endsAt,
      pausedAt: null,
      pausedTimeRemaining: null,
    });
  };

  const handlePause = async () => {
    if (isPaused) {
      // Reprendre
      const pausedTime = phaseActuelle.pausedTimeRemaining || 0;
      const endsAt = Date.now() + pausedTime;
      await update(ref(database, `sessions/${sessionCode}/phaseActuelle`), {
        phaseEndsAt: endsAt,
        pausedAt: null,
        pausedTimeRemaining: null,
      });
    } else {
      // Mettre en pause
      await update(ref(database, `sessions/${sessionCode}/phaseActuelle`), {
        pausedAt: Date.now(),
        pausedTimeRemaining: timeRemaining,
      });
    }
  };

  const handleNextPhase = async () => {
    if (!scenario?.phases) return;
    
    const phaseIds = Object.keys(scenario.phases);
    const currentIndex = phaseIds.indexOf(phaseId);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < phaseIds.length) {
      const nextPhaseId = phaseIds[nextIndex];
      await update(ref(database, `sessions/${sessionCode}/phaseActuelle`), {
        phaseId: nextPhaseId,
        phaseEndsAt: null,
        pausedAt: null,
        pausedTimeRemaining: null,
      });
    }
  };

  if (!session || !scenario) {
    return <div>Chargement...</div>;
  }

  const phaseIds = Object.keys(scenario.phases || {});
  const currentIndex = phaseIds.indexOf(phaseId);
  const hasNextPhase = currentIndex >= 0 && currentIndex < phaseIds.length - 1;

  const currentPhaseName = phase?.nom || `Phase ${phaseId}`;
  const isRunning = !!phaseActuelle.phaseEndsAt && !isPaused;

  return (
    <div style={{ padding: 20, background: "#f7f7f7", borderRadius: 12, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>⏱️ Contrôle de phase</h3>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          {currentPhaseName}
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: isRunning ? "#2ecc71" : "#e74c3c" }}>
          {formatTime(timeRemaining)}
        </div>
        <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
          {isPaused ? "⏸️ En pause" : isRunning ? "▶️ En cours" : "⏹️ Arrêté"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {!isRunning && !isPaused && (
          <button
            onClick={handleStartPhase}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              background: "#2ecc71",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ▶️ Lancer la phase
          </button>
        )}

        {(isRunning || isPaused) && (
          <button
            onClick={handlePause}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              background: "#f39c12",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
          </button>
        )}

        {hasNextPhase && (
          <button
            onClick={handleNextPhase}
            style={{
              padding: "12px 20px",
              borderRadius: 8,
              border: "none",
              background: "#3498db",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ⏭️ Phase suivante
          </button>
        )}
      </div>
    </div>
  );
}
