import React from "react";
import "./ItemCard.css";

export default function ItemCard({ 
  title, 
  description, 
  icon, 
  pills = [], 
  onEdit, 
  onDelete,
  className = "" 
}) {
  return (
    <div className={`item-card ${className}`}>
      <div className="item-card-main">
        <div className="item-card-header">
          {icon && <span className="item-card-icon">{icon}</span>}
          <div className="item-card-text">
            <h3 className="item-card-title">{title}</h3>
            {description && (
              <p className="item-card-description">{description}</p>
            )}
          </div>
        </div>
        {pills.length > 0 && (
          <div className="item-card-pills">
            {pills.map((pill, index) => (
              <span key={index} className="item-card-pill">
                {pill.icon && <span className="item-card-pill-icon">{pill.icon}</span>}
                <span className="item-card-pill-text">{pill.text}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="item-card-actions">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="item-card-button item-card-button-edit"
          >
            <span className="item-card-button-icon">✏️</span>
            <span>Modifier</span>
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="item-card-button item-card-button-delete"
          >
            <span className="item-card-button-icon">🗑️</span>
          </button>
        )}
      </div>
    </div>
  );
}
