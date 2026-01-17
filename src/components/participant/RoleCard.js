import React, { useState, useEffect } from "react";
import { useFirebaseValue } from "../../lib/firebaseHooks";
import "./RoleCard.css";

export default function RoleCard({ sessionCode, roleId }) {
  const { value: session } = useFirebaseValue(
    sessionCode ? `sessions/${sessionCode}` : null
  );
  const { value: scenarioData } = useFirebaseValue(
    session?.scenarioId ? `scenarios/${session.scenarioId}` : null
  );

  const role = scenarioData?.roles?.[roleId] || {};
  const missions = role.missions || [];
  const missionsCount = missions.length;

  // Gestion locale de la checklist des missions
  const participantId = `participant_${sessionCode}_${roleId}`;
  const storageKey = `missions_${sessionCode}_${participantId}`;
  const [checkedMissions, setCheckedMissions] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checkedMissions));
  }, [checkedMissions, storageKey]);

  const toggleMission = (index) => {
    setCheckedMissions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedMissions = Object.values(checkedMissions).filter(Boolean).length;
  const progressPercentage = missionsCount > 0 ? (completedMissions / missionsCount) * 100 : 0;

  if (!scenarioData || !roleId) {
    return <div className="role-card-loading">Chargement...</div>;
  }

  return (
    <div className="role-card">
      {/* Header centré avec icône et nom */}
      <div className="role-card-header">
        <div className="role-card-icon-wrapper">
          <span className="role-card-icon">{role.emoji || "👤"}</span>
        </div>
        <h1 className="role-card-title">{role.nom || roleId}</h1>
      </div>

      {/* Barre séparatrice orange */}
      <div className="role-card-divider"></div>

      {/* Contenu principal */}
      <div className="role-card-content">
        {/* Section Psychologie */}
        {role.psychologie && (
          <div className="role-card-psychology-section">
            <div className="role-card-section-header">
              <span className="role-card-section-icon">🧠</span>
              <h2 className="role-card-section-title">Votre psychologie</h2>
            </div>
            <p className="role-card-psychology-text">{role.psychologie}</p>
          </div>
        )}

        {/* Section Frustration */}
        {role.frustration && (
          <div className="role-card-psychology-section">
            <div className="role-card-section-header">
              <span className="role-card-section-icon">😠</span>
              <h2 className="role-card-section-title">Votre frustration actuelle</h2>
            </div>
            <p className="role-card-psychology-text">{role.frustration}</p>
          </div>
        )}

        {/* Citation */}
        {role.phraseType && (
          <div className="role-card-quote-box">
            <span className="role-card-quote-icon">💬</span>
            <span className="role-card-quote-text">"{role.phraseType}"</span>
          </div>
        )}

        {/* Section Attention */}
        {role.attention && (
          <div className="role-card-attention-box">
            <span className="role-card-attention-icon">⚠️</span>
            <p className="role-card-attention-text">{role.attention}</p>
          </div>
        )}

        {/* Section Missions secrètes */}
        {missionsCount > 0 && (
          <div className="role-card-missions-section">
            <div className="role-card-section-header">
              <span className="role-card-section-icon">🎯</span>
              <h2 className="role-card-section-title">Vos missions secrètes</h2>
            </div>
            <p className="role-card-missions-description">
              Accomplissez ces missions pour réussir votre rôle. Cochez-les au fur et à mesure.
            </p>

            <div className="role-card-missions-list">
              {missions.map((mission, index) => (
                <div
                  key={index}
                  className={`role-card-mission-item ${checkedMissions[index] ? "role-card-mission-item-checked" : ""}`}
                >
                  <div className="role-card-mission-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={checkedMissions[index] || false}
                      onChange={() => toggleMission(index)}
                      className="role-card-mission-checkbox"
                    />
                    {checkedMissions[index] && (
                      <span className="role-card-mission-checkmark">✓</span>
                    )}
                  </div>
                  <span className="role-card-mission-text">{mission}</span>
                </div>
              ))}
            </div>

            {/* Barre de progression */}
            <div className="role-card-progress">
              <div className="role-card-progress-text">
                Missions accomplies : {completedMissions}/{missionsCount}
              </div>
              <div className="role-card-progress-bar">
                <div
                  className="role-card-progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
