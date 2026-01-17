import React, { useState } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "../../firebase";
import { attribuerRole } from "../../lib/gameUtils";
import { useFirebaseValue } from "../../lib/firebaseHooks";
import PageShell from "../ui/PageShell";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import "./JoinSession.css";

export default function JoinSession({ onJoin }) {
  const [sessionCode, setSessionCode] = useState("");
  const [prenom, setPrenom] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const { value: session } = useFirebaseValue(
    sessionCode ? `sessions/${sessionCode}` : null
  );

  const handleJoin = async () => {
    setError("");
    if (!sessionCode.trim() || !prenom.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setJoining(true);
    try {
      // Vérifier que la session existe
      const sessionRef = ref(database, `sessions/${sessionCode}`);
      const sessionSnap = await get(sessionRef);
      if (!sessionSnap.exists()) {
        setError("Code de session invalide");
        setJoining(false);
        return;
      }

      const sessionData = sessionSnap.val();
      if (sessionData.statut !== "ATTENTE" && sessionData.statut !== "EN_COURS") {
        setError("Cette session n'est pas accessible");
        setJoining(false);
        return;
      }

      // Vérifier le nombre de participants
      const participantsRef = ref(database, `participants/${sessionCode}`);
      const participantsSnap = await get(participantsRef);
      const participants = participantsSnap.val() || {};
      const currentCount = Object.keys(participants).length;

      if (currentCount >= (sessionData.parametres?.maxParticipants || 999)) {
        setError("La session est complète");
        setJoining(false);
        return;
      }

      // Attribuer un rôle
      const roleId = await attribuerRole(sessionCode, sessionData.parametres?.rolesAttribues);

      // Créer le participant
      const participantId = `p${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await set(ref(database, `participants/${sessionCode}/${participantId}`), {
        prenom: prenom.trim(),
        roleId: roleId,
        joinedAt: Date.now(),
      });

      // Mettre à jour le statut de la session si nécessaire
      if (sessionData.statut === "ATTENTE") {
        await set(ref(database, `sessions/${sessionCode}/statut`), "EN_COURS");
      }

      onJoin({ sessionCode, participantId, roleId, prenom: prenom.trim() });
    } catch (e) {
      setError(e?.message || "Erreur lors de la connexion");
    } finally {
      setJoining(false);
    }
  };

  return (
    <PageShell>
      <div className="join-session-container">
        <Card className="join-session-card">
          <h2 className="join-session-title">🎮 Rejoindre une session</h2>

          <div className="join-session-form">
            <div className="join-session-field">
              <label className="join-session-label">Code de session</label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={10}
                className="join-session-input join-session-input-code"
              />
            </div>

            <div className="join-session-field">
              <label className="join-session-label">Votre prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Jean"
                className="join-session-input"
              />
            </div>

            {error && (
              <div className="join-session-error">
                {error}
              </div>
            )}

            <PrimaryButton
              variant="green"
              size="lg"
              onClick={handleJoin}
              disabled={joining || !sessionCode.trim() || !prenom.trim()}
              className="join-session-button"
            >
              {joining ? "Connexion..." : "Rejoindre"}
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
