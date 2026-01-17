import React, { useState, useEffect } from "react";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import "./MissionChecklist.css";

export default function MissionChecklist({ missions, participantId, sessionCode }) {
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

  if (!missions || missions.length === 0) {
    return (
      <Card className="mission-checklist-card">
        <SectionTitle icon="✅">Missions</SectionTitle>
        <p className="mission-checklist-empty">Aucune mission définie pour ce rôle</p>
      </Card>
    );
  }

  return (
    <Card className="mission-checklist-card">
      <SectionTitle icon="✅">Missions à accomplir</SectionTitle>
      <div className="mission-checklist-list">
        {missions.map((mission, index) => (
          <label
            key={index}
            className={`mission-checklist-item ${checkedMissions[index] ? "mission-checklist-item-checked" : ""}`}
          >
            <input
              type="checkbox"
              checked={checkedMissions[index] || false}
              onChange={() => toggleMission(index)}
              className="mission-checklist-checkbox"
            />
            <span className="mission-checklist-text">{mission}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}
