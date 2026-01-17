import React from "react";
import "./EventCard.css";

export default function EventCard({ title, subtitle, isSelected = false, onClick }) {
  return (
    <div
      className={`event-card ${isSelected ? "event-card-selected" : ""} ${onClick ? "event-card-clickable" : ""}`}
      onClick={onClick}
    >
      <div className="event-card-content">
        {isSelected && <span className="event-card-check">✓</span>}
        <div className="event-card-text">
          <div className="event-card-title">{title}</div>
          {subtitle && <div className="event-card-subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}
