// routes/index.js
const express = require('express');
const router = express.Router();

// ✅ Ces imports doivent être présents
const { getDb } = require('../config/database');
const { authenticate, requireSuperAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// ... reste du fichier

// Import controllers
const {
  createContact, getAllContacts, getContactById,
  updateContactStatut, deleteContact, getContactStats
} = require('../controllers/contactController');

const {
  createDevis, suiviDevis, getAllDevis, getDevisById,
  updateDevisStatut, addIntervention, getDevisStats
} = require('../controllers/devisController');

const {
  getAllServices, getServiceBySlug, createService, updateService, deleteService,
  getAllTemoignages, createTemoignage, validerTemoignage, getAllTemoignagesAdmin,
  subscribeNewsletter
} = require('../controllers/servicesController');

const {
  login, logout, getMe, changePassword,
  getAllUsers, createUser, toggleUser,
  getDashboard, getLogs
} = require('../controllers/adminController');

// Import middleware
const { authenticate, requireSuperAdmin } = require('../middleware/auth');
const {
  validate, contactRules, devisRules, devisStatutRules,
  loginRules, adminCreateRules, temoignageRules, newsletterRules, uuidParam
} = require('../middleware/validation');

// ============================================================
// 🌐 ROUTES PUBLIQUES
// ============================================================

// Santé de l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Deslud Plomberie API - Opérationnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});



// Informations de la société
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      nom: 'Deslud Plomberie',
      slogan: 'Votre Confort, Notre Expertise',
      description: 'Un service de plomberie rapide, propre et efficace.',
      adresse: 'Yaoundé, Cameroun',
      zone_intervention: 'Yaoundé et tout le Cameroun',
      telephones: [
        { numero: '683 90 62 25', label: 'Principal' },
        { numero: '658 51 87 88', label: 'Secondaire' }
      ],
      email: 'ludovicnono83@gmail.com',
      services: ['Installation sanitaire', 'Entretien & maintenance', 'Dépannage rapide', 'Réparation de tuyauterie'],
      horaires: {
        semaine: '07h00 - 17h30',
        weekend: '08h00 - 16h00',
        urgences: '24h/24, 6j/7'
      }
    }
  });
});

// --- Contacts publics ---
router.post('/contact', contactRules, validate, createContact);

// --- Devis publics ---
router.post('/devis', devisRules, validate, createDevis);
router.get('/devis/suivi/:reference', suiviDevis);

// --- Services publics ---
router.get('/services', getAllServices);
router.get('/services/:slug', getServiceBySlug);

// --- Témoignages publics ---
router.get('/temoignages', getAllTemoignages);
router.post('/temoignages', temoignageRules, validate, createTemoignage);

// --- Newsletter ---
router.post('/newsletter', newsletterRules, validate, subscribeNewsletter);


// ── Actualités (public) ──
router.get('/actualites', (req, res, next) => {
  try {
    const db = getDb();
    const items = db.prepare(`
      SELECT * FROM actualites
      WHERE actif = 1
      ORDER BY created_at DESC
      LIMIT 20
    `).all();
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
});
// ============================================================
// 🔐 ROUTES ADMIN — Authentification
// ============================================================

router.post('/admin/auth/login', loginRules, validate, login);
router.post('/admin/auth/logout', authenticate, logout);
router.get('/admin/auth/me', authenticate, getMe);
router.post('/admin/auth/change-password', authenticate, changePassword);

// ============================================================
// 🔒 ROUTES ADMIN — Tableau de bord
// ============================================================

router.get('/admin/dashboard', authenticate, getDashboard);
router.get('/admin/logs', authenticate, requireSuperAdmin, getLogs);

// ============================================================
// 🔒 ROUTES ADMIN — Contacts
// ============================================================

router.get('/admin/contacts', authenticate, getAllContacts);
router.get('/admin/contacts/stats', authenticate, getContactStats);
router.get('/admin/contacts/:id', authenticate, uuidParam('id'), validate, getContactById);
router.patch('/admin/contacts/:id/statut', authenticate, uuidParam('id'), validate, updateContactStatut);
router.delete('/admin/contacts/:id', authenticate, uuidParam('id'), validate, deleteContact);

// ============================================================
// 🔒 ROUTES ADMIN — Devis
// ============================================================

router.get('/admin/devis', authenticate, getAllDevis);
router.get('/admin/devis/stats', authenticate, getDevisStats);
router.get('/admin/devis/:id', authenticate, uuidParam('id'), validate, getDevisById);
router.patch('/admin/devis/:id/statut', authenticate, uuidParam('id'), validate, devisStatutRules, validate, updateDevisStatut);
router.post('/admin/devis/:id/intervention', authenticate, uuidParam('id'), validate, addIntervention);

// ============================================================
// 🔒 ROUTES ADMIN — Services
// ============================================================

router.post('/admin/services', authenticate, createService);
router.put('/admin/services/:id', authenticate, uuidParam('id'), validate, updateService);
router.delete('/admin/services/:id', authenticate, uuidParam('id'), validate, deleteService);

// ============================================================
// 🔒 ROUTES ADMIN — Témoignages
// ============================================================

router.get('/admin/temoignages', authenticate, getAllTemoignagesAdmin);
router.patch('/admin/temoignages/:id/valider', authenticate, uuidParam('id'), validate, validerTemoignage);


// ── Actualités (admin) ──

// GET — liste toutes
router.get('/admin/actualites', authenticate, (req, res, next) => {
  try {
    const db = getDb();
    const items = db.prepare('SELECT * FROM actualites ORDER BY created_at DESC').all();
    res.json({ success: true, data: items });
  } catch (error) { next(error); }
});

// POST — créer
router.post('/admin/actualites', authenticate, (req, res, next) => {
  try {
    const { titre, texte, media_url, media_type, categorie } = req.body;
    if (!titre && !texte && !media_url) {
      return res.status(400).json({ success: false, message: 'Au moins un titre, texte ou média est requis.' });
    }
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    db.prepare(`
      INSERT INTO actualites (id, titre, texte, media_url, media_type, categorie)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, titre || null, texte || null, media_url || null, media_type || 'texte', categorie || null);
    const item = db.prepare('SELECT * FROM actualites WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: item, message: 'Actualité publiée !' });
  } catch (error) { next(error); }
});

// PATCH — activer / désactiver
router.patch('/admin/actualites/:id/toggle', authenticate, (req, res, next) => {
  try {
    const db = getDb();
    const item = db.prepare('SELECT id, actif FROM actualites WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Actualité non trouvée.' });
    const newActif = item.actif ? 0 : 1;
    db.prepare('UPDATE actualites SET actif = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newActif, item.id);
    res.json({ success: true, message: newActif ? 'Actualité publiée.' : 'Actualité masquée.' });
  } catch (error) { next(error); }
});

// DELETE — supprimer définitivement
router.delete('/admin/actualites/:id', authenticate, (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM actualites WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Actualité non trouvée.' });
    res.json({ success: true, message: 'Actualité supprimée.' });
  } catch (error) { next(error); }
});
// ============================================================
// 🔒 ROUTES ADMIN — Gestion des utilisateurs (super_admin)
// ============================================================

router.get('/admin/users', authenticate, requireSuperAdmin, getAllUsers);
router.post('/admin/users', authenticate, requireSuperAdmin, adminCreateRules, validate, createUser);
router.patch('/admin/users/:id/toggle', authenticate, requireSuperAdmin, uuidParam('id'), validate, toggleUser);

module.exports = router;
