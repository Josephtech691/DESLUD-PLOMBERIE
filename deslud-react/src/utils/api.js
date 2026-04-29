// src/utils/api.js
const API_BASE = import.meta.env.VITE_API_URL;

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok && !json.success) throw new Error(json.message || 'Erreur serveur');
  return json;
};

export const api = {
  // Public
  getServices: () => request('/services'),
  getTemoignages: () => request('/temoignages'),
  sendContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  sendDevis: (data) => request('/devis', { method: 'POST', body: JSON.stringify(data) }),
  suiviDevis: (ref) => request(`/devis/suivi/${ref}`),
  sendTemoignage: (data) => request('/temoignages', { method: 'POST', body: JSON.stringify(data) }),
  subscribe: (email) => request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};
