import React from "react";
import "./PhaseListItem.css";

export default function PhaseListItem({ phase, isActive = false, duration, onClick }) {
  return (
    <div
      className={`phase-list-item ${isActive ? "phase-list-item-active" : ""} ${onClick ? "phase-list-item-clickable" : ""}`}
      onClick={onClick}
    >
      <div className="phase-list-item-content">
        <span className="phase-list-item-name">{phase}</span>
        {duration && (
          <span className="phase-list-item-duration">{duration}</span>
        )}
      </div>
    </div>
  );
}
