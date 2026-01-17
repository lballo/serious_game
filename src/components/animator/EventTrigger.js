import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";
import { useFirebaseValue } from "../../lib/firebaseHooks";
import PrimaryButton from "../ui/PrimaryButton";

export default function EventTrigger({ sessionCode }) {
  const { value: session } = useFirebaseValue(`sessions/${sessionCode}`);
  const { value: scenario } = useFirebaseValue(
    session?.scenarioId ? `scenarios/${session.scenarioId}` : null
  );

  const [selectedEventId, setSelectedEventId] = useState("");

  const handleTriggerEvent = async () => {
    if (!selectedEventId) return;

    const event = scenario?.evenements?.[selectedEventId];
    if (!event) return;

    await update(ref(database, `sessions/${sessionCode}`), {
      evenementActuel: {
        eventId: selectedEventId,
        titre: event.titre,
        texte: event.texte,
        impacts: event.impacts || [],
        declencheLe: Date.now(),
      },
    });

    setSelectedEventId("");
  };

  const handleClearEvent = async () => {
    await update(ref(database, `sessions/${sessionCode}`), {
      evenementActuel: null,
    });
  };

  if (!session || !scenario) {
    return null;
  }

  const evenements = scenario.evenements || {};
  const evenementActuel = session.evenementActuel;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {evenementActuel && (
        <div
          style={{
            padding: "12px",
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "8px",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: "14px" }}>
            Événement actuel : {evenementActuel.titre}
          </div>
          <PrimaryButton
            variant="orange"
            size="sm"
            onClick={handleClearEvent}
          >
            Effacer
          </PrimaryButton>
        </div>
      )}

      <select
        value={selectedEventId}
        onChange={(e) => setSelectedEventId(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-family)",
          fontSize: "14px",
          background: "white",
        }}
      >
        <option value="">— Choisir un événement —</option>
        {Object.entries(evenements).map(([id, event]) => (
          <option key={id} value={id}>
            {event.titre}
          </option>
        ))}
      </select>
      <PrimaryButton
        variant="blue"
        size="md"
        onClick={handleTriggerEvent}
        disabled={!selectedEventId}
      >
        Déclencher
      </PrimaryButton>
    </div>
  );
}
