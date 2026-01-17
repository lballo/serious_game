import React from "react";
import "./SectionTitle.css";

export default function SectionTitle({ children, icon, className = "" }) {
  return (
    <h2 className={`section-title ${className}`}>
      {icon && <span className="section-title-icon">{icon}</span>}
      <span className="section-title-text">{children}</span>
    </h2>
  );
}
