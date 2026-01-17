import React from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";
import Pill from "../ui/Pill";
import "./ScenarioCard.css";

export default function ScenarioCard({ scenario, scenarioId, onDelete, onEdit }) {
  const rolesCount = Object.keys(scenario.roles || {}).length;
  const phasesCount = Object.keys(scenario.phases || {}).length;
  const eventsCount = Object.keys(scenario.evenements || {}).length;

  return (
    <div className="scenario-card">
      <div className="scenario-card-content">
        <div className="scenario-card-main">
          <h3 className="scenario-card-title">{scenario.titre || "Sans titre"}</h3>
          <p className="scenario-card-description">
            {scenario.description || "—"}
          </p>
          <div className="scenario-card-stats">
            <Pill icon="👥">{rolesCount} rôles</Pill>
            <Pill icon="📊">{phasesCount} phases</Pill>
            <Pill icon="🎲">{eventsCount} événements</Pill>
          </div>
        </div>
        <div className="scenario-card-actions">
          <Link to={`/admin/scenario/${scenarioId}`}>
            <PrimaryButton variant="green" size="sm" icon="✏️">
              Modifier
            </PrimaryButton>
          </Link>
          <PrimaryButton
            variant="danger"
            size="sm"
            icon="🗑️"
            onClick={() => onDelete(scenarioId, scenario.titre)}
          >
            Supprimer
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
