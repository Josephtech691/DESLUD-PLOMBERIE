// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { query } = require('../config/database');

// POST /api/admin/auth/login — Connexion admin
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
    }

    // Sélectionner explicitement le champ password
    const result = await query(
      'SELECT id, nom, email, password, role, actif FROM users WHERE email=$1',
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    if (!user.actif) {
      return res.status(401).json({ success: false, message: 'Compte désactivé.' });
    }

    if (!user.password) {
      return res.status(500).json({ success: false, message: 'Erreur compte : mot de passe manquant.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await query(
      `INSERT INTO logs (id, action, entite, user_id, ip_address) VALUES ($1, 'LOGIN', 'users', $2, $3)`,
      [uuidv4(), user.id, req.ip]
    );

    res.json({
      success: true,
      message: `Bienvenue, ${user.nom} !`,
      data: {
        token,
        user: { id: user.id, nom: user.nom, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/auth/logout — Déconnexion (log uniquement)
const logout = (req, res, next) => {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO logs (id, action, entite, user_id, ip_address)
      VALUES (?, 'LOGOUT', 'users', ?, ?)
    `).run(uuidv4(), req.user.id, req.ip);

    res.json({ success: true, message: 'Déconnexion réussie.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/auth/me — Profil de l'admin connecté
const getMe = (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

// POST /api/admin/auth/change-password — Changer le mot de passe
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const isValid = await bcrypt.compare(current_password, user.password);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect.'
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(hashedPassword, req.user.id);

    res.json({ success: true, message: 'Mot de passe changé avec succès.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users — Liste des admins (super_admin seulement)
const getAllUsers = (req, res, next) => {
  try {
    const db = getDb();
    const users = db.prepare('SELECT id, nom, email, role, actif, created_at FROM users ORDER BY created_at DESC').all();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users — Créer un admin (super_admin seulement)
const createUser = async (req, res, next) => {
  try {
    const { nom, email, password, role } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Un utilisateur avec cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();

    db.prepare(`
      INSERT INTO users (id, nom, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, nom, email, hashedPassword, role || 'admin');

    const newUser = db.prepare('SELECT id, nom, email, role, actif, created_at FROM users WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/toggle — Activer/Désactiver un admin
const toggleUser = (req, res, next) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, actif FROM users WHERE id = ?').get(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas désactiver votre propre compte.' });
    }

    const newActif = user.actif ? 0 : 1;
    db.prepare('UPDATE users SET actif = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newActif, user.id);

    res.json({
      success: true,
      message: newActif ? 'Utilisateur activé.' : 'Utilisateur désactivé.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/dashboard — Tableau de bord général
const getDashboard = (req, res, next) => {
  try {
    const db = getDb();

    const dashboard = {
      // Contacts
      contacts: {
        total: db.prepare('SELECT COUNT(*) as c FROM contacts').get().c,
        nouveaux: db.prepare("SELECT COUNT(*) as c FROM contacts WHERE statut = 'nouveau'").get().c,
        ce_mois: db.prepare("SELECT COUNT(*) as c FROM contacts WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().c
      },
      // Devis
      devis: {
        total: db.prepare('SELECT COUNT(*) as c FROM devis').get().c,
        en_attente: db.prepare("SELECT COUNT(*) as c FROM devis WHERE statut = 'en_attente'").get().c,
        urgents: db.prepare("SELECT COUNT(*) as c FROM devis WHERE urgence IN ('urgent', 'tres_urgent') AND statut NOT IN ('refuse', 'termine')").get().c,
        ce_mois: db.prepare("SELECT COUNT(*) as c FROM devis WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().c,
        termine: db.prepare("SELECT COUNT(*) as c FROM devis WHERE statut = 'termine'").get().c
      },
      // Finances (interventions)
      finances: {
        ca_total: db.prepare("SELECT COALESCE(SUM(cout_total), 0) as t FROM interventions WHERE statut = 'termine'").get().t,
        ca_mois: db.prepare("SELECT COALESCE(SUM(cout_total), 0) as t FROM interventions WHERE statut = 'termine' AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().t,
        interventions_total: db.prepare('SELECT COUNT(*) as c FROM interventions').get().c
      },
      // Satisfaction
      satisfaction: {
        note_moyenne: db.prepare('SELECT ROUND(AVG(satisfaction_client), 1) as m FROM interventions WHERE satisfaction_client IS NOT NULL').get().m,
        temoignages_en_attente: db.prepare('SELECT COUNT(*) as c FROM temoignages WHERE valide = 0').get().c
      },
      // Dernières activités
      derniers_devis: db.prepare(`
        SELECT reference, nom, type_service, urgence, statut, created_at
        FROM devis ORDER BY created_at DESC LIMIT 5
      `).all(),
      derniers_contacts: db.prepare(`
        SELECT id, nom, telephone, sujet, statut, created_at
        FROM contacts ORDER BY created_at DESC LIMIT 5
      `).all(),
      // Répartition par service
      repartition_services: db.prepare(`
        SELECT type_service, COUNT(*) as count FROM devis GROUP BY type_service ORDER BY count DESC
      `).all()
    };

    res.json({ success: true, data: dashboard });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/logs — Journal des actions
const getLogs = (req, res, next) => {
  try {
    const db = getDb();
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const total = db.prepare('SELECT COUNT(*) as count FROM logs').get().count;
    const logs = db.prepare(`
      SELECT l.*, u.nom as user_nom FROM logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?
    `).all(parseInt(limit), offset);

    res.json({
      success: true,
      data: logs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  changePassword,
  getAllUsers,
  createUser,
  toggleUser,
  getDashboard,
  getLogs
};
