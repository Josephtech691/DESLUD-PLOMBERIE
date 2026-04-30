// routes/index.js
const express = require('express');
const router = express.Router();

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


// Route d'initialisation (à supprimer après utilisation)
router.get('/setup', (req, res) => {
  const secretKey = req.query.key;

  // Clé secrète pour sécuriser la route
  if (secretKey !== 'deslud-init-2024') {
    return res.status(403).json({ success: false, message: 'Accès refusé.' });
  }

  try {
    const { getDb } = require('../config/database');
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');
    const db = getDb();

    // Créer l'admin
    const adminEmail = 'admin@deslud-plomberie.cm';
    const adminPassword = 'Admin@Deslud2024!';
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

    if (!existing) {
      const hashed = bcrypt.hashSync(adminPassword, 12);
      db.prepare(`
        INSERT INTO users (id, nom, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `).run(uuidv4(), 'Super Admin', adminEmail, hashed, 'super_admin');
    }

    // Créer les services
    const services = [
      { nom: 'Installation Sanitaire', slug: 'installation-sanitaire', description: 'Installation complète de vos équipements sanitaires.', prix_a_partir: 15000, ordre: 1 },
      { nom: 'Entretien & Maintenance', slug: 'entretien-maintenance', description: 'Entretien régulier et maintenance préventive.', prix_a_partir: 10000, ordre: 2 },
      { nom: 'Dépannage Rapide', slug: 'depannage-rapide', description: 'Intervention d\'urgence 7j/7.', prix_a_partir: 5000, ordre: 3 },
      { nom: 'Dépannage de Fuites', slug: 'depannage-fuites', description: 'Détection et réparation de fuites.', prix_a_partir: 8000, ordre: 4 },
      { nom: 'Réparation Tuyauterie', slug: 'reparation-tuyauterie', description: 'Réparation de tous types de tuyaux.', prix_a_partir: 12000, ordre: 5 },
    ];

    services.forEach(s => {
      db.prepare(`
        INSERT OR IGNORE INTO services (id, nom, slug, description, prix_a_partir, actif, ordre)
        VALUES (?, ?, ?, ?, ?, 1, ?)
      `).run(uuidv4(), s.nom, s.slug, s.description, s.prix_a_partir, s.ordre);
    });

    // Créer les témoignages
    const temoignages = [
      { nom: 'Marie Atangana', quartier: 'Bastos', note: 5, commentaire: 'Service impeccable ! Travail propre et soigné.', service: 'depannage_rapide' },
      { nom: 'Paul Mbarga', quartier: 'Nlongkak', note: 5, commentaire: 'Excellente prestation pour l\'installation de ma salle de bain.', service: 'installation' },
      { nom: 'Sophie Ngo Biyong', quartier: 'Melen', note: 4, commentaire: 'Très bon service, intervention rapide le dimanche.', service: 'depannage_rapide' },
    ];

    temoignages.forEach(t => {
      db.prepare(`
        INSERT OR IGNORE INTO temoignages (id, nom_client, quartier, note, commentaire, service_type, valide)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `).run(uuidv4(), t.nom, t.quartier, t.note, t.commentaire, t.service);
    });

    res.json({
      success: true,
      message: '🎉 Base de données initialisée avec succès !',
      admin: {
        email: adminEmail,
        password: adminPassword,
        note: '⚠️ Changez le mot de passe après connexion !'
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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

// ============================================================
// 🔒 ROUTES ADMIN — Gestion des utilisateurs (super_admin)
// ============================================================

router.get('/admin/users', authenticate, requireSuperAdmin, getAllUsers);
router.post('/admin/users', authenticate, requireSuperAdmin, adminCreateRules, validate, createUser);
router.patch('/admin/users/:id/toggle', authenticate, requireSuperAdmin, uuidParam('id'), validate, toggleUser);

module.exports = router;
