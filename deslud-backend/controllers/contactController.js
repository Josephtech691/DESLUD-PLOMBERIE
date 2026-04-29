// controllers/contactController.js
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { sendContactConfirmation, sendContactNotification } = require('../utils/mailer');

// POST /api/contact — Créer un nouveau message de contact
const createContact = async (req, res, next) => {
  try {
    const { nom, prenom, email, telephone, sujet, message } = req.body;
    const db = getDb();

    const id = uuidv4();
    const ip_address = req.ip || req.connection.remoteAddress;

    db.prepare(`
      INSERT INTO contacts (id, nom, prenom, email, telephone, sujet, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, nom, prenom || null, email || null, telephone, sujet || null, message, ip_address);

    const newContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);

    // Envoi des emails (non bloquant)
    if (email) {
      sendContactConfirmation(newContact).catch(err =>
        console.error('⚠️ Email confirmation non envoyé:', err.message)
      );
    }
    sendContactNotification(newContact).catch(err =>
      console.error('⚠️ Email notification non envoyé:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons dans les 24h.',
      data: { id: newContact.id, created_at: newContact.created_at }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/contacts — Liste des contacts (admin)
const getAllContacts = (req, res, next) => {
  try {
    const db = getDb();
    const { statut, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = '';
    const params = [];

    if (statut) {
      whereClause = 'WHERE statut = ?';
      params.push(statut);
    }

    const total = db.prepare(`SELECT COUNT(*) as count FROM contacts ${whereClause}`).get(...params).count;
    const contacts = db.prepare(`
      SELECT * FROM contacts ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/contacts/:id — Détails d'un contact
const getContactById = (req, res, next) => {
  try {
    const db = getDb();
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact non trouvé.' });
    }

    // Marquer comme lu si nouveau
    if (contact.statut === 'nouveau') {
      db.prepare("UPDATE contacts SET statut = 'lu', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(contact.id);
      contact.statut = 'lu';
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/contacts/:id/statut — Mettre à jour le statut
const updateContactStatut = (req, res, next) => {
  try {
    const { statut } = req.body;
    const db = getDb();

    const contact = db.prepare('SELECT id FROM contacts WHERE id = ?').get(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact non trouvé.' });
    }

    db.prepare(`
      UPDATE contacts SET statut = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(statut, req.params.id);

    res.json({ success: true, message: 'Statut mis à jour.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/contacts/:id — Supprimer un contact
const deleteContact = (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Contact non trouvé.' });
    }

    res.json({ success: true, message: 'Contact supprimé.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/contacts/stats — Statistiques des contacts
const getContactStats = (req, res, next) => {
  try {
    const db = getDb();

    const stats = {
      total: db.prepare('SELECT COUNT(*) as c FROM contacts').get().c,
      nouveau: db.prepare("SELECT COUNT(*) as c FROM contacts WHERE statut = 'nouveau'").get().c,
      lu: db.prepare("SELECT COUNT(*) as c FROM contacts WHERE statut = 'lu'").get().c,
      traite: db.prepare("SELECT COUNT(*) as c FROM contacts WHERE statut = 'traite'").get().c,
      ce_mois: db.prepare("SELECT COUNT(*) as c FROM contacts WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().c,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatut,
  deleteContact,
  getContactStats
};
