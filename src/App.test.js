import React, { useEffect, useState } from "react";
import { ref, set, onValue } from "firebase/database";
import { database } from "../firebase";

export default function FirebaseTest() {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const r = ref(database, "debug/ping");
    const unsub = onValue(r, (snap) => setValue(snap.val()));
    return () => unsub();
  }, []);

  const write = async () => {
    await set(ref(database, "debug/ping"), {
      message: "Firebase connecté ✅",
      at: Date.now(),
    });
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Firebase Test</h1>
      <button onClick={write} style={{ padding: 12, fontWeight: 700 }}>
        Écrire dans Firebase
      </button>
      <pre style={{ marginTop: 20, background: "#f5f5f5", padding: 15 }}>
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}