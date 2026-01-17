import React, { useState, useEffect } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import "./EventEditor.css";

export default function EventEditor({ event, onSave, onCancel }) {
  // Initialiser impactsTextarea avec les impacts existants (array -> string avec \n)
  const impactsArray = event?.impacts || [];
  const impactsText = Array.isArray(impactsArray) ? impactsArray.join('\n') : '';

  const [formData, setFormData] = useState({
    id: event?.id || "",
    titre: event?.titre || "",
    texte: event?.texte || "",
    impactsText: impactsText,
  });

  // Mettre à jour le formulaire quand l'event change
  useEffect(() => {
    const impactsArray = event?.impacts || [];
    const impactsText = Array.isArray(impactsArray) ? impactsArray.join('\n') : '';
    setFormData({
      id: event?.id || "",
      titre: event?.titre || "",
      texte: event?.texte || "",
      impactsText: impactsText,
    });
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.titre) {
      alert("L'ID et le titre sont requis");
      return;
    }
    
    // Convertir textarea impactsText -> array impacts
    const impacts = formData.impactsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    onSave({
      ...formData,
      impacts: impacts,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="event-editor-form">
      <div className="event-editor-fields">
        <div className="event-editor-field">
          <label className="event-editor-label">ID de l'événement *</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="event1"
            required
            disabled={!!event}
            className="event-editor-input"
          />
        </div>

        <div className="event-editor-field">
          <label className="event-editor-label">Titre de l'événement *</label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
            placeholder="Nouvelle information révélée"
            required
            className="event-editor-input"
          />
        </div>

        <div className="event-editor-field">
          <label className="event-editor-label">Texte à afficher *</label>
          <textarea
            value={formData.texte}
            onChange={(e) => setFormData({ ...formData, texte: e.target.value })}
            placeholder="Texte qui sera projeté à l'écran central..."
            rows={6}
            required
            className="event-editor-textarea"
          />
        </div>

        <div className="event-editor-field">
          <label className="event-editor-label">Impacts concrets terrain</label>
          <textarea
            value={formData.impactsText}
            onChange={(e) => setFormData({ ...formData, impactsText: e.target.value })}
            placeholder={`Une ligne = un impact
Ex: Montée du stress opérationnel
Travail en urgence
Risque d'erreurs
Tensions avec les bénéficiaires et familles`}
            rows={6}
            className="event-editor-textarea"
          />
          <p className="event-editor-helper">
            Chaque ligne correspond à un impact. Laissez vide si aucun impact.
          </p>
        </div>
      </div>

      <div className="event-editor-actions">
        <PrimaryButton
          type="submit"
          variant="green"
          size="md"
        >
          {event ? "Modifier" : "Créer"}
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
