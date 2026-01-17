import React from "react";
import PrimaryButton from "./PrimaryButton";
import "./EmptyState.css";

export default function EmptyState({ message, actionLabel, onAction, icon }) {
  return (
    <div className="empty-state">
      {icon && <span className="empty-state-icon">{icon}</span>}
      <p className="empty-state-message">{message}</p>
      {onAction && actionLabel && (
        <PrimaryButton variant="blue" size="md" onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
}
