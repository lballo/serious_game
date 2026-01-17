import React, { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import "./PhaseEditor.css";

export default function PhaseEditor({ phase, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: phase?.id || "",
    nom: phase?.nom || "",
    dureeMinutes: phase?.dureeMinutes || 10,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.nom) {
      alert("L'ID et le nom sont requis");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="phase-editor-form">
      <div className="phase-editor-fields">
        <div className="phase-editor-field">
          <label className="phase-editor-label">ID de la phase *</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="phase1"
            required
            disabled={!!phase}
            className="phase-editor-input"
          />
        </div>

        <div className="phase-editor-field">
          <label className="phase-editor-label">Nom de la phase *</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Phase 1 : Introduction"
            required
            className="phase-editor-input"
          />
        </div>

        <div className="phase-editor-field">
          <label className="phase-editor-label">Durée (minutes) *</label>
          <input
            type="number"
            min="1"
            value={formData.dureeMinutes}
            onChange={(e) => setFormData({ ...formData, dureeMinutes: Number(e.target.value) || 1 })}
            required
            className="phase-editor-input"
          />
        </div>
      </div>

      <div className="phase-editor-actions">
        <PrimaryButton
          type="submit"
          variant="green"
          size="md"
        >
          {phase ? "Modifier" : "Créer"}
        </PrimaryButton>
        {onCancel && (
          <PrimaryButton
            type="button"
            variant="white"
            size="md"
            onClick={onCancel}
          >
            Annuler
          </PrimaryButton>
        )}
      </div>
    </form>
  );
}
