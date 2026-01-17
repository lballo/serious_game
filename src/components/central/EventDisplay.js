import React from "react";
import { useFirebaseValue } from "../../lib/firebaseHooks";
import "./EventDisplay.css";

export default function EventDisplay({ sessionCode }) {
  const { value: session } = useFirebaseValue(`sessions/${sessionCode}`);

  if (!session) {
    return null;
  }

  const evenementActuel = session.evenementActuel;

  if (!evenementActuel) {
    return null;
  }

  // Récupération des impacts si disponibles (peut être un array ou une string)
  const impacts = evenementActuel.impacts || [];
  const impactsArray = Array.isArray(impacts) ? impacts : impacts ? [impacts] : [];

  return (
    <div className="screen-event-card">
      {/* Titre */}
      <div className="screen-event-title">📢 Dernier événement</div>
      
      {/* Titre de l'événement */}
      <h2 className="screen-event-subtitle">{evenementActuel.titre}</h2>
      
      {/* Section Annonce */}
      <div className="screen-event-announcement">
        <p className="screen-event-announcement-text">{evenementActuel.texte}</p>
      </div>

      {/* Section Impacts (si disponible) */}
      {impactsArray.length > 0 && (
        <div className="screen-event-impacts">
          <div className="screen-event-impacts-header">
            <span className="screen-event-impacts-icon">⚡</span>
            <h2 className="screen-event-impacts-label">Impacts concrets terrain :</h2>
          </div>
          <ul className="screen-event-impacts-list">
            {impactsArray.map((impact, index) => (
              <li key={index} className="screen-event-impact-item">
                {typeof impact === 'string' ? impact : impact.text || impact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
