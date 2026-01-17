import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

export function useFirebaseValue(path) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      setValue(null);
      return;
    }

    const r = ref(database, path);
    const unsub = onValue(r, (snap) => {
      setValue(snap.val());
      setLoading(false);
    });

    return () => unsub();
  }, [path]);

  return { value, loading };
}

export function useServerTimer(endsAt, pausedAt, pausedTimeRemaining) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (pausedAt) {
      setTimeRemaining(pausedTimeRemaining || 0);
      return;
    }
    if (!endsAt) {
      setTimeRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setTimeRemaining(Math.max(0, endsAt - now));
    }, 200);

    return () => clearInterval(interval);
  }, [endsAt, pausedAt, pausedTimeRemaining]);

  return timeRemaining;
}

export function formatTime(ms) {
  const totalSeconds = Math.floor((ms || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}