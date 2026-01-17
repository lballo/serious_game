import React, { useState } from "react";
import { useFirebaseValue } from "../lib/firebaseHooks";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import PrimaryButton from "../components/ui/PrimaryButton";
import JoinSession from "../components/participant/JoinSession";
import RoleCard from "../components/participant/RoleCard";
import "./ParticipantPanel.css";

export default function ParticipantPanel() {
  const [participantData, setParticipantData] = useState(() => {
    const saved = localStorage.getItem("participantData");
    return saved ? JSON.parse(saved) : null;
  });

  const { value: session } = useFirebaseValue(
    participantData?.sessionCode ? `sessions/${participantData.sessionCode}` : null
  );
  const { value: scenario } = useFirebaseValue(
    session?.scenarioId ? `scenarios/${session.scenarioId}` : null
  );

  const handleJoin = (data) => {
    setParticipantData(data);
    localStorage.setItem("participantData", JSON.stringify(data));
  };

  const handleLeave = () => {
    setParticipantData(null);
    localStorage.removeItem("participantData");
  };

  if (!participantData) {
    return <JoinSession onJoin={handleJoin} />;
  }

  return (
    <PageShell>
      <div className="participant-container">
        <div className="participant-header-actions">
          <PrimaryButton
            variant="white"
            size="sm"
            onClick={handleLeave}
          >
            Quitter la session
          </PrimaryButton>
        </div>

        <RoleCard sessionCode={participantData.sessionCode} roleId={participantData.roleId} />

        {scenario?.contexte && (
          <Card className="participant-context-card">
            <h3 className="participant-context-title">📋 Contexte du scénario</h3>
            <div className="participant-context-text">{scenario.contexte}</div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
