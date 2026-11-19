import { useEffect, useState } from 'react';

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** useState that persists to localStorage (fails silently when storage is unavailable). */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep in memory */
    }
  }, [key, value]);
  return [value, setValue];
}
