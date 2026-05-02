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

const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const colors = { blue: 'bg-blue-50', cyan: 'bg-cyan-50', green: 'bg-emerald-50', red: 'bg-red-50' };
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>{icon}</div>
        {sub !== undefined && <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+{sub}</span>}
      </div>
      <div className="font-display font-black text-2xl sm:text-3xl text-navy leading-none mb-1">{value ?? '—'}</div>
      <div className="text-xs sm:text-sm text-gray-400">{label}</div>
    </div>
  );
};

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
  return <span className={`text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-full whitespace-nowrap ${cls}`}>{label}</span>;
};

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const j = await req('/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
      if (j.success) onLogin(j.data.token, j.data.user);
      else setErr(j.message || 'Identifiants incorrects');
    } catch { setErr('Serveur inaccessible. Vérifiez votre connexion.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-navy-2 border border-blue-deslud/20 rounded-3xl p-7 sm:p-10 w-full max-w-md shadow-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-deslud rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-glow-blue">💧</div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-[0.05em]">Deslud Admin</h1>
          <p className="text-white/40 text-sm mt-2">Connexion au tableau de bord</p>
        </div>
        {err && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2"><span>❌</span>{err}</div>}
        <form onSubmit={handle} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/40 block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@deslud-plomberie.cm" required
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-body text-[15px] outline-none focus:border-blue-deslud placeholder:text-white/20 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-white/40 block mb-2">Mot de passe</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required
                className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white font-body text-[15px] outline-none focus:border-blue-deslud placeholder:text-white/20 transition-colors" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-lg">{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 py-4 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-lg uppercase tracking-wide rounded-xl transition-all disabled:opacity-60">
            {loading ? '⏳ Connexion...' : 'Se connecter →'}
          </button>
        </form>
        <p className="text-center text-white/20 text-xs mt-6">Accès réservé aux administrateurs</p>
      </div>
    </div>
  );
}

function DashboardTab({ token }) {
  const [data, setData] = useState(null);
  useEffect(() => { req('/admin/dashboard', {}, token).then(j => j.success && setData(j.data)); }, [token]);
  if (!data) return <div className="flex items-center justify-center py-20 text-gray-400"><div className="text-center"><div className="text-4xl mb-3">⚙️</div><div className="font-display font-bold uppercase">Chargement...</div></div></div>;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon="📬" label="Contacts nouveaux" value={data.contacts.nouveaux} sub={data.contacts.ce_mois} color="blue" />
        <StatCard icon="📋" label="Devis en attente" value={data.devis.en_attente} sub={data.devis.ce_mois} color="cyan" />
        <StatCard icon="🔴" label="Urgents" value={data.devis.urgents} color="red" />
        <StatCard icon="💰" label="CA mois (FCFA)" value={data.finances.ca_mois?.toLocaleString()} color="green" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><h3 className="font-display font-bold text-base text-navy uppercase">Derniers devis</h3><span className="text-xs text-gray-400">{data.devis.total} total</span></div>
          <div className="divide-y divide-gray-50">
            {data.derniers_devis?.map(d => (
              <div key={d.reference} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <div><div className="font-display font-bold text-sm text-navy uppercase">{d.nom}</div><div className="text-xs text-gray-400">{d.type_service} · {d.reference}</div></div>
                <div className="flex items-center gap-2">{d.urgence === 'tres_urgent' && <span className="text-red-500 text-xs font-bold">🔴</span>}<StatutBadge s={d.statut} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><h3 className="font-display font-bold text-base text-navy uppercase">Derniers contacts</h3><span className="text-xs text-gray-400">{data.contacts.total} total</span></div>
          <div className="divide-y divide-gray-50">
            {data.derniers_contacts?.map(c => (
              <div key={c.id} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <div><div className="font-display font-bold text-sm text-navy uppercase">{c.nom}</div><div className="text-xs text-gray-400">{c.telephone}</div></div>
                <StatutBadge s={c.statut} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DevisTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    req(`/admin/devis${filter ? `?statut=${filter}` : ''}`, {}, token).then(j => { if (j.success) setItems(j.data); setLoading(false); });
  }, [token, filter]);

  useEffect(load, [load]);

  const updateStatut = async (id, statut) => {
    await req(`/admin/devis/${id}/statut`, { method: 'PATCH', body: JSON.stringify({ statut }) }, token);
    load(); setSelected(null);
  };

  const urgIcons = { normal: '⬜', urgent: '🟡', tres_urgent: '🔴' };
  const urgColors = { normal: 'text-gray-400', urgent: 'text-orange-500', tres_urgent: 'text-red-500' };
  const statuts = ['en_attente', 'en_cours', 'devis_envoye', 'accepte', 'refuse', 'termine'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <h2 className="font-display font-black text-xl sm:text-2xl text-navy uppercase">Devis</h2>
        <div className="flex gap-2 flex-wrap">
          {[['', 'Tous'], ['en_attente', 'En attente'], ['en_cours', 'En cours'], ['termine', 'Terminé']].map(([v, lb]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 font-display font-bold text-xs uppercase tracking-[0.08em] rounded-lg border transition-all ${filter === v ? 'bg-blue-deslud text-white border-blue-deslud' : 'border-gray-200 text-gray-500 hover:border-blue-deslud'}`}>{lb}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="text-center py-16 text-gray-400">Chargement…</div> : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-3">📋</div><div className="font-display font-bold uppercase">Aucun devis</div></div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(d => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(d)}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-display font-bold text-blue-deslud text-xs mb-0.5">{d.reference}</div>
                  <div className="font-display font-black text-navy text-base uppercase">{d.nom}</div>
                </div>
                <StatutBadge s={d.statut} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                <span className="bg-gray-50 px-2.5 py-1 rounded-full">📞 {d.telephone}</span>
                <span className="bg-gray-50 px-2.5 py-1 rounded-full">🔧 {d.type_service}</span>
                <span className={`bg-gray-50 px-2.5 py-1 rounded-full font-bold ${urgColors[d.urgence]}`}>{urgIcons[d.urgence]} {d.urgence}</span>
                <span className="bg-gray-50 px-2.5 py-1 rounded-full">📅 {new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="w-full py-2.5 bg-blue-deslud/8 text-blue-deslud font-display font-bold text-xs uppercase tracking-wide rounded-xl text-center">
                Gérer ce devis →
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between mb-4">
                <div><div className="font-display font-black text-lg sm:text-xl text-navy uppercase">{selected.reference}</div><div className="text-sm text-gray-400 mt-0.5">{selected.nom} · {selected.telephone}</div></div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold flex-shrink-0">✕</button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 leading-relaxed">{selected.description}</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[['Service', selected.type_service], ['Urgence', `${urgIcons[selected.urgence]} ${selected.urgence}`], ['Quartier', selected.quartier || '—'], ['Email', selected.email || '—']].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3"><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-0.5">{k}</div><div className="font-semibold text-navy text-sm break-all">{v}</div></div>
                ))}
              </div>
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-2.5">Changer le statut</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statuts.map(s => (
                    <button key={s} onClick={() => updateStatut(selected.id, s)}
                      className={`py-2.5 px-2 font-display font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.06em] rounded-xl border transition-all
                        ${selected.statut === s ? 'bg-blue-deslud text-white border-blue-deslud' : 'border-gray-200 text-gray-500 hover:border-blue-deslud hover:text-blue-deslud'}`}>
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2.5">
                <a href={`tel:${selected.telephone}`} className="flex-1 py-3 bg-blue-deslud text-white font-display font-bold text-sm uppercase tracking-wide rounded-xl text-center hover:bg-blue-deslud-2 transition-colors">📞 Appeler</a>
                <a href={`https://wa.me/237${selected.telephone?.replace(/\s/g,'')}?text=${encodeURIComponent(`Bonjour ${selected.nom}, concernant votre devis ${selected.reference}...`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] text-white font-display font-bold text-sm uppercase tracking-wide rounded-xl text-center">💬 WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactsTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { req('/admin/contacts', {}, token).then(j => { if (j.success) setItems(j.data); setLoading(false); }); }, [token]);

  const markAs = async (id, statut) => {
    await req(`/admin/contacts/${id}/statut`, { method: 'PATCH', body: JSON.stringify({ statut }) }, token);
    setItems(p => p.map(c => c.id === id ? { ...c, statut } : c));
    setSelected(null);
  };

  return (
    <div>
      <h2 className="font-display font-black text-xl sm:text-2xl text-navy uppercase mb-5">Contacts</h2>
      {loading ? <div className="text-center py-16 text-gray-400">Chargement…</div> : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400"><div className="text-4xl mb-3">📬</div><div className="font-display font-bold uppercase">Aucun contact</div></div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(c => (
            <div key={c.id} className={`bg-white rounded-2xl border p-4 sm:p-5 cursor-pointer hover:shadow-md transition-all ${c.statut === 'nouveau' ? 'border-blue-deslud/40' : 'border-gray-100'}`} onClick={() => setSelected(c)}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div><div className="font-display font-black text-base text-navy uppercase">{c.nom} {c.prenom || ''}</div><div className="text-xs text-gray-400 mt-0.5 flex flex-wrap gap-2"><span>📞 {c.telephone}</span>{c.email && <span>✉️ {c.email}</span>}</div></div>
                <StatutBadge s={c.statut} />
              </div>
              {c.sujet && <div className="font-semibold text-sm text-navy mb-1.5">{c.sujet}</div>}
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{c.message}</p>
              <div className="flex gap-2 mt-3">
                <a href={`tel:${c.telephone}`} onClick={e => e.stopPropagation()} className="px-3 py-1.5 bg-blue-deslud/10 hover:bg-blue-deslud hover:text-white text-blue-deslud font-display font-bold text-xs uppercase rounded-lg transition-all">📞 Appeler</a>
                {c.statut !== 'traite' && <button onClick={e => { e.stopPropagation(); markAs(c.id, 'traite'); }} className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-display font-bold text-xs uppercase rounded-lg transition-colors">✅ Traité</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between mb-4">
                <div><div className="font-display font-black text-lg text-navy uppercase">{selected.nom} {selected.prenom || ''}</div><StatutBadge s={selected.statut} /></div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold flex-shrink-0">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[['Téléphone', selected.telephone], ['Email', selected.email || '—'], ['Sujet', selected.sujet || '—'], ['Date', new Date(selected.created_at).toLocaleDateString('fr-FR')]].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3"><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-0.5">{k}</div><div className="font-semibold text-navy text-sm break-all">{v}</div></div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 leading-relaxed">{selected.message}</div>
              <div className="flex gap-2.5">
                <a href={`tel:${selected.telephone}`} className="flex-1 py-3 bg-blue-deslud text-white font-display font-bold text-sm uppercase rounded-xl text-center">📞 Appeler</a>
                {selected.statut !== 'traite' && <button onClick={() => markAs(selected.id, 'traite')} className="flex-1 py-3 bg-green-500 text-white font-display font-bold text-sm uppercase rounded-xl">✅ Traité</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemoignagesTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { req('/admin/temoignages', {}, token).then(j => { if (j.success) setItems(j.data); setLoading(false); }); }, [token]);

  const validate = async (id) => {
    await req(`/admin/temoignages/${id}/valider`, { method: 'PATCH' }, token);
    setItems(p => p.map(t => t.id === id ? { ...t, valide: 1 } : t));
  };

  return (
    <div>
      <h2 className="font-display font-black text-xl sm:text-2xl text-navy uppercase mb-5">Avis clients</h2>
      {loading ? <div className="text-center py-16 text-gray-400">Chargement…</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map(t => (
            <div key={t.id} className={`bg-white rounded-2xl border p-5 ${!t.valide ? 'border-orange-200' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="font-display font-bold text-base text-navy uppercase">{t.nom_client}</div>
                {!t.valide ? <span className="text-[10px] bg-orange-100 text-orange-600 font-bold uppercase tracking-wide px-2 py-1 rounded-full">En attente</span>
                  : <span className="text-[10px] bg-green-100 text-green-700 font-bold uppercase tracking-wide px-2 py-1 rounded-full">✅ Publié</span>}
              </div>
              <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <span key={i} className={`text-lg ${i <= t.note ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>)}</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 italic">"{t.commentaire}"</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs text-gray-400">📍 {t.quartier || 'Yaoundé'} · {t.service_type || '—'}</div>
                {!t.valide && <button onClick={() => validate(t.id)} className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-display font-bold text-xs uppercase tracking-wide rounded-lg transition-colors">Publier ✅</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function ActualitesTab({ token }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]           = useState(null);
  const [form, setForm]         = useState({
    titre: '', texte: '', media_url: '', media_type: 'texte', categorie: '',
  });

  const load = () => {
    setLoading(true);
    req('/admin/actualites', {}, token)
      .then(j => { if (j.success) setItems(j.data); setLoading(false); });
  };

  useEffect(load, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const j = await req('/admin/actualites', {
        method: 'POST',
        body: JSON.stringify(form),
      }, token);
      if (j.success) {
        setMsg({ type: 'success', text: '✅ ' + j.message });
        setForm({ titre: '', texte: '', media_url: '', media_type: 'texte', categorie: '' });
        load();
      } else {
        setMsg({ type: 'error', text: '❌ ' + j.message });
      }
    } catch { setMsg({ type: 'error', text: '❌ Erreur serveur.' }); }
    setSubmitting(false);
  };

  const handleToggle = async (id) => {
    await req(`/admin/actualites/${id}/toggle`, { method: 'PATCH' }, token);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cette actualité ?')) return;
    await req(`/admin/actualites/${id}`, { method: 'DELETE' }, token);
    load();
  };

  const inp = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-navy font-body text-[15px] outline-none focus:border-blue-deslud focus:ring-2 focus:ring-blue-deslud/10 transition-all placeholder:text-gray-300';

  return (
    <div className="space-y-6">
      <h2 className="font-display font-black text-xl sm:text-2xl text-navy uppercase">
        Gestion des actualités
      </h2>

      {/* ── Formulaire création ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7">
        <h3 className="font-display font-bold text-lg text-navy uppercase tracking-[0.05em] mb-5">
          📰 Publier une actualité
        </h3>

        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium mb-5 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Titre</label>
              <input value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
                placeholder="Ex: Nouveau service disponible" className={inp} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Catégorie</label>
              <input value={form.categorie} onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))}
                placeholder="Ex: Promotion, Info, Conseil..." className={inp} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Texte / Description</label>
            <textarea value={form.texte} onChange={e => setForm(p => ({ ...p, texte: e.target.value }))}
              placeholder="Décrivez votre actualité en détail..." rows={4}
              className={`${inp} resize-y min-h-[100px]`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">
                URL de la photo / vidéo <span className="font-normal text-gray-300">(optionnel)</span>
              </label>
              <input value={form.media_url} onChange={e => setForm(p => ({ ...p, media_url: e.target.value }))}
                placeholder="https://... (lien vers image ou vidéo)" className={inp} />
              <p className="text-[11px] text-gray-300 mt-1.5">
                💡 Uploadez votre photo sur <strong>imgbb.com</strong> ou <strong>cloudinary.com</strong> gratuitement, puis collez le lien ici.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Type de média</label>
              <select value={form.media_type} onChange={e => setForm(p => ({ ...p, media_type: e.target.value }))} className={inp}>
                <option value="texte">📝 Texte seulement</option>
                <option value="image">🖼️ Image</option>
                <option value="video">🎥 Vidéo</option>
              </select>
            </div>
          </div>

          {/* Prévisualisation media */}
          {form.media_url && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">Prévisualisation</div>
              <div className="p-3">
                {form.media_type === 'video'
                  ? <video src={form.media_url} controls className="w-full max-h-48 rounded-lg object-contain bg-black" />
                  : <img src={form.media_url} alt="preview" className="w-full max-h-48 rounded-lg object-cover" onError={e => e.target.style.display='none'} />
                }
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-base uppercase tracking-wide rounded-xl transition-all disabled:opacity-60">
            {submitting ? '⏳ Publication...' : '📰 Publier l\'actualité'}
          </button>
        </form>
      </div>

      {/* ── Liste des actualités ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-navy uppercase tracking-[0.05em]">
            Actualités publiées
          </h3>
          <span className="text-xs text-gray-400">{items.length} au total</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📰</div>
            <div className="font-display font-bold uppercase text-sm">Aucune actualité publiée</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(item => (
              <div key={item.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 ${!item.actif ? 'opacity-50' : ''}`}>

                {/* Miniature */}
                {item.media_url && (
                  <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.media_type === 'video'
                      ? <div className="w-full h-full flex items-center justify-center bg-navy text-white text-2xl">▶</div>
                      : <img src={item.media_url} alt="" className="w-full h-full object-cover" onError={e => e.target.parentElement.style.display='none'} />
                    }
                  </div>
                )}

                {/* Contenu */}
function ActualitesTab({ token }) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]           = useState(null);
  const [form, setForm]         = useState({
    titre: '', texte: '', media_url: '', media_type: 'texte', categorie: '',
  });

  const load = () => {
    setLoading(true);
    req('/admin/actualites', {}, token)
      .then(j => { if (j.success) setItems(j.data); setLoading(false); });
  };

  useEffect(load, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const j = await req('/admin/actualites', {
        method: 'POST',
        body: JSON.stringify(form),
      }, token);
      if (j.success) {
        setMsg({ type: 'success', text: '✅ ' + j.message });
        setForm({ titre: '', texte: '', media_url: '', media_type: 'texte', categorie: '' });
        load();
      } else {
        setMsg({ type: 'error', text: '❌ ' + j.message });
      }
    } catch { setMsg({ type: 'error', text: '❌ Erreur serveur.' }); }
    setSubmitting(false);
  };

  const handleToggle = async (id) => {
    await req(`/admin/actualites/${id}/toggle`, { method: 'PATCH' }, token);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cette actualité ?')) return;
    await req(`/admin/actualites/${id}`, { method: 'DELETE' }, token);
    load();
  };

  const inp = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-navy font-body text-[15px] outline-none focus:border-blue-deslud focus:ring-2 focus:ring-blue-deslud/10 transition-all placeholder:text-gray-300';

  return (
    <div className="space-y-6">
      <h2 className="font-display font-black text-xl sm:text-2xl text-navy uppercase">
        Gestion des actualités
      </h2>

      {/* Formulaire création */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7">
        <h3 className="font-display font-bold text-lg text-navy uppercase tracking-[0.05em] mb-5">
          📰 Publier une actualité
        </h3>

        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium mb-5 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Titre</label>
              <input value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
                placeholder="Ex: Nouveau service disponible" className={inp} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Catégorie</label>
              <input value={form.categorie} onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))}
                placeholder="Ex: Promotion, Info, Conseil..." className={inp} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Texte / Description</label>
            <textarea value={form.texte} onChange={e => setForm(p => ({ ...p, texte: e.target.value }))}
              placeholder="Décrivez votre actualité en détail..." rows={4}
              className={`${inp} resize-y min-h-[100px]`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">
                URL de la photo / vidéo <span className="font-normal text-gray-300">(optionnel)</span>
              </label>
              <input value={form.media_url} onChange={e => setForm(p => ({ ...p, media_url: e.target.value }))}
                placeholder="https://... (lien vers image ou vidéo)" className={inp} />
              <p className="text-[11px] text-gray-300 mt-1.5">
                💡 Uploadez sur <strong>imgbb.com</strong> ou <strong>cloudinary.com</strong> (gratuit), puis collez le lien ici.
              </p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 block mb-1.5">Type de média</label>
              <select value={form.media_type} onChange={e => setForm(p => ({ ...p, media_type: e.target.value }))} className={inp}>
                <option value="texte">📝 Texte seulement</option>
                <option value="image">🖼️ Image</option>
                <option value="video">🎥 Vidéo</option>
              </select>
            </div>
          </div>

          {/* Prévisualisation */}
          {form.media_url && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">Prévisualisation</div>
              <div className="p-3">
                {form.media_type === 'video'
                  ? <video src={form.media_url} controls className="w-full max-h-48 rounded-lg object-contain bg-black" />
                  : <img src={form.media_url} alt="preview" className="w-full max-h-48 rounded-lg object-cover" onError={e => e.target.style.display='none'} />
                }
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-base uppercase tracking-wide rounded-xl transition-all disabled:opacity-60">
            {submitting ? '⏳ Publication...' : '📰 Publier l\'actualité'}
          </button>
        </form>
      </div>

      {/* Liste des actualités */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-navy uppercase tracking-[0.05em]">
            Actualités publiées
          </h3>
          <span className="text-xs text-gray-400">{items.length} au total</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📰</div>
            <div className="font-display font-bold uppercase text-sm">Aucune actualité publiée</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(item => (
              <div key={item.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 ${!item.actif ? 'opacity-50' : ''}`}>

                {/* Miniature */}
                {item.media_url && (
                  <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.media_type === 'video'
                      ? <div className="w-full h-full flex items-center justify-center bg-navy text-white text-2xl">▶</div>
                      : <img src={item.media_url} alt="" className="w-full h-full object-cover" onError={e => e.target.parentElement.style.display='none'} />
                    }
                  </div>
                )}

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {item.categorie && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                        {item.categorie}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${item.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.actif ? '✅ Visible' : '🙈 Masquée'}
                    </span>
                  </div>
                  {item.titre && (
                    <div className="font-display font-black text-base text-navy uppercase leading-tight mb-1">
                      {item.titre}
                    </div>
                  )}
                  {item.texte && (
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.texte}</p>
                  )}
                  <div className="text-[11px] text-gray-300 mt-2">
                    📅 {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <button onClick={() => handleToggle(item.id)}
                    className={`px-3 py-2 font-display font-bold text-xs uppercase tracking-wide rounded-xl border transition-all text-center
                      ${item.actif
                        ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                        : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                    {item.actif ? '🙈 Masquer' : '✅ Publier'}
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 font-display font-bold text-xs uppercase tracking-wide rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all">
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
const TABS = [
  { key: 'dashboard',   icon: '📊', label: 'Dashboard'  },
  { key: 'devis',       icon: '📋', label: 'Devis'      },
  { key: 'contacts',    icon: '📬', label: 'Contacts'   },
  { key: 'temoignages', icon: '⭐', label: 'Avis'       },
  { key: 'actualites',  icon: '📰', label: 'Actualités' },
];

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('deslud_token'));
  const [user, setUser]   = useState(null);
  const [tab, setTab]     = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin  = (t, u) => { sessionStorage.setItem('deslud_token', t); setToken(t); setUser(u); };
  const handleLogout = ()      => { sessionStorage.removeItem('deslud_token'); setToken(null); setUser(null); };

  if (!token) return <LoginForm onLogin={handleLogin} />;

  const currentTab = TABS.find(t => t.key === tab);

  return (
    <>
      <SEO title="Admin — Deslud Plomberie" />
      <div className="min-h-screen bg-gray-50 flex">

        {/* Sidebar desktop */}
        <aside className="hidden lg:flex w-56 xl:w-64 bg-navy min-h-screen flex-shrink-0 flex-col fixed left-0 top-0 bottom-0 z-40">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-deslud rounded-xl flex items-center justify-center text-lg flex-shrink-0">💧</div>
              <div className="leading-none"><div className="font-display font-black text-white text-sm uppercase tracking-[0.05em]">Deslud</div><div className="text-[9px] text-cyan-deslud font-bold tracking-[0.2em] uppercase">Admin</div></div>
            </div>
          </div>
          <nav className="p-3 flex flex-col gap-1 flex-1">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display font-bold text-sm uppercase tracking-[0.08em] transition-all text-left w-full
                  ${tab === t.key ? 'bg-blue-deslud text-white shadow-glow-blue' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <span className="text-lg flex-shrink-0">{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-white/10">
            <div className="px-4 py-2 text-[10px] text-white/30 truncate">{user?.email}</div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-display font-bold text-xs uppercase tracking-[0.08em] transition-all">🚪 Déconnexion</button>
          </div>
        </aside>

        {/* Sidebar mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-68 bg-navy flex flex-col" style={{width:'272px'}}>
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-deslud rounded-xl flex items-center justify-center text-lg">💧</div>
                  <div className="font-display font-black text-white text-sm uppercase tracking-[0.05em]">Deslud Admin</div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white font-bold">✕</button>
              </div>
              <nav className="p-3 flex flex-col gap-1 flex-1">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => { setTab(t.key); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-display font-bold text-base uppercase tracking-[0.08em] transition-all text-left w-full
                      ${tab === t.key ? 'bg-blue-deslud text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                    <span className="text-xl">{t.icon}</span>{t.label}
                  </button>
                ))}
              </nav>
              <div className="p-3 border-t border-white/10">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-display font-bold text-sm uppercase transition-all">🚪 Déconnexion</button>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-56 xl:ml-64 flex flex-col min-h-screen">

          {/* Header mobile */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 lg:hidden shadow-sm">
            <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 text-xl">☰</button>
            <div className="flex items-center gap-2"><span className="text-xl">{currentTab?.icon}</span><span className="font-display font-black text-base text-navy uppercase tracking-[0.05em]">{currentTab?.label}</span></div>
            <div className="ml-auto w-8 h-8 bg-blue-deslud rounded-lg flex items-center justify-center text-white font-display font-black text-sm">{user?.nom?.[0] || 'A'}</div>
          </header>

          {/* Header desktop */}
          <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-gray-100 px-8 py-4 items-center justify-between shadow-sm">
            <div><h1 className="font-display font-black text-2xl text-navy uppercase tracking-[0.03em]">{currentTab?.icon} {currentTab?.label}</h1><p className="text-gray-400 text-xs mt-0.5">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
            <div className="flex items-center gap-3">
              <div className="text-right"><div className="font-display font-bold text-sm text-navy uppercase">{user?.nom || 'Admin'}</div><div className="text-xs text-gray-400">{user?.email}</div></div>
              <div className="w-10 h-10 bg-blue-deslud rounded-xl flex items-center justify-center text-white font-display font-black text-lg">{user?.nom?.[0] || 'A'}</div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-5 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-6xl mx-auto">
              {tab === 'dashboard'   && <DashboardTab   token={token} />}
              {tab === 'devis'       && <DevisTab       token={token} />}
              {tab === 'contacts'    && <ContactsTab    token={token} />}
              {tab === 'temoignages' && <TemoignagesTab token={token} />}
              {tab === 'actualites'  && <ActualitesTab  token={token} />}
            </div>
          </main>

          {/* Bottom nav mobile */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-all relative ${tab === t.key ? 'text-blue-deslud' : 'text-gray-400'}`}>
                {tab === t.key && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-deslud rounded-full" />}
                <span className="text-xl">{t.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.06em]">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
