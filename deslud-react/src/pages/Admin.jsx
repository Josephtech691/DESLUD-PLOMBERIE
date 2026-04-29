// src/pages/Admin.jsx
import { useState, useEffect, useCallback } from 'react';
import SEO from '../components/ui/SEO';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const req = async (url, opts = {}, token) => {
  const r = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
    ...opts,
  });
  return r.json();
};

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, sub, color = 'blue' }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-deslud/30 hover:shadow-[0_8px_30px_rgba(20,100,220,0.08)] transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color === 'cyan' ? 'bg-cyan-deslud/10' : color === 'green' ? 'bg-emerald-100' : color === 'red' ? 'bg-red-100' : 'bg-blue-deslud/10'}`}>{icon}</div>
      {sub !== undefined && <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+{sub}</span>}
    </div>
    <div className="font-display font-black text-3xl text-navy leading-none mb-1">{value ?? '—'}</div>
    <div className="text-sm text-gray-400 font-medium">{label}</div>
  </div>
);

/* ── Badge statut ── */
const StatutBadge = ({ s }) => {
  const map = {
    en_attente: ['bg-orange-100 text-orange-600', 'En attente'],
    en_cours: ['bg-blue-100 text-blue-600', 'En cours'],
    devis_envoye: ['bg-cyan-100 text-cyan-700', 'Devis envoyé'],
    accepte: ['bg-green-100 text-green-700', 'Accepté'],
    termine: ['bg-emerald-100 text-emerald-700', 'Terminé'],
    refuse: ['bg-red-100 text-red-600', 'Refusé'],
    nouveau: ['bg-purple-100 text-purple-700', 'Nouveau'],
    lu: ['bg-gray-100 text-gray-600', 'Lu'],
    traite: ['bg-green-100 text-green-700', 'Traité'],
  };
  const [cls, label] = map[s] || ['bg-gray-100 text-gray-500', s];
  return <span className={`text-[11px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full ${cls}`}>{label}</span>;
};

/* ── Login ── */
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    const j = await req('/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
    if (j.success) onLogin(j.data.token, j.data.user);
    else setErr(j.message || 'Identifiants incorrects');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <div className="bg-navy-2 border border-blue-deslud/20 rounded-3xl p-10 w-full max-w-md shadow-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-deslud rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-glow-blue">💧</div>
          <h1 className="font-display font-black text-3xl text-white uppercase tracking-[0.05em]">Deslud Admin</h1>
          <p className="text-white/40 text-sm mt-2">Connexion au tableau de bord</p>
        </div>
        {err && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{err}</div>}
        <form onSubmit={handle} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email admin" required
            className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-body text-[15px] outline-none focus:border-blue-deslud placeholder:text-white/25 transition-colors" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mot de passe" required
            className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-body text-[15px] outline-none focus:border-blue-deslud placeholder:text-white/25 transition-colors" />
          <button type="submit" disabled={loading}
            className="py-4 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-lg uppercase tracking-wide rounded-xl transition-colors disabled:opacity-60">
            {loading ? '⏳ Connexion...' : 'Se connecter →'}
          </button>
        </form>
        <p className="text-center text-white/25 text-xs mt-6">Accès réservé aux administrateurs</p>
      </div>
    </div>
  );
}

/* ── Dashboard Tab ── */
function DashboardTab({ token }) {
  const [data, setData] = useState(null);
  useEffect(() => { req('/admin/dashboard', {}, token).then(j => j.success && setData(j.data)); }, [token]);
  if (!data) return <div className="text-center py-20 text-gray-400">Chargement…</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon="📬" label="Contacts nouveaux" value={data.contacts.nouveaux} sub={data.contacts.ce_mois} color="blue" />
        <StatCard icon="📋" label="Devis en attente" value={data.devis.en_attente} sub={data.devis.ce_mois} color="cyan" />
        <StatCard icon="🔴" label="Urgents à traiter" value={data.devis.urgents} color="red" />
        <StatCard icon="💰" label="CA ce mois (FCFA)" value={data.finances.ca_mois?.toLocaleString()} color="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Derniers devis */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-navy uppercase tracking-[0.05em]">Derniers devis</h3>
            <span className="text-xs text-gray-400">{data.devis.total} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {data.derniers_devis?.map(d => (
              <div key={d.reference} className="px-6 py-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm text-navy uppercase">{d.nom}</div>
                  <div className="text-xs text-gray-400">{d.type_service} · {d.reference}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {d.urgence === 'tres_urgent' && <span className="text-red-500 text-xs font-bold">🔴 URGENT</span>}
                  <StatutBadge s={d.statut} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers contacts */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-navy uppercase tracking-[0.05em]">Derniers contacts</h3>
            <span className="text-xs text-gray-400">{data.contacts.total} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {data.derniers_contacts?.map(c => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm text-navy uppercase">{c.nom}</div>
                  <div className="text-xs text-gray-400">{c.telephone} · {c.sujet || '—'}</div>
                </div>
                <StatutBadge s={c.statut} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Répartition services */}
      {data.repartition_services?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-display font-bold text-lg text-navy uppercase tracking-[0.05em] mb-5">Répartition par service</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.repartition_services.map(s => (
              <div key={s.type_service} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="font-display font-black text-3xl text-blue-deslud">{s.count}</div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-[0.1em] mt-1">{s.type_service}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Devis Tab ── */
function DevisTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    req(`/admin/devis${filter ? `?statut=${filter}` : ''}`, {}, token)
      .then(j => { if (j.success) setItems(j.data); setLoading(false); });
  }, [token, filter]);

  useEffect(load, [load]);

  const updateStatut = async (id, statut, montant) => {
    await req(`/admin/devis/${id}/statut`, { method: 'PATCH', body: JSON.stringify({ statut, montant_devis: montant }) }, token);
    load(); setSelected(null);
  };

  const urgColors = { normal: 'text-gray-400', urgent: 'text-orange-500', tres_urgent: 'text-red-500' };
  const statuts = ['en_attente', 'en_cours', 'devis_envoye', 'accepte', 'refuse', 'termine'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display font-black text-2xl text-navy uppercase">Gestion des devis</h2>
        <div className="flex gap-2 flex-wrap">
          {['', 'en_attente', 'en_cours', 'termine'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 font-display font-bold text-xs uppercase tracking-[0.1em] rounded-lg border transition-all ${filter === s ? 'bg-blue-deslud text-white border-blue-deslud' : 'border-gray-200 text-gray-500 hover:border-blue-deslud'}`}>
              {s || 'Tous'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-center py-20 text-gray-400">Chargement…</div> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Référence', 'Client', 'Service', 'Urgence', 'Statut', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-display font-bold text-xs uppercase tracking-[0.12em] text-gray-400">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-display font-bold text-sm text-blue-deslud">{d.reference}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-navy text-sm">{d.nom}</div>
                      <div className="text-xs text-gray-400">{d.telephone}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{d.type_service}</td>
                    <td className="px-5 py-4 font-bold text-sm">
                      <span className={urgColors[d.urgence]}>{d.urgence === 'tres_urgent' ? '🔴' : d.urgence === 'urgent' ? '🟡' : '⬜'} {d.urgence}</span>
                    </td>
                    <td className="px-5 py-4"><StatutBadge s={d.statut} /></td>
                    <td className="px-5 py-4 text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(d)} className="px-3 py-1.5 bg-blue-deslud/10 hover:bg-blue-deslud hover:text-white text-blue-deslud font-display font-bold text-xs uppercase tracking-wide rounded-lg transition-all">Gérer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-card" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="font-display font-black text-xl text-navy uppercase">{selected.reference}</div>
                <div className="text-sm text-gray-400 mt-1">{selected.nom} · {selected.telephone}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-navy text-xl">✕</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 leading-relaxed">{selected.description}</div>
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-2">Changer le statut</label>
              <div className="grid grid-cols-3 gap-2">
                {statuts.map(s => (
                  <button key={s} onClick={() => updateStatut(selected.id, s)}
                    className={`py-2 px-3 font-display font-bold text-[11px] uppercase tracking-[0.1em] rounded-lg border transition-all ${selected.statut === s ? 'bg-blue-deslud text-white border-blue-deslud' : 'border-gray-200 text-gray-500 hover:border-blue-deslud hover:text-blue-deslud'}`}>
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Service', selected.type_service], ['Urgence', selected.urgence], ['Quartier', selected.quartier || '—'], ['Email', selected.email || '—']].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-[0.1em] mb-0.5">{k}</div>
                  <div className="font-medium text-navy">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Contacts Tab ── */
function ContactsTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    req('/admin/contacts', {}, token).then(j => { if (j.success) setItems(j.data); setLoading(false); });
  }, [token]);

  const markAs = async (id, statut) => {
    await req(`/admin/contacts/${id}/statut`, { method: 'PATCH', body: JSON.stringify({ statut }) }, token);
    setItems(p => p.map(c => c.id === id ? { ...c, statut } : c));
  };

  return (
    <div>
      <h2 className="font-display font-black text-2xl text-navy uppercase mb-6">Gestion des contacts</h2>
      {loading ? <div className="text-center py-20 text-gray-400">Chargement…</div> : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(c => (
            <div key={c.id} className={`bg-white rounded-2xl border p-6 transition-all ${c.statut === 'nouveau' ? 'border-blue-deslud/30 shadow-sm' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-display font-black text-base text-navy uppercase">{c.nom} {c.prenom || ''}</span>
                    <StatutBadge s={c.statut} />
                    {c.urgence === 'tres_urgent' && <span className="text-xs text-red-500 font-bold">🔴 URGENT</span>}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 mb-3 flex-wrap">
                    <span>📞 {c.telephone}</span>
                    {c.email && <span>✉️ {c.email}</span>}
                    <span>🕐 {new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {c.sujet && <div className="font-semibold text-sm text-navy mb-2">{c.sujet}</div>}
                  <p className="text-sm text-gray-500 leading-relaxed">{c.message}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {c.statut !== 'traite' && (
                    <button onClick={() => markAs(c.id, 'traite')} className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-display font-bold text-xs uppercase tracking-wide rounded-lg transition-colors">✅ Traité</button>
                  )}
                  <a href={`tel:${c.telephone}`} className="px-4 py-2 bg-blue-deslud/10 hover:bg-blue-deslud hover:text-white text-blue-deslud font-display font-bold text-xs uppercase tracking-wide rounded-lg transition-all text-center">📞 Appeler</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Temoignages Tab ── */
function TemoignagesTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    req('/admin/temoignages', {}, token).then(j => { if (j.success) setItems(j.data); setLoading(false); });
  }, [token]);

  const validate = async (id) => {
    await req(`/admin/temoignages/${id}/valider`, { method: 'PATCH' }, token);
    setItems(p => p.map(t => t.id === id ? { ...t, valide: 1 } : t));
  };

  return (
    <div>
      <h2 className="font-display font-black text-2xl text-navy uppercase mb-6">Gestion des témoignages</h2>
      {loading ? <div className="text-center py-20 text-gray-400">Chargement…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(t => (
            <div key={t.id} className={`bg-white rounded-2xl border p-6 ${!t.valide ? 'border-orange-200' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="font-display font-bold text-base text-navy uppercase">{t.nom_client}</div>
                {!t.valide && <span className="text-xs bg-orange-100 text-orange-600 font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">En attente</span>}
                {t.valide === 1 && <span className="text-xs bg-green-100 text-green-700 font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">✅ Publié</span>}
              </div>
              <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <span key={i} className={`text-base ${i <= t.note ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>)}</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 italic">"{t.commentaire}"</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">📍 {t.quartier || 'Yaoundé'} · {t.service_type || '—'}</span>
                {!t.valide && (
                  <button onClick={() => validate(t.id)} className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-display font-bold text-xs uppercase tracking-wide rounded-lg transition-colors">Publier ✅</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Admin ── */
export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('deslud_token'));
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('dashboard');

  const handleLogin = (t, u) => { sessionStorage.setItem('deslud_token', t); setToken(t); setUser(u); };
  const handleLogout = () => { sessionStorage.removeItem('deslud_token'); setToken(null); setUser(null); };

  if (!token) return <LoginForm onLogin={handleLogin} />;

  const tabs = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'devis', icon: '📋', label: 'Devis' },
    { key: 'contacts', icon: '📬', label: 'Contacts' },
    { key: 'temoignages', icon: '⭐', label: 'Avis' },
  ];

  return (
    <>
      <SEO title="Admin" />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-navy min-h-screen flex-shrink-0 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-deslud rounded-xl flex items-center justify-center text-xl">💧</div>
              <div>
                <div className="font-display font-black text-white text-base uppercase tracking-[0.05em] leading-none">Deslud</div>
                <div className="text-[10px] text-cyan-deslud font-bold tracking-[0.2em] uppercase">Admin</div>
              </div>
            </div>
          </div>
          <nav className="p-4 flex flex-col gap-1 flex-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-[0.08em] transition-all text-left w-full
                  ${tab === t.key ? 'bg-blue-deslud text-white shadow-glow-blue' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <span className="text-lg">{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-white/30 mb-3 px-4">{user?.email || 'Admin'}</div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-display font-bold text-sm uppercase tracking-[0.08em] transition-all">
              <span>🚪</span>Déconnexion
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display font-black text-3xl text-navy uppercase tracking-[0.03em]">
                {tabs.find(t => t.key === tab)?.icon} {tabs.find(t => t.key === tab)?.label}
              </h1>
              <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            {tab === 'dashboard' && <DashboardTab token={token} />}
            {tab === 'devis' && <DevisTab token={token} />}
            {tab === 'contacts' && <ContactsTab token={token} />}
            {tab === 'temoignages' && <TemoignagesTab token={token} />}
          </div>
        </main>
      </div>
    </>
  );
}
