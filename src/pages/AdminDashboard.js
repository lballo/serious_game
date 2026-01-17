import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ref, set, remove } from "firebase/database";
import { database } from "../firebase";
import { useFirebaseValue } from "../lib/firebaseHooks";
import PageShell from "../components/ui/PageShell";
import TopHeader from "../components/ui/TopHeader";
import Card from "../components/ui/Card";
import PrimaryButton from "../components/ui/PrimaryButton";
import ConfirmModal from "../components/ui/ConfirmModal";
import Toast from "../components/ui/Toast";
import ScenarioCard from "../components/admin/ScenarioCard";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { value: scenarios, loading } = useFirebaseValue("scenarios");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, scenarioId: null, scenarioTitle: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });

  const handleCreateNew = async () => {
    const newId = `scenario_${Date.now()}`;
    await set(ref(database, `scenarios/${newId}`), {
      titre: "Nouveau scénario",
      description: "",
      contexte: "",
      roles: {},
      phases: {},
      evenements: {},
      creeLe: Date.now(),
    });
    window.location.href = `/admin/scenario/${newId}`;
  };

  const handleDeleteClick = (scenarioId, scenarioTitle) => {
    setDeleteModal({
      isOpen: true,
      scenarioId,
      scenarioTitle: scenarioTitle || "ce scénario",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.scenarioId) return;

    setIsDeleting(true);
    try {
      // Supprimer le scénario (tous les sous-nœuds sont supprimés automatiquement avec le parent)
      await remove(ref(database, `scenarios/${deleteModal.scenarioId}`));
      
      setToast({
        isOpen: true,
        message: "Scénario supprimé avec succès",
        type: "success",
      });
      
      setDeleteModal({ isOpen: false, scenarioId: null, scenarioTitle: "" });
    } catch (error) {
      setToast({
        isOpen: true,
        message: `Erreur lors de la suppression: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, scenarioId: null, scenarioTitle: "" });
  };

  const handleCloseToast = () => {
    setToast({ isOpen: false, message: "", type: "success" });
  };

  if (loading) {
    return (
      <PageShell>
        <Card>
          <p>Chargement...</p>
        </Card>
      </PageShell>
    );
  }

  const scenariosList = scenarios ? Object.entries(scenarios) : [];
  const hasScenarios = scenariosList.length > 0;

  return (
    <PageShell>
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <Link to="/" className="admin-dashboard-back-link">
            ← Retour accueil
          </Link>
        </div>

        {/* Carte Dashboard Administrateur */}
        <Card className="admin-dashboard-header-card">
          <div className="admin-dashboard-header-content">
            <div className="admin-dashboard-header-text">
              <div className="admin-dashboard-header-icon">📋</div>
              <div>
                <h1 className="admin-dashboard-title">Dashboard Administrateur</h1>
                <p className="admin-dashboard-subtitle">
                  Gérez vos scénarios et sessions de formation
                </p>
              </div>
            </div>
            <PrimaryButton
              variant="green"
              size="lg"
              icon="➕"
              onClick={handleCreateNew}
              className="admin-dashboard-create-button"
            >
              Créer un nouveau scénario
            </PrimaryButton>
          </div>
        </Card>

        {/* Carte Scénarios existants */}
        <Card className="admin-dashboard-scenarios-card">
          <div className="admin-dashboard-scenarios-header">
            <span className="admin-dashboard-scenarios-icon">📚</span>
            <h2 className="admin-dashboard-scenarios-title">Scénarios existants</h2>
          </div>

          {!hasScenarios ? (
            <div className="admin-dashboard-empty">
              <p className="admin-dashboard-empty-text">Aucun scénario créé pour le moment</p>
              <PrimaryButton
                variant="green"
                size="md"
                icon="➕"
                onClick={handleCreateNew}
              >
                Créer un nouveau scénario
              </PrimaryButton>
            </div>
          ) : (
            <div className="admin-dashboard-scenarios-list">
              {scenariosList.map(([id, scenario]) => (
                <ScenarioCard
                  key={id}
                  scenario={scenario}
                  scenarioId={id}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Modale de confirmation */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Supprimer ce scénario ?"
          message={`Cette action est définitive et supprimera rôles, phases et événements associés au scénario "${deleteModal.scenarioTitle}".`}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
          isLoading={isDeleting}
        />

        {/* Toast de notification */}
        {toast.isOpen && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </div>
    </PageShell>
  );
}
