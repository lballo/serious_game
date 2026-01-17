import React from "react";
import "./Pill.css";

export default function Pill({ children, icon, className = "" }) {
  return (
    <span className={`pill ${className}`}>
      {icon && <span className="pill-icon">{icon}</span>}
      <span className="pill-text">{children}</span>
    </span>
  );
}
