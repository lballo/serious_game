// src/pages/SessionCreator.js
import React, { useMemo, useState } from "react";
import { ref, set, get } from "firebase/database";
import { Link } from "react-router-dom";

import { database } from "../firebase";
import { useFirebaseValue } from "../lib/firebaseHooks";
import { generateSessionCode } from "../lib/gameUtils";
import PageShell from "../components/ui/PageShell";
import PrimaryButton from "../components/ui/PrimaryButton";
import Pill from "../components/ui/Pill";
import "./SessionCreator.css";

export default function SessionCreator() {
  const { value: scenarios, loading } = useFirebaseValue("scenarios");

  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  const selectedScenario = useMemo(() => {
    if (!scenarios || !selectedScenarioId) return null;
    return scenarios[selectedScenarioId] || null;
  }, [scenarios, selectedScenarioId]);

  const rolesDefaultConfig = useMemo(() => {
    // On prend les quantités définies dans le scénario
    if (!selectedScenario?.roles) return {};
    const cfg = {};
    Object.entries(selectedScenario.roles).forEach(([roleId, role]) => {
      cfg[roleId] = Number(role?.quantite ?? 0);
    });
    return cfg;
  }, [selectedScenario]);

  const [rolesConfig, setRolesConfig] = useState({});

  // Quand on change de scénario : on initialise rolesConfig
  React.useEffect(() => {
    if (!selectedScenarioId) {
      setRolesConfig({});
      return;
    }
    setRolesConfig(rolesDefaultConfig);
  }, [selectedScenarioId, rolesDefaultConfig]);

  const totalParticipants = useMemo(() => {
    return Object.values(rolesConfig).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }, [rolesConfig]);

  async function createSession() {
    setError("");
    setCreatedCode("");

    if (!selectedScenarioId) {
      setError("Choisis un scénario.");
      return;
    }

    if (totalParticipants <= 0) {
      setError("Le total de participants doit être > 0.");
      return;
    }

    setCreating(true);
    try {
      // 1) Générer un code (et vérifier qu'il n'existe pas déjà)
      let code = generateSessionCode();
      for (let i = 0; i < 5; i++) {
        const snap = await get(ref(database, `sessions/${code}`));
        if (!snap.exists()) break;
        code = generateSessionCode();
      }

      // 2) Créer la session
      const session = {
        scenarioId: selectedScenarioId,
        codeSession: code,
        statut: "ATTENTE",
        creeLe: Date.now(),
        phaseActuelle: {
          phaseId: Object.keys(selectedScenario.phases || {})[0] || null,
          phaseEndsAt: null,
          pausedAt: null,
          pausedTimeRemaining: null,
        },
        evenementActuel: null,
        parametres: {
          maxParticipants: totalParticipants,
          rolesAttribues: rolesConfig,
        },
      };

      await set(ref(database, `sessions/${code}`), session);

      // 3) Afficher le résultat
      setCreatedCode(code);
    } catch (e) {
      setError(e?.message || "Erreur inconnue pendant la création.");
    } finally {
      setCreating(false);
    }
  }

  // Calcul de la durée estimée (somme des durées des phases)
  const estimatedDuration = useMemo(() => {
    if (!selectedScenario?.phases) return null;
    const totalMinutes = Object.values(selectedScenario.phases).reduce(
      (sum, phase) => sum + (phase.dureeMinutes || 0),
      0
    );
    return totalMinutes;
  }, [selectedScenario]);

  if (loading) {
    return (
      <PageShell>
        <div className="session-creator-loading">
          <h2>Créer une session</h2>
          <p>Chargement des scénarios…</p>
        </div>
      </PageShell>
    );
  }

  const rolesCount = selectedScenario ? Object.keys(selectedScenario.roles || {}).length : 0;
  const phasesCount = selectedScenario ? Object.keys(selectedScenario.phases || {}).length : 0;
  const eventsCount = selectedScenario ? Object.keys(selectedScenario.evenements || {}).length : 0;

  return (
    <PageShell>
      <div className="session-creator-container">
        <Link to="/" className="session-creator-back-button">
          ← Retour accueil
        </Link>

        {/* Header Card */}
        <div className="session-creator-header-card">
          <div className="session-creator-header-icon">🎬</div>
          <div className="session-creator-header-content">
            <h1 className="session-creator-title">Créer une session</h1>
            <p className="session-creator-subtitle">Lancez une nouvelle session de formation</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="session-creator-main-card">
          {/* Scénario Selection */}
          <div className="session-creator-field">
            <label className="session-creator-label">
              Scénario *
            </label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="session-creator-select"
            >
              <option value="">— Choisir —</option>
              {scenarios &&
                Object.entries(scenarios).map(([id, sc]) => (
                  <option key={id} value={id}>
                    {sc?.titre || "Scénario sans titre"}
                  </option>
                ))}
            </select>
          </div>

          {/* Scenario Preview Card */}
          {selectedScenario && (
            <div className="session-creator-scenario-preview">
              <h3 className="session-creator-scenario-title">{selectedScenario.titre}</h3>
              <p className="session-creator-scenario-description">
                {selectedScenario.description || "—"}
              </p>
              <div className="session-creator-scenario-badges">
                <Pill icon="👥">{rolesCount} rôles</Pill>
                <Pill icon="📊">{phasesCount} phases</Pill>
                <Pill icon="🎲">{eventsCount} événements</Pill>
                {estimatedDuration && (
                  <Pill icon="⏱️">~{estimatedDuration} min</Pill>
                )}
              </div>
            </div>
          )}

          {/* Configuration des rôles */}
          {selectedScenario && (
            <>
              <div className="session-creator-divider"></div>
              
              <div className="session-creator-roles-section">
                <h2 className="session-creator-roles-title">
                  <span className="session-creator-roles-icon">🎭</span>
                  Configuration des rôles
                </h2>

                {!selectedScenario.roles ? (
                  <div className="session-creator-error">
                    Ce scénario n'a pas de rôles. Ajoute-en dans l'AdminDashboard.
                  </div>
                ) : (
                  <div className="session-creator-roles-list">
                    {Object.entries(selectedScenario.roles).map(([roleId, role]) => (
                      <div key={roleId} className="session-creator-role-item">
                        <div className="session-creator-role-icon-wrapper">
                          <span className="session-creator-role-icon">{role?.emoji || "👤"}</span>
                        </div>
                        <div className="session-creator-role-info">
                          <div className="session-creator-role-name">{role?.nom || roleId}</div>
                          <div className="session-creator-role-id">{roleId}</div>
                        </div>
                        <div className="session-creator-role-quantity">
                          <label className="session-creator-quantity-label">Quantité :</label>
                          <input
                            type="number"
                            min="0"
                            value={rolesConfig[roleId] ?? 0}
                            onChange={(e) =>
                              setRolesConfig((prev) => ({
                                ...prev,
                                [roleId]: Number(e.target.value || 0),
                              }))
                            }
                            className="session-creator-quantity-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Participants */}
                <div className="session-creator-total-bar">
                  <span className="session-creator-total-label">Total participants :</span>
                  <span className="session-creator-total-value">{totalParticipants}</span>
                </div>

                {/* Info Box */}
                <div className="session-creator-info-box">
                  <span className="session-creator-info-icon">💡</span>
                  <p className="session-creator-info-text">
                    Ajustez le nombre de participants pour chaque rôle selon la taille de votre groupe. Un minimum de 5 participants est recommandé.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="session-creator-error-message">
              {error}
            </div>
          )}

          {/* Create Button */}
          <PrimaryButton
            onClick={createSession}
            disabled={creating || !selectedScenarioId || totalParticipants <= 0}
            variant="purple"
            size="lg"
            icon="🎮"
            className="session-creator-submit-button"
          >
            {creating ? "Création en cours…" : "Créer la session"}
          </PrimaryButton>

          {/* Success Message */}
          {createdCode && (
            <div className="session-creator-success-card">
              <div className="session-creator-success-title">✅ Session créée</div>
              <div className="session-creator-success-code">
                Code : <span className="session-creator-code-value">{createdCode}</span>
              </div>
              <div className="session-creator-success-actions">
                <Link
                  to={`/animator/${createdCode}`}
                  className="session-creator-success-link session-creator-success-link-green"
                >
                  🎛️ Ouvrir panneau animateur
                </Link>
                <Link
                  to={`/screen/${createdCode}`}
                  className="session-creator-success-link session-creator-success-link-blue"
                >
                  📺 Ouvrir écran central
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
