import React from "react";
import { useParams } from "react-router-dom";
import { ref, update } from "firebase/database";
import { database } from "../firebase";
import { useFirebaseValue, formatTime, useServerTimer } from "../lib/firebaseHooks";
import "./AnimatorPanel.css";

export default function AnimatorPanel() {
  const { code } = useParams();
  const { value: session, loading } = useFirebaseValue(`sessions/${code}`);
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

  if (loading) {
    return (
      <div className="animator-container">
        <div className="animator-content">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="animator-container">
        <div className="animator-content">
          <p style={{ color: "#e74c3c" }}>Session introuvable</p>
        </div>
      </div>
    );
  }

  const phaseIds = Object.keys(scenario?.phases || {});
  const currentIndex = phaseIds.indexOf(phaseId);
  const totalPhases = phaseIds.length;
  const currentPhaseNumber = currentIndex >= 0 ? currentIndex : 0;

  const evenements = scenario?.evenements || {};
  const evenementActuel = session?.evenementActuel;

  const handleStartPhase = async (targetPhaseId) => {
    if (!scenario?.phases || !scenario.phases[targetPhaseId]) return;

    const targetPhase = scenario.phases[targetPhaseId];
    const dureeMs = (targetPhase.dureeMinutes || 10) * 60 * 1000;
    const endsAt = Date.now() + dureeMs;

    await update(ref(database, `sessions/${code}/phaseActuelle`), {
      phaseId: targetPhaseId,
      phaseEndsAt: endsAt,
      pausedAt: null,
      pausedTimeRemaining: null,
    });
  };

  const handleTriggerEvent = async (eventId) => {
    if (!evenements[eventId]) return;
    
    // Toggle : si l'événement est déjà actif, on le désactive
    if (evenementActuel?.eventId === eventId) {
      await update(ref(database, `sessions/${code}`), {
        evenementActuel: null,
      });
      return;
    }

    // Sinon, on active l'événement
    const event = evenements[eventId];
    await update(ref(database, `sessions/${code}`), {
      evenementActuel: {
        eventId: eventId,
        titre: event.titre,
        texte: event.texte,
        impacts: event.impacts || [],
        declencheLe: Date.now(),
      },
    });
  };

  const getPhaseName = (phaseIndex) => {
    const names = {
      0: "Briefing",
      1: "Réunion d'annonce",
      2: "Négociations",
      3: "Comité de pilotage",
      4: "Résolution",
      5: "Debrief"
    };
    return names[phaseIndex] || `Phase ${phaseIndex}`;
  };

  return (
    <div className="animator-container">
      <div className="animator-header">
        <h1>🎛️ Dashboard Animateur</h1>
        <p>Session : <strong>{code}</strong></p>
      </div>
      <div className="animator-content">
        <div className="animator-dashboard">
          <div className="animator-dashboard-main">
            <div className="animator-phase-indicator">
              <div className="animator-phase-number">{currentPhaseNumber}/{totalPhases}</div>
              <div className="animator-phase-name">
                {phase?.nom || getPhaseName(currentPhaseNumber)}
              </div>
            </div>

            <div className="animator-timer">{formatTime(timeRemaining)}</div>

            <div className="animator-phases-buttons">
              {phaseIds.map((pid, index) => {
                const p = scenario.phases[pid];
                return (
                  <button
                    key={pid}
                    className="animator-phase-btn"
                    onClick={() => handleStartPhase(pid)}
                  >
                    Phase {index} : {p.nom} ({p.dureeMinutes} min)
                  </button>
                );
              })}
            </div>
          </div>

          <div className="animator-dashboard-sidebar">
            <h3 className="animator-events-title">🎲 Événements</h3>
            {Object.entries(evenements).map(([id, event]) => {
              const isActive = evenementActuel?.eventId === id;
              return (
                <button
                  key={id}
                  className={`animator-event-btn ${isActive ? 'triggered' : ''}`}
                  onClick={() => handleTriggerEvent(id)}
                >
                  {isActive ? '✓ ' : ''}{event.titre}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
