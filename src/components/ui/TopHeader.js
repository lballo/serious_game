import React from "react";
import "./TopHeader.css";

export default function TopHeader({ title, subtitle, icon, className = "" }) {
  return (
    <div className={`top-header ${className}`}>
      {icon && <span className="top-header-icon">{icon}</span>}
      <div className="top-header-content">
        <h1 className="top-header-title">{title}</h1>
        {subtitle && <p className="top-header-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
