import React, { useState } from "react";
import { ref, set, get } from "firebase/database";
import { Link, useParams, useNavigate } from "react-router-dom";
import { database } from "../firebase";
import { useFirebaseValue } from "../lib/firebaseHooks";
import PageShell from "../components/ui/PageShell";
import PrimaryButton from "../components/ui/PrimaryButton";
import SectionCard from "../components/ui/SectionCard";
import ItemCard from "../components/ui/ItemCard";
import EmptyState from "../components/ui/EmptyState";
import RoleEditor from "../components/admin/RoleEditor";
import PhaseEditor from "../components/admin/PhaseEditor";
import EventEditor from "../components/admin/EventEditor";
import "./ScenarioEditor.css";

export default function ScenarioEditor() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { value: scenario, loading } = useFirebaseValue(
    scenarioId ? `scenarios/${scenarioId}` : null
  );

  const [editingRole, setEditingRole] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    contexte: "",
  });

  React.useEffect(() => {
    if (scenario) {
      setFormData({
        titre: scenario.titre || "",
        description: scenario.description || "",
        contexte: scenario.contexte || "",
      });
    }
  }, [scenario]);

  const handleSaveScenario = async () => {
    if (!formData.titre.trim()) {
      alert("Le titre est requis");
      return;
    }

    const scenarioData = {
      ...formData,
      roles: scenario?.roles || {},
      phases: scenario?.phases || {},
      evenements: scenario?.evenements || {},
      modifieLe: Date.now(),
    };

    if (scenarioId) {
      await set(ref(database, `scenarios/${scenarioId}`), scenarioData);
      alert("Scénario modifié avec succès");
    } else {
      const newId = `scenario_${Date.now()}`;
      await set(ref(database, `scenarios/${newId}`), {
        ...scenarioData,
        creeLe: Date.now(),
      });
      navigate(`/admin/scenario/${newId}`);
    }
  };

  const handleSaveRole = async (roleData) => {
    const roles = { ...(scenario?.roles || {}) };
    roles[roleData.id] = {
      nom: roleData.nom,
      psychologie: roleData.psychologie,
      phraseType: roleData.phraseType,
      frustration: roleData.frustration || "",
      attention: roleData.attention || "",
      missions: roleData.missions,
      quantite: roleData.quantite,
      emoji: roleData.emoji,
    };

    await set(ref(database, `scenarios/${scenarioId}/roles`), roles);
    setEditingRole(null);
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm(`Supprimer le rôle "${scenario.roles[roleId]?.nom}" ?`)) return;
    const roles = { ...(scenario?.roles || {}) };
    delete roles[roleId];
    await set(ref(database, `scenarios/${scenarioId}/roles`), roles);
  };

  const handleSavePhase = async (phaseData) => {
    const phases = { ...(scenario?.phases || {}) };
    phases[phaseData.id] = {
      nom: phaseData.nom,
      dureeMinutes: phaseData.dureeMinutes,
    };

    await set(ref(database, `scenarios/${scenarioId}/phases`), phases);
    setEditingPhase(null);
  };

  const handleDeletePhase = async (phaseId) => {
    if (!window.confirm(`Supprimer la phase "${scenario.phases[phaseId]?.nom}" ?`)) return;
    const phases = { ...(scenario?.phases || {}) };
    delete phases[phaseId];
    await set(ref(database, `scenarios/${scenarioId}/phases`), phases);
  };

  const handleSaveEvent = async (eventData) => {
    const evenements = { ...(scenario?.evenements || {}) };
    evenements[eventData.id] = {
      titre: eventData.titre,
      texte: eventData.texte,
      impacts: eventData.impacts || [],
    };

    await set(ref(database, `scenarios/${scenarioId}/evenements`), evenements);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm(`Supprimer l'événement "${scenario.evenements[eventId]?.titre}" ?`)) return;
    const evenements = { ...(scenario?.evenements || {}) };
    delete evenements[eventId];
    await set(ref(database, `scenarios/${scenarioId}/evenements`), evenements);
  };

  if (scenarioId && loading) {
    return (
      <PageShell>
        <div className="scenario-editor-loading">Chargement...</div>
      </PageShell>
    );
  }

  const roles = scenario?.roles || {};
  const phases = scenario?.phases || {};
  const evenements = scenario?.evenements || {};

  return (
    <PageShell>
      <div className="scenario-editor-container">
        <Link to="/admin" className="scenario-editor-back-button">
          ← Retour au dashboard
        </Link>

        <h1 className="scenario-editor-title">
          ✏️ {scenarioId ? "Modifier un scénario" : "Créer un scénario"}
        </h1>

        {/* Informations générales */}
        <SectionCard
          title="Informations générales"
          icon="📋"
        >
          <div className="scenario-editor-form">
            <div className="scenario-editor-field">
              <label className="scenario-editor-label">
                Titre *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Scénario de gestion du changement"
                className="scenario-editor-input"
              />
            </div>
            <div className="scenario-editor-field">
              <label className="scenario-editor-label">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description courte"
                className="scenario-editor-input"
              />
            </div>
            <div className="scenario-editor-field">
              <label className="scenario-editor-label">
                Contexte / Briefing
              </label>
              <textarea
                value={formData.contexte}
                onChange={(e) => setFormData({ ...formData, contexte: e.target.value })}
                placeholder="Contexte du scénario qui sera visible par tous les participants..."
                rows={6}
                className="scenario-editor-textarea"
              />
            </div>
            <PrimaryButton
              variant="green"
              size="lg"
              icon="💾"
              onClick={handleSaveScenario}
              className="scenario-editor-save-button"
            >
              Enregistrer les informations générales
            </PrimaryButton>
          </div>
        </SectionCard>

        {scenarioId && (
          <>
            {/* Rôles */}
            <SectionCard
              title="Rôles"
              icon="🎭"
              actionButton={
                !editingRole && (
                  <PrimaryButton
                    variant="blue"
                    size="md"
                    onClick={() => setEditingRole({})}
                  >
                    + Ajouter un rôle
                  </PrimaryButton>
                )
              }
            >
              {editingRole && (
                <div className="scenario-editor-editor-wrapper">
                  <RoleEditor
                    role={editingRole.id ? editingRole : null}
                    onSave={handleSaveRole}
                    onCancel={() => setEditingRole(null)}
                  />
                </div>
              )}

              {Object.keys(roles).length === 0 && !editingRole ? (
                <EmptyState
                  message="Aucun rôle créé pour le moment"
                  actionLabel="+ Ajouter un rôle"
                  onAction={() => setEditingRole({})}
                  icon="🎭"
                />
              ) : (
                !editingRole && (
                  <div className="scenario-editor-items-list">
                    {Object.entries(roles).map(([roleId, role]) => (
                      <ItemCard
                        key={roleId}
                        title={role.nom}
                        description={role.psychologie}
                        icon={role.emoji || "👤"}
                        pills={[
                          { icon: "🎯", text: `${role.missions?.length || 0} missions` },
                          { icon: "👥", text: `Quantité: ${role.quantite || 0}` },
                        ]}
                        onEdit={() => setEditingRole({ id: roleId, ...role })}
                        onDelete={() => handleDeleteRole(roleId)}
                      />
                    ))}
                  </div>
                )
              )}
            </SectionCard>

            {/* Phases */}
            <SectionCard
              title="Phases"
              icon="⏱️"
              actionButton={
                !editingPhase && (
                  <PrimaryButton
                    variant="blue"
                    size="md"
                    onClick={() => setEditingPhase({})}
                  >
                    + Ajouter une phase
                  </PrimaryButton>
                )
              }
            >
              {editingPhase && (
                <div className="scenario-editor-editor-wrapper">
                  <PhaseEditor
                    phase={editingPhase.id ? editingPhase : null}
                    onSave={handleSavePhase}
                    onCancel={() => setEditingPhase(null)}
                  />
                </div>
              )}

              {Object.keys(phases).length === 0 && !editingPhase ? (
                <EmptyState
                  message="Aucune phase créée pour le moment"
                  actionLabel="+ Ajouter une phase"
                  onAction={() => setEditingPhase({})}
                  icon="⏱️"
                />
              ) : (
                !editingPhase && (
                  <div className="scenario-editor-items-list">
                    {Object.entries(phases).map(([phaseId, phase]) => (
                      <ItemCard
                        key={phaseId}
                        title={phase.nom}
                        description={phase.description || ""}
                        pills={[
                          { icon: "⏱️", text: `Durée: ${phase.dureeMinutes} min` },
                        ]}
                        onEdit={() => setEditingPhase({ id: phaseId, ...phase })}
                        onDelete={() => handleDeletePhase(phaseId)}
                      />
                    ))}
                  </div>
                )
              )}
            </SectionCard>

            {/* Événements */}
            <SectionCard
              title="Événements"
              icon="📢"
              actionButton={
                !editingEvent && (
                  <PrimaryButton
                    variant="blue"
                    size="md"
                    onClick={() => setEditingEvent({})}
                  >
                    + Ajouter un événement
                  </PrimaryButton>
                )
              }
            >
              {editingEvent && (
                <div className="scenario-editor-editor-wrapper">
                  <EventEditor
                    event={editingEvent.id ? editingEvent : null}
                    onSave={handleSaveEvent}
                    onCancel={() => setEditingEvent(null)}
                  />
                </div>
              )}

              {Object.keys(evenements).length === 0 && !editingEvent ? (
                <EmptyState
                  message="Aucun événement créé pour le moment"
                  actionLabel="+ Ajouter un événement"
                  onAction={() => setEditingEvent({})}
                  icon="📢"
                />
              ) : (
                !editingEvent && (
                  <div className="scenario-editor-items-list">
                    {Object.entries(evenements).map(([eventId, event]) => (
                      <ItemCard
                        key={eventId}
                        title={event.titre}
                        description={event.texte}
                        pills={[
                          { icon: "💚", text: `Confiance: 0` },
                          { icon: "📈", text: `Avancement: +15` },
                          { icon: "⚠️", text: `▲ Résistance: -10` },
                        ]}
                        onEdit={() => setEditingEvent({ id: eventId, ...event })}
                        onDelete={() => handleDeleteEvent(eventId)}
                      />
                    ))}
                  </div>
                )
              )}
            </SectionCard>
          </>
        )}
      </div>
    </PageShell>
  );
}
