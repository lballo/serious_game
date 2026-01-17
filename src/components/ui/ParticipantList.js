import React from "react";
import "./ParticipantList.css";

export default function ParticipantList({ participants, className = "" }) {
  return (
    <div className={`participant-list ${className}`}>
      {participants.map((participant, index) => (
        <div key={index} className="participant-list-item">
          <span className="participant-list-dot">•</span>
          <span className="participant-list-name">{participant.name}</span>
          <span className="participant-list-role">• {participant.role}</span>
        </div>
      ))}
    </div>
  );
}
