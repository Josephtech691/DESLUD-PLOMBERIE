// src/hooks/useToast.js
import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((icon, title, message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, icon, title, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  return { toasts, showToast };
};
