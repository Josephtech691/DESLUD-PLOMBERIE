// routes/index.js
const express = require('express');
const router  = express.Router();
const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Controllers
const { createContact, getAllContacts, getContactById, updateContactStatut, deleteContact, getContactStats } = require('../controllers/contactController');
const { createDevis, suiviDevis, getAllDevis, getDevisById, updateDevisStatut, addIntervention, getDevisStats } = require('../controllers/devisController');
const { getAllServices, getServiceBySlug, createService, updateService, deleteService, getAllTemoignages, createTemoignage, validerTemoignage, getAllTemoignagesAdmin, subscribeNewsletter } = require('../controllers/servicesController');
const { login, logout, getMe, changePassword, getAllUsers, createUser, toggleUser, getDashboard, getLogs } = require('../controllers/adminController');

// Middleware
const { authenticate, requireSuperAdmin } = require('../middleware/auth');
const { validate, contactRules, devisRules, devisStatutRules, loginRules, adminCreateRules, temoignageRules, newsletterRules, uuidParam } = require('../middleware/validation');

// ============================================================
// 🛠️ ROUTES UTILITAIRES
// ============================================================

router.get('/health', (req, res) => {
  res.json({ success: true, message: '✅ Deslud Plomberie API - Opérationnelle', version: '1.0.0', timestamp: new Date().toISOString() });
});

router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      nom: 'Deslud Plomberie',
      slogan: 'Votre Confort, Notre Expertise',
      description: 'Un service de plomberie rapide, propre et efficace.',
      adresse: 'Yaoundé, Cameroun',
      zone_intervention: 'Yaoundé et tout le Cameroun',
      telephones: [{ numero: '683 90 62 25', label: 'Principal' }, { numero: '658 51 87 88', label: 'Secondaire' }],
      email: 'ludovicnono83@gmail.com',
      horaires: { semaine: '07h00 - 17h30', weekend: '08h00 - 16h00', urgences: '24h/24, 6j/7' }
    }
  });
});

// Route fix admin (à supprimer après utilisation)
router.get('/fix-admin', async (req, res) => {
  if (req.query.key !== 'deslud-fix-2024') return res.status(403).json({ success: false, message: 'Clé invalide.' });
  try {
    const email    = 'admin@deslud-plomberie.cm';
    const password = 'Admin@Deslud2024!';
    const hashed   = bcrypt.hashSync(password, 12);
    await query('DELETE FROM users WHERE email=$1', [email]);
    await query('INSERT INTO users (id, nom, email, password, role, actif) VALUES ($1,$2,$3,$4,$5,$6)', [uuidv4(), 'Super Admin', email, hashed, 'super_admin', 1]);
    const user = (await query('SELECT id, email, role, actif, LENGTH(password) as pass_length FROM users WHERE email=$1', [email])).rows[0];
    res.json({ success: true, message: '✅ Admin recréé !', data: user, credentials: { email, password } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ============================================================
// 🌐 ROUTES PUBLIQUES
// ============================================================

router.post('/contact',             contactRules, validate, createContact);
router.post('/devis',               devisRules, validate, createDevis);
router.get('/devis/suivi/:reference', suiviDevis);
router.get('/services',             getAllServices);
router.get('/services/:slug',       getServiceBySlug);
router.get('/temoignages',          getAllTemoignages);
router.post('/temoignages',         temoignageRules, validate, createTemoignage);
router.post('/newsletter',          newsletterRules, validate, subscribeNewsletter);

// Actualités publiques
router.get('/actualites', async (req, res, next) => {
  try {
    const items = (await query('SELECT * FROM actualites WHERE actif=1 ORDER BY created_at DESC LIMIT 20')).rows;
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
});

// ============================================================
// 🔐 ROUTES ADMIN — Authentification
// ============================================================

router.post('/admin/auth/login',           loginRules, validate, login);
router.post('/admin/auth/logout',          authenticate, logout);
router.get('/admin/auth/me',               authenticate, getMe);
router.post('/admin/auth/change-password', authenticate, changePassword);

// ============================================================
// 🔒 ROUTES ADMIN — Dashboard & Logs
// ============================================================

router.get('/admin/dashboard', authenticate, getDashboard);
router.get('/admin/logs',      authenticate, requireSuperAdmin, getLogs);

// ============================================================
// 🔒 ROUTES ADMIN — Contacts
// ============================================================

router.get('/admin/contacts',              authenticate, getAllContacts);
router.get('/admin/contacts/stats',        authenticate, getContactStats);
router.get('/admin/contacts/:id',          authenticate, uuidParam('id'), validate, getContactById);
router.patch('/admin/contacts/:id/statut', authenticate, uuidParam('id'), validate, updateContactStatut);
router.delete('/admin/contacts/:id',       authenticate, uuidParam('id'), validate, deleteContact);

// ============================================================
// 🔒 ROUTES ADMIN — Devis
// ============================================================

router.get('/admin/devis',                    authenticate, getAllDevis);
router.get('/admin/devis/stats',              authenticate, getDevisStats);
router.get('/admin/devis/:id',                authenticate, uuidParam('id'), validate, getDevisById);
router.patch('/admin/devis/:id/statut',       authenticate, uuidParam('id'), validate, devisStatutRules, validate, updateDevisStatut);
router.post('/admin/devis/:id/intervention',  authenticate, uuidParam('id'), validate, addIntervention);

// ============================================================
// 🔒 ROUTES ADMIN — Services
// ============================================================

router.post('/admin/services',        authenticate, createService);
router.put('/admin/services/:id',     authenticate, uuidParam('id'), validate, updateService);
router.delete('/admin/services/:id',  authenticate, uuidParam('id'), validate, deleteService);

// ============================================================
// 🔒 ROUTES ADMIN — Témoignages
// ============================================================

router.get('/admin/temoignages',                  authenticate, getAllTemoignagesAdmin);
router.patch('/admin/temoignages/:id/valider',    authenticate, uuidParam('id'), validate, validerTemoignage);

// ============================================================
// 🔒 ROUTES ADMIN — Actualités
// ============================================================

router.get('/admin/actualites', authenticate, async (req, res, next) => {
  try {
    const items = (await query('SELECT * FROM actualites ORDER BY created_at DESC')).rows;
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
});

router.post('/admin/actualites', authenticate, async (req, res, next) => {
  try {
    const { titre, texte, media_url, media_type, categorie } = req.body;
    if (!titre && !texte && !media_url) {
      return res.status(400).json({ success: false, message: 'Au moins un titre, texte ou média est requis.' });
    }
    const id = uuidv4();
    await query(
      'INSERT INTO actualites (id, titre, texte, media_url, media_type, categorie) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, titre||null, texte||null, media_url||null, media_type||'texte', categorie||null]
    );
    const item = (await query('SELECT * FROM actualites WHERE id=$1', [id])).rows[0];
    res.status(201).json({ success: true, data: item, message: 'Actualité publiée !' });
  } catch (error) { next(error); }
});

router.patch('/admin/actualites/:id/toggle', authenticate, async (req, res, next) => {
  try {
    const item = (await query('SELECT id, actif FROM actualites WHERE id=$1', [req.params.id])).rows[0];
    if (!item) return res.status(404).json({ success: false, message: 'Actualité non trouvée.' });
    const newActif = item.actif ? 0 : 1;
    await query('UPDATE actualites SET actif=$1, updated_at=NOW() WHERE id=$2', [newActif, item.id]);
    res.json({ success: true, message: newActif ? 'Actualité publiée.' : 'Actualité masquée.' });
  } catch (error) { next(error); }
});

router.delete('/admin/actualites/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query('DELETE FROM actualites WHERE id=$1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Actualité non trouvée.' });
    res.json({ success: true, message: 'Actualité supprimée.' });
  } catch (error) { next(error); }
});

// ============================================================
// 🔒 ROUTES ADMIN — Utilisateurs
// ============================================================

router.get('/admin/users',              authenticate, requireSuperAdmin, getAllUsers);
router.post('/admin/users',             authenticate, requireSuperAdmin, adminCreateRules, validate, createUser);
router.patch('/admin/users/:id/toggle', authenticate, requireSuperAdmin, uuidParam('id'), validate, toggleUser);

module.exports = router;
