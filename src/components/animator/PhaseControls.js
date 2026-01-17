import React from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";
import { useFirebaseValue, useServerTimer } from "../../lib/firebaseHooks";
import PrimaryButton from "../ui/PrimaryButton";

export default function PhaseControls({ sessionCode }) {
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
  const isRunning = !!phaseActuelle.phaseEndsAt && !isPaused;

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
    return null;
  }

  const phaseIds = Object.keys(scenario.phases || {});
  const currentIndex = phaseIds.indexOf(phaseId);
  const hasNextPhase = currentIndex >= 0 && currentIndex < phaseIds.length - 1;

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
      {!isRunning && !isPaused && (
        <PrimaryButton variant="green" onClick={handleStartPhase}>
          ▶️ Lancer la phase
        </PrimaryButton>
      )}

      {(isRunning || isPaused) && (
        <PrimaryButton variant="orange" onClick={handlePause}>
          {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
        </PrimaryButton>
      )}

      {hasNextPhase && (
        <PrimaryButton variant="blue" onClick={handleNextPhase}>
          ⏭️ Phase suivante
        </PrimaryButton>
      )}
    </div>
  );
}
