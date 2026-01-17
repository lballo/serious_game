import React, { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import "./RoleEditor.css";

export default function RoleEditor({ role, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: role?.id || "",
    nom: role?.nom || "",
    psychologie: role?.psychologie || "",
    phraseType: role?.phraseType || "",
    frustration: role?.frustration || "",
    attention: role?.attention || "",
    missions: role?.missions || [],
    quantite: role?.quantite || 0,
    emoji: role?.emoji || "👤",
  });

  const [newMission, setNewMission] = useState("");

  const handleAddMission = () => {
    if (newMission.trim()) {
      setFormData({
        ...formData,
        missions: [...formData.missions, newMission.trim()],
      });
      setNewMission("");
    }
  };

  const handleRemoveMission = (index) => {
    setFormData({
      ...formData,
      missions: formData.missions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.nom) {
      alert("L'ID et le nom sont requis");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="role-editor-form">
      <div className="role-editor-fields">
        <div className="role-editor-field">
          <label className="role-editor-label">Emoji</label>
          <input
            type="text"
            value={formData.emoji}
            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
            placeholder="👤"
            className="role-editor-input"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">ID du rôle *</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="avocat"
            required
            disabled={!!role}
            className="role-editor-input"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Nom du rôle *</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            placeholder="Avocat"
            required
            className="role-editor-input"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Psychologie</label>
          <textarea
            value={formData.psychologie}
            onChange={(e) => setFormData({ ...formData, psychologie: e.target.value })}
            placeholder="Description de la psychologie du personnage..."
            rows={4}
            className="role-editor-textarea"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Phrase type</label>
          <input
            type="text"
            value={formData.phraseType}
            onChange={(e) => setFormData({ ...formData, phraseType: e.target.value })}
            placeholder="Ex: 'Je dois défendre mon client coûte que coûte'"
            className="role-editor-input"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Votre frustration actuelle</label>
          <textarea
            value={formData.frustration}
            onChange={(e) => setFormData({ ...formData, frustration: e.target.value })}
            placeholder="Description de la frustration actuelle du personnage..."
            rows={4}
            className="role-editor-textarea"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Attention</label>
          <textarea
            value={formData.attention}
            onChange={(e) => setFormData({ ...formData, attention: e.target.value })}
            placeholder="Message d'attention ou d'avertissement pour ce rôle..."
            rows={3}
            className="role-editor-textarea"
          />
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Missions</label>
          <div className="role-editor-mission-input">
            <input
              type="text"
              value={newMission}
              onChange={(e) => setNewMission(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMission())}
              placeholder="Nouvelle mission..."
              className="role-editor-input"
            />
            <PrimaryButton
              type="button"
              variant="blue"
              size="sm"
              onClick={handleAddMission}
            >
              Ajouter
            </PrimaryButton>
          </div>
          <div className="role-editor-missions-list">
            {formData.missions.map((mission, index) => (
              <div key={index} className="role-editor-mission-item">
                <span className="role-editor-mission-text">{mission}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMission(index)}
                  className="role-editor-mission-remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="role-editor-field">
          <label className="role-editor-label">Quantité par défaut</label>
          <input
            type="number"
            min="0"
            value={formData.quantite}
            onChange={(e) => setFormData({ ...formData, quantite: Number(e.target.value) || 0 })}
            className="role-editor-input"
          />
        </div>
      </div>

      <div className="role-editor-actions">
        <PrimaryButton
          type="submit"
          variant="green"
          size="md"
        >
          {role ? "Modifier" : "Créer"}
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
