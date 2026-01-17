import React from "react";
import PrimaryButton from "./PrimaryButton";
import "./ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  variant = "danger",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <PrimaryButton
            variant="white"
            onClick={onClose}
            disabled={isLoading}
            className="confirm-modal-cancel"
          >
            {cancelText}
          </PrimaryButton>
          <PrimaryButton
            variant={variant === "danger" ? "danger" : "blue"}
            onClick={onConfirm}
            disabled={isLoading}
            className="confirm-modal-confirm"
          >
            {isLoading ? "Suppression..." : confirmText}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
