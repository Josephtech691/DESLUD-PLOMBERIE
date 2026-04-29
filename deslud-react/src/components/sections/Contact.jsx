// src/components/sections/Contact.jsx
import { useState } from 'react';
import { useLang } from '../../hooks/useLang.jsx';
import { api } from '../../utils/api';
import { Alert, StarRating, FormField } from '../ui';

function SuiviTab({ lang }) {
  const [ref, setRef] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSuivi = async (e) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    try {
      const j = await api.suiviDevis(ref.trim().toUpperCase());
      setResult(j.success ? j.data : null);
    } catch { setResult(null); } finally { setLoading(false); }
  };

  const statLabels = { fr: { en_attente: 'En attente', en_cours: 'En cours', devis_envoye: 'Devis envoyé', accepte: 'Accepté', refuse: 'Refusé', termine: 'Terminé' }, en: { en_attente: 'Pending', en_cours: 'In progress', devis_envoye: 'Quote sent', accepte: 'Accepted', refuse: 'Refused', termine: 'Completed' } };
  const statColors = { en_attente: 'bg-orange-500/10 text-orange-500 border-orange-500/30', en_cours: 'bg-blue-500/10 text-blue-500 border-blue-500/30', devis_envoye: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30', accepte: 'bg-green-500/10 text-green-500 border-green-500/30', termine: 'bg-green-500/10 text-green-500 border-green-500/30', refuse: 'bg-red-500/10 text-red-500 border-red-500/30' };

  return (
    <div>
      <p className="text-sm text-gray-400 mb-5">{lang === 'fr' ? 'Entrez votre référence de devis pour suivre son avancement.' : 'Enter your quote reference to track progress.'}</p>
      <form onSubmit={handleSuivi} className="flex gap-3 mb-5">
        <input value={ref} onChange={e => setRef(e.target.value)} placeholder="Ex: DV2401-4872"
          className="form-input flex-1 font-display font-bold tracking-[0.08em] text-lg uppercase" maxLength={15} required />
        <button type="submit" disabled={loading}
          className="px-6 py-3.5 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold uppercase tracking-wide rounded-lg transition-colors whitespace-nowrap disabled:opacity-60">
          {loading ? '⏳' : (lang === 'fr' ? '🔍 Suivre' : '🔍 Track')}
        </button>
      </form>
      {result && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">{lang === 'fr' ? 'Référence' : 'Reference'}</div>
              <div className="font-display font-black text-xl text-navy">{result.reference}</div>
            </div>
            <span className={`font-display font-bold text-sm uppercase tracking-[0.08em] px-4 py-2 border rounded-full ${statColors[result.statut] || ''}`}>
              {statLabels[lang]?.[result.statut] || result.statut}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [lang === 'fr' ? 'Service' : 'Service', result.type_service],
              [lang === 'fr' ? 'Urgence' : 'Urgency', result.urgence],
              [lang === 'fr' ? 'Soumis le' : 'Submitted', new Date(result.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')],
              [lang === 'fr' ? 'Mis à jour' : 'Updated', new Date(result.updated_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-1">{label}</div>
                <div className="font-semibold text-navy text-sm">{val}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-deslud/5 border border-blue-deslud/15 rounded-lg text-center text-sm text-gray-500">
            {lang === 'fr' ? 'Des questions ? Appelez le ' : 'Questions? Call '}<strong className="text-blue-deslud">683 90 62 25</strong>
          </div>
        </div>
      )}
      {result === null && ref && !loading && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-display font-bold uppercase">{lang === 'fr' ? 'Référence non trouvée' : 'Reference not found'}</div>
        </div>
      )}
    </div>
  );
}

export default function Contact({ showToast }) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState('contact');
  const [note, setNote] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [alerts, setAlerts] = useState({});
  const [loading, setLoading] = useState({});

  const setAlert = (key, type, msg) => setAlerts(p => ({ ...p, [key]: { type, msg } }));
  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }));

  const handleContact = async (e) => {
    e.preventDefault();
    setLoad('contact', true);
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const j = await api.sendContact(data);
      if (j.success) { setAlert('contact', 'success', j.message); e.target.reset(); showToast?.('💬', lang === 'fr' ? 'Message envoyé !' : 'Message sent!', lang === 'fr' ? 'Réponse sous 24h.' : 'Reply within 24h.'); }
      else setAlert('contact', 'error', j.message);
    } catch { setAlert('contact', 'error', lang === 'fr' ? 'Erreur de connexion. Appelez-nous.' : 'Connection error. Please call us.'); }
    finally { setLoad('contact', false); }
  };

  const handleDevis = async (e) => {
    e.preventDefault();
    setLoad('devis', true);
    const fd = new FormData(e.target);
    if (photo) fd.append('photo', photo);
    const data = Object.fromEntries(fd);
    try {
      const j = await api.sendDevis(data);
      if (j.success) {
        setAlert('devis', 'success', `${j.message}${j.data?.reference ? ` <strong>Réf: ${j.data.reference}</strong>` : ''}`);
        e.target.reset(); setPhoto(null);
        showToast?.('📋', lang === 'fr' ? 'Devis demandé !' : 'Quote requested!', `Réf: ${j.data?.reference || ''}`);
      } else setAlert('devis', 'error', j.errors?.map(e => e.message).join(', ') || j.message);
    } catch { setAlert('devis', 'error', lang === 'fr' ? 'Erreur serveur.' : 'Server error.'); }
    finally { setLoad('devis', false); }
  };

  const handleAvis = async (e) => {
    e.preventDefault();
    if (!note) { setAlert('avis', 'error', lang === 'fr' ? 'Veuillez sélectionner une note.' : 'Please select a rating.'); return; }
    setLoad('avis', true);
    const data = { ...Object.fromEntries(new FormData(e.target)), note };
    try {
      const j = await api.sendTemoignage(data);
      if (j.success) { setAlert('avis', 'success', j.message); e.target.reset(); setNote(0); showToast?.('⭐', 'Merci !', j.message); }
      else setAlert('avis', 'error', j.message);
    } catch { setAlert('avis', 'error', lang === 'fr' ? 'Erreur serveur.' : 'Server error.'); }
    finally { setLoad('avis', false); }
  };

  const tabs = [
    { key: 'contact', label: t('contact.tab_msg') },
    { key: 'devis', label: t('contact.tab_devis') },
    { key: 'avis', label: t('contact.tab_avis') },
    { key: 'suivi', label: lang === 'fr' ? '🔍 Suivi devis' : '🔍 Track quote' },
  ];

  const inp = 'w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg font-body text-[15px] text-navy outline-none transition-all duration-200 focus:border-blue-deslud focus:ring-2 focus:ring-blue-deslud/10 placeholder:text-gray-300';
  const row2 = 'grid grid-cols-1 sm:grid-cols-2 gap-4';
  const Btn = ({ children, loading: ld, className = '' }) => (
    <button type="submit" disabled={ld} className={`inline-flex items-center gap-2 px-8 py-4 bg-blue-deslud hover:bg-blue-deslud-2 text-white font-display font-bold text-lg uppercase tracking-wide rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-glow-blue disabled:opacity-60 ${className}`}>
      {ld ? (lang === 'fr' ? '⏳ Envoi...' : '⏳ Sending...') : children}
    </button>
  );

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-start">

          {/* Left info */}
          <div className="lg:col-span-2">
            <span className="font-display text-xs font-bold tracking-[0.25em] uppercase text-blue-deslud block mb-3 reveal">{lang === 'fr' ? 'Nous joindre' : 'Contact us'}</span>
            <h2 className="font-display font-black text-[clamp(30px,3.5vw,48px)] text-navy uppercase leading-[1.05] mb-4 reveal">
              {t('contact.title')} <span className="text-blue-deslud">{t('contact.title2')}</span>
            </h2>
            <p className="text-gray-400 text-[15px] leading-[1.8] mb-8 reveal">{t('contact.sub')}</p>

            <div className="flex flex-col gap-3 mb-8">
              {[
                { icon: '📞', label: lang === 'fr' ? 'Téléphone principal' : 'Main phone', val: '683 90 62 25', href: 'tel:+237683906225' },
                { icon: '📱', label: lang === 'fr' ? 'Téléphone secondaire' : 'Secondary', val: '658 51 87 88', href: 'tel:+237658518788' },
                { icon: '✉️', label: 'Email', val: 'ludovicnono83@gmail.com', href: 'mailto:ludovicnono83@gmail.com' },
                { icon: '📍', label: lang === 'fr' ? 'Localisation' : 'Location', val: 'Yaoundé, Cameroun', href: null },
              ].map(({ icon, label, val, href }) => (
                <div key={label} className="reveal">
                  {href
                    ? <a href={href} className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-deslud/5 border border-gray-100 hover:border-blue-deslud/30 rounded-xl transition-all">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-xl flex items-center justify-center text-xl shadow-glow-blue flex-shrink-0">{icon}</div>
                        <div><div className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">{label}</div><div className="font-display font-bold text-[17px] text-navy">{val}</div></div>
                      </a>
                    : <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-deslud to-cyan-deslud rounded-xl flex items-center justify-center text-xl shadow-glow-blue flex-shrink-0">{icon}</div>
                        <div><div className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">{label}</div><div className="font-display font-bold text-[17px] text-navy">{val}</div></div>
                      </div>}
                </div>
              ))}
            </div>

            {/* Horaires */}
            <div className="bg-navy rounded-xl p-6 reveal">
              <h4 className="font-display font-bold text-[16px] text-white uppercase tracking-[0.08em] mb-4">⏰ {lang === 'fr' ? 'Nos horaires' : 'Our hours'}</h4>
              {[
                [lang === 'fr' ? 'Lun — Ven' : 'Mon — Fri', '07h00 — 20h00'],
                ['Samedi', '08h00 — 18h00'],
                [lang === 'fr' ? 'Urgences' : 'Emergencies', '24h/24 — 7j/7'],
              ].map(([d, h]) => (
                <div key={d} className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-0">
                  <span className="text-sm text-white/50">{d}</span>
                  <span className={`font-display font-bold text-[15px] tracking-[0.05em] ${d.includes('Urgences') || d.includes('Emergencies') ? 'text-red-400' : 'text-cyan-deslud'}`}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form panel */}
          <div className="lg:col-span-3 bg-gray-50 rounded-3xl p-8 border border-gray-100 reveal reveal-delay-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-200/70 rounded-xl p-1 mb-8 flex-wrap">
              {tabs.map(({ key, label }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex-1 py-3 px-3 font-display font-bold text-[13px] uppercase tracking-[0.05em] rounded-lg transition-all duration-200 text-center
                    ${tab === key ? 'bg-white text-blue-deslud shadow-sm' : 'text-gray-400 hover:text-navy'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* CONTACT */}
            {tab === 'contact' && (
              <form onSubmit={handleContact} noValidate>
                <Alert type={alerts.contact?.type}>{alerts.contact?.msg}</Alert>
                <div className={row2}>
                  <FormField label={lang === 'fr' ? 'Nom' : 'Name'} required><input name="nom" className={inp} placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'} required /></FormField>
                  <FormField label={lang === 'fr' ? 'Prénom' : 'First name'}><input name="prenom" className={inp} placeholder={lang === 'fr' ? 'Votre prénom' : 'First name'} /></FormField>
                </div>
                <div className={`${row2} mt-4`}>
                  <FormField label={lang === 'fr' ? 'Téléphone' : 'Phone'} required><input name="telephone" type="tel" className={inp} placeholder="683 90 62 25" required /></FormField>
                  <FormField label="Email"><input name="email" type="email" className={inp} placeholder="votre@email.com" /></FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Sujet' : 'Subject'}><input name="sujet" className={inp} placeholder={lang === 'fr' ? "Ex: Fuite d'eau urgente" : 'E.g. Urgent water leak'} /></FormField>
                </div>
                <div className="mt-4">
                  <FormField label="Message" required><textarea name="message" className={`${inp} min-h-[120px] resize-y`} placeholder={lang === 'fr' ? "Décrivez votre problème..." : 'Describe your issue...'} required /></FormField>
                </div>
                <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
                  <span className="text-xs text-gray-400"><strong className="text-navy">{lang === 'fr' ? 'Réponse garantie' : 'Guaranteed reply'}</strong> {lang === 'fr' ? 'sous 24h' : 'within 24h'}</span>
                  <Btn loading={loading.contact}>{t('contact.send')} →</Btn>
                </div>
              </form>
            )}

            {/* DEVIS */}
            {tab === 'devis' && (
              <form onSubmit={handleDevis} noValidate>
                <Alert type={alerts.devis?.type}>{alerts.devis?.msg}</Alert>
                <div className={row2}>
                  <FormField label={lang === 'fr' ? 'Nom' : 'Name'} required><input name="nom" className={inp} placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'} required /></FormField>
                  <FormField label={lang === 'fr' ? 'Téléphone' : 'Phone'} required><input name="telephone" type="tel" className={inp} placeholder="683 90 62 25" required /></FormField>
                </div>
                <div className={`${row2} mt-4`}>
                  <FormField label={lang === 'fr' ? 'Quartier' : 'District'}><input name="quartier" className={inp} placeholder="Ex: Bastos" /></FormField>
                  <FormField label={lang === 'fr' ? 'Ville' : 'City'}><input name="ville" className={inp} defaultValue="Yaoundé" /></FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Type de service' : 'Service type'} required>
                    <select name="type_service" className={inp} required>
                      <option value="">{lang === 'fr' ? '-- Choisir --' : '-- Choose --'}</option>
                      <option value="installation">🔧 {lang === 'fr' ? 'Installation Sanitaire' : 'Sanitary Installation'}</option>
                      <option value="entretien">⚙️ {lang === 'fr' ? 'Entretien & Maintenance' : 'Maintenance'}</option>
                      <option value="depannage_rapide">⚡ {lang === 'fr' ? 'Dépannage Rapide' : 'Emergency Repair'}</option>
                      <option value="autre">🛠️ {lang === 'fr' ? 'Autre' : 'Other'}</option>
                    </select>
                  </FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? "Niveau d'urgence" : 'Urgency level'}>
                    <div className="grid grid-cols-3 gap-2">
                      {[['normal', '⬜', 'Normal'], ['urgent', '🟡', lang === 'fr' ? 'Urgent' : 'Urgent'], ['tres_urgent', '🔴', lang === 'fr' ? 'Très urgent' : 'Critical']].map(([v, ic, lb]) => (
                        <label key={v} className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer has-[:checked]:border-blue-deslud has-[:checked]:bg-blue-deslud/5 transition-all">
                          <input type="radio" name="urgence" value={v} defaultChecked={v === 'normal'} className="sr-only" />
                          <span className="text-xl">{ic}</span>
                          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500">{lb}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Description du problème' : 'Problem description'} required>
                    <textarea name="description" className={`${inp} min-h-[100px] resize-y`} placeholder={lang === 'fr' ? "Décrivez en détail votre besoin..." : 'Describe your need in detail...'} required />
                  </FormField>
                </div>
                {/* Photo upload */}
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Photo du problème (optionnel)' : 'Problem photo (optional)'}>
                    <label className="flex flex-col items-center justify-center gap-2 w-full h-28 bg-white border-2 border-dashed border-gray-200 hover:border-blue-deslud rounded-xl cursor-pointer transition-colors">
                      <span className="text-3xl">{photo ? '📸' : '📷'}</span>
                      <span className="text-sm text-gray-400">{photo ? photo.name : (lang === 'fr' ? 'Cliquer pour ajouter une photo' : 'Click to add a photo')}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setPhoto(e.target.files?.[0] || null)} />
                    </label>
                  </FormField>
                </div>
                <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
                  <span className="text-xs text-gray-400"><strong className="text-navy">{lang === 'fr' ? 'Devis gratuit' : 'Free quote'}</strong> — {lang === 'fr' ? 'Réponse sous 24h' : 'Reply within 24h'}</span>
                  <Btn loading={loading.devis} className="!bg-cyan-deslud !text-navy hover:!bg-cyan-deslud-2">{t('contact.send_devis')} →</Btn>
                </div>
              </form>
            )}

            {/* AVIS */}
            {tab === 'avis' && (
              <form onSubmit={handleAvis} noValidate>
                <Alert type={alerts.avis?.type}>{alerts.avis?.msg}</Alert>
                <div className={row2}>
                  <FormField label={lang === 'fr' ? 'Votre nom' : 'Your name'} required><input name="nom_client" className={inp} placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'} required /></FormField>
                  <FormField label={lang === 'fr' ? 'Quartier' : 'District'}><input name="quartier" className={inp} placeholder="Ex: Bastos" /></FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Service utilisé' : 'Service used'}>
                    <select name="service_type" className={inp}>
                      <option value="">--</option>
                      <option value="installation">{lang === 'fr' ? 'Installation' : 'Installation'}</option>
                      <option value="entretien">{lang === 'fr' ? 'Entretien' : 'Maintenance'}</option>
                      <option value="depannage_rapide">{lang === 'fr' ? 'Dépannage' : 'Emergency repair'}</option>
                      <option value="autre">{lang === 'fr' ? 'Autre' : 'Other'}</option>
                    </select>
                  </FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Note' : 'Rating'} required>
                    <StarRating value={note} onChange={setNote} size="lg" />
                  </FormField>
                </div>
                <div className="mt-4">
                  <FormField label={lang === 'fr' ? 'Votre avis' : 'Your review'} required>
                    <textarea name="commentaire" className={`${inp} min-h-[120px] resize-y`} placeholder={lang === 'fr' ? 'Partagez votre expérience...' : 'Share your experience...'} required />
                  </FormField>
                </div>
                <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
                  <span className="text-xs text-gray-400">{lang === 'fr' ? 'Publié après validation' : 'Published after review'}</span>
                  <Btn loading={loading.avis}>⭐ {t('contact.send_avis')}</Btn>
                </div>
              </form>
            )}

            {/* SUIVI */}
            {tab === 'suivi' && <SuiviTab lang={lang} />}
          </div>
        </div>
      </div>
    </section>
  );
}
