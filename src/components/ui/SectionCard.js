import React from "react";
import "./SectionCard.css";

export default function SectionCard({ title, icon, children, actionButton, className = "" }) {
  return (
    <div className={`section-card ${className}`}>
      <div className="section-card-header">
        <div className="section-card-title-wrapper">
          {icon && <span className="section-card-icon">{icon}</span>}
          <h2 className="section-card-title">{title}</h2>
        </div>
        {actionButton && (
          <div className="section-card-action">
            {actionButton}
          </div>
        )}
      </div>
      <div className="section-card-divider"></div>
      <div className="section-card-content">
        {children}
      </div>
    </div>
  );
}
