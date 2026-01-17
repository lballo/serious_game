import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import PageShell from "../components/ui/PageShell";
import TopHeader from "../components/ui/TopHeader";
import Card from "../components/ui/Card";
import PrimaryButton from "../components/ui/PrimaryButton";
import "./Home.css";

export default function Home() {
  const [participantCode, setParticipantCode] = useState("ABC123");
  const [screenCode, setScreenCode] = useState("ABC123");
  const [animatorCode, setAnimatorCode] = useState("ABC123");
  const navigate = useNavigate();

  const handleJoinParticipant = () => {
    if (participantCode.trim()) {
      navigate("/play");
    }
  };

  const handleDisplayScreen = () => {
    if (screenCode.trim()) {
      navigate(`/screen/${screenCode.trim()}`);
    }
  };

  const handleJoinAnimator = async () => {
    const code = animatorCode.trim().toUpperCase();
    if (!code) return;

    try {
      // Vérifier si la session existe
      const sessionRef = ref(database, `sessions/${code}`);
      const snapshot = await get(sessionRef);

      // Si la session n'existe pas, créer un squelette minimal
      if (!snapshot.exists()) {
        const skeletonSession = {
          scenarioId: null,
          codeSession: code,
          statut: "ATTENTE",
          creeLe: Date.now(),
          phaseActuelle: {
            phaseId: null,
            phaseEndsAt: null,
            pausedAt: null,
            pausedTimeRemaining: null,
          },
          evenementActuel: null,
          parametres: {
            maxParticipants: 0,
            rolesAttribues: {},
          },
        };
        await set(sessionRef, skeletonSession);
      }

      // Naviguer vers le dashboard animateur
      navigate(`/animator/${code}`);
    } catch (error) {
      console.error("Erreur lors de l'accès au dashboard animateur:", error);
      alert("Erreur lors de l'accès au dashboard. Vérifiez le code de session.");
    }
  };

  return (
    <PageShell>
      <div className="home-container">
        <TopHeader
          icon="🎮"
          title="SERIOUS GAME"
          subtitle="Plateforme de simulation interactive"
        />

        <Card className="home-main-card">
          <h2 className="home-welcome-title">Bienvenue</h2>
          <p className="home-welcome-subtitle">
            Choisissez votre rôle pour cette session de formation
          </p>

          <div className="home-sections">
            {/* Section Administration */}
            <div className="home-section">
              <Link to="/admin" className="home-admin-button">
                <span className="home-admin-icon">👷</span>
                <span>Administration - Gérer les scénarios</span>
              </Link>
            </div>

            {/* Section Animateur */}
            <div className="home-section">
              <div className="home-animator-header">
                <span className="home-animator-icon">🎬</span>
                <span>Animateur - Créer une session</span>
              </div>
              <Link to="/session/create">
                <PrimaryButton variant="orange" size="lg" className="home-create-session-button">
                  Créer une nouvelle session
                </PrimaryButton>
              </Link>
            </div>

            {/* Section Participant, Écran central & Dashboard animateur */}
            <div className="home-section home-section-triple">
              <Card className="home-dual-card">
                <div className="home-dual-card-header">
                  <span className="home-dual-card-icon">👤</span>
                  <span className="home-dual-card-title">Participant</span>
                </div>
                <input
                  type="text"
                  value={participantCode}
                  onChange={(e) => setParticipantCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="home-code-input"
                  maxLength={10}
                />
                <PrimaryButton
                  variant="green"
                  size="md"
                  onClick={handleJoinParticipant}
                  className="home-join-button"
                >
                  Rejoindre
                </PrimaryButton>
              </Card>

              <Card className="home-dual-card">
                <div className="home-dual-card-header">
                  <span className="home-dual-card-icon">💻</span>
                  <span className="home-dual-card-title">Écran central</span>
                </div>
                <input
                  type="text"
                  value={screenCode}
                  onChange={(e) => setScreenCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="home-code-input"
                  maxLength={10}
                />
                <PrimaryButton
                  variant="blue"
                  size="md"
                  onClick={handleDisplayScreen}
                  className="home-display-button"
                >
                  Afficher
                </PrimaryButton>
              </Card>

              <Card className="home-dual-card">
                <div className="home-dual-card-header">
                  <span className="home-dual-card-icon">🎛️</span>
                  <span className="home-dual-card-title">Dashboard animateur</span>
                </div>
                <input
                  type="text"
                  value={animatorCode}
                  onChange={(e) => setAnimatorCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="home-code-input"
                  maxLength={10}
                />
                <PrimaryButton
                  variant="orange"
                  size="md"
                  onClick={handleJoinAnimator}
                  className="home-join-button"
                  disabled={!animatorCode.trim()}
                >
                  Accéder au dashboard animateur
                </PrimaryButton>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
