import { ref, get } from "firebase/database";
import { database } from "../firebase";

export function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function attribuerRole(sessionCode, rolesAttribues) {
  const participantsRef = ref(database, `participants/${sessionCode}`);
  const snapshot = await get(participantsRef);
  const participants = snapshot.val() || {};

  const rolesDejaAttribues = Object.values(participants).map((p) => p.roleId);

  const poolRoles = [];
  Object.entries(rolesAttribues || {}).forEach(([roleId, quantite]) => {
    const deja = rolesDejaAttribues.filter((r) => r === roleId).length;
    const restants = (quantite || 0) - deja;
    for (let i = 0; i < restants; i++) poolRoles.push(roleId);
  });

  if (!poolRoles.length) throw new Error("Tous les rôles sont déjà attribués");

  return poolRoles[Math.floor(Math.random() * poolRoles.length)];
}