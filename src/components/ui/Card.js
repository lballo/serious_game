import React from "react";
import "./Card.css";

export default function Card({ children, className = "", variant = "default", onClick }) {
  const cardClass = `card card-${variant} ${className} ${onClick ? "card-clickable" : ""}`;
  
  return (
    <div className={cardClass} onClick={onClick}>
      {children}
    </div>
  );
}
