// controllers/devisController.js
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const { sendDevisConfirmation, sendDevisNotification } = require('../utils/mailer');


// Générer une référence unique pour un devis
const generateReference = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `DV${year}${month}-${random}`;
};

// POST /api/devis — Créer une demande de devis
const createDevis = async (req, res, next) => {
  try {
    const {
      nom, prenom, email, telephone, adresse, quartier, ville,
      type_service, description, urgence, disponibilite, budget_estime
    } = req.body;

    const db = getDb();
    const id = uuidv4();
    let reference = generateReference();

    // S'assurer que la référence est unique
    while (db.prepare('SELECT id FROM devis WHERE reference = ?').get(reference)) {
      reference = generateReference();
    }

    db.prepare(`
      INSERT INTO devis (id, reference, nom, prenom, email, telephone, adresse, quartier, ville,
        type_service, description, urgence, disponibilite, budget_estime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, reference, nom, prenom || null, email || null, telephone,
      adresse || null, quartier || null, ville || 'Yaoundé',
      type_service, description, urgence || 'normal',
      disponibilite || null, budget_estime || null
    );

    const newDevis = db.prepare('SELECT * FROM devis WHERE id = ?').get(id);

    // Envoi des emails (non bloquant)
    if (email) {
      sendDevisConfirmation(newDevis).catch(err =>
        console.error('⚠️ Email devis confirmation non envoyé:', err.message)
      );
    }
    sendDevisNotification(newDevis).catch(err =>
      console.error('⚠️ Email devis notification non envoyé:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Votre demande de devis a été enregistrée. Nous vous contacterons très rapidement.',
      data: {
        id: newDevis.id,
        reference: newDevis.reference,
        created_at: newDevis.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/devis/suivi/:reference — Suivi public d'un devis par référence
const suiviDevis = (req, res, next) => {
  try {
    const db = getDb();
    const devis = db.prepare(`
      SELECT reference, type_service, urgence, statut, created_at, updated_at
      FROM devis WHERE reference = ?
    `).get(req.params.reference.toUpperCase());

    if (!devis) {
      return res.status(404).json({
        success: false,
        message: 'Aucun devis trouvé avec cette référence.'
      });
    }

    const statutLabels = {
      en_attente: 'En attente de traitement',
      en_cours: 'En cours de traitement',
      devis_envoye: 'Devis envoyé',
      accepte: 'Devis accepté',
      refuse: 'Devis refusé',
      termine: 'Intervention terminée'
    };

    res.json({
      success: true,
      data: {
        ...devis,
        statut_label: statutLabels[devis.statut] || devis.statut
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/devis — Liste tous les devis (admin)
const getAllDevis = (req, res, next) => {
  try {
    const db = getDb();
    const { statut, type_service, urgence, page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const conditions = [];
    const params = [];

    if (statut) { conditions.push('d.statut = ?'); params.push(statut); }
    if (type_service) { conditions.push('d.type_service = ?'); params.push(type_service); }
    if (urgence) { conditions.push('d.urgence = ?'); params.push(urgence); }
    if (search) {
      conditions.push('(d.nom LIKE ? OR d.telephone LIKE ? OR d.reference LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const total = db.prepare(`SELECT COUNT(*) as count FROM devis d ${whereClause}`).get(...params).count;
    const devisList = db.prepare(`
      SELECT d.*, u.nom as admin_nom
      FROM devis d
      LEFT JOIN users u ON d.admin_id = u.id
      ${whereClause}
      ORDER BY 
        CASE d.urgence WHEN 'tres_urgent' THEN 1 WHEN 'urgent' THEN 2 ELSE 3 END,
        d.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      success: true,
      data: devisList,
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

// GET /api/admin/devis/:id — Détails d'un devis
const getDevisById = (req, res, next) => {
  try {
    const db = getDb();
    const devis = db.prepare(`
      SELECT d.*, u.nom as admin_nom,
        (SELECT json_group_array(json_object(
          'id', i.id, 'technicien', i.technicien, 'date_intervention', i.date_intervention,
          'duree_heures', i.duree_heures, 'cout_total', i.cout_total, 'statut', i.statut,
          'rapport', i.rapport
        )) FROM interventions i WHERE i.devis_id = d.id) as interventions
      FROM devis d
      LEFT JOIN users u ON d.admin_id = u.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!devis) {
      return res.status(404).json({ success: false, message: 'Devis non trouvé.' });
    }

    // Parser les interventions JSON
    try {
      devis.interventions = JSON.parse(devis.interventions || '[]');
    } catch {
      devis.interventions = [];
    }

    res.json({ success: true, data: devis });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/devis/:id/statut — Mettre à jour le statut d'un devis
const updateDevisStatut = (req, res, next) => {
  try {
    const { statut, montant_devis, notes_admin } = req.body;
    const db = getDb();

    const devis = db.prepare('SELECT id FROM devis WHERE id = ?').get(req.params.id);
    if (!devis) {
      return res.status(404).json({ success: false, message: 'Devis non trouvé.' });
    }

    db.prepare(`
      UPDATE devis SET
        statut = ?,
        montant_devis = COALESCE(?, montant_devis),
        notes_admin = COALESCE(?, notes_admin),
        admin_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(statut, montant_devis || null, notes_admin || null, req.user.id, req.params.id);

    res.json({ success: true, message: 'Devis mis à jour avec succès.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/devis/:id/intervention — Ajouter une intervention
const addIntervention = (req, res, next) => {
  try {
    const {
      technicien, date_intervention, duree_heures, description_travaux,
      materiel_utilise, cout_main_oeuvre, cout_materiel, rapport, satisfaction_client
    } = req.body;

    const db = getDb();
    const devis = db.prepare('SELECT id FROM devis WHERE id = ?').get(req.params.id);
    if (!devis) {
      return res.status(404).json({ success: false, message: 'Devis non trouvé.' });
    }

    const cout_total = (parseFloat(cout_main_oeuvre) || 0) + (parseFloat(cout_materiel) || 0);
    const id = uuidv4();

    db.prepare(`
      INSERT INTO interventions (id, devis_id, technicien, date_intervention, duree_heures,
        description_travaux, materiel_utilise, cout_main_oeuvre, cout_materiel, cout_total, rapport, satisfaction_client)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, req.params.id, technicien, date_intervention, duree_heures || null,
      description_travaux, materiel_utilise || null,
      cout_main_oeuvre || 0, cout_materiel || 0, cout_total, rapport || null,
      satisfaction_client || null
    );

    // Mettre le devis en "termine" si l'intervention est enregistrée
    db.prepare("UPDATE devis SET statut = 'termine', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(req.params.id);

    res.status(201).json({
      success: true,
      message: 'Intervention enregistrée avec succès.',
      data: { id, cout_total }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/devis/stats — Statistiques des devis
const getDevisStats = (req, res, next) => {
  try {
    const db = getDb();

    const stats = {
      total: db.prepare('SELECT COUNT(*) as c FROM devis').get().c,
      en_attente: db.prepare("SELECT COUNT(*) as c FROM devis WHERE statut = 'en_attente'").get().c,
      en_cours: db.prepare("SELECT COUNT(*) as c FROM devis WHERE statut = 'en_cours'").get().c,
      termine: db.prepare("SELECT COUNT(*) as c FROM devis WHERE statut = 'termine'").get().c,
      urgents: db.prepare("SELECT COUNT(*) as c FROM devis WHERE urgence IN ('urgent', 'tres_urgent') AND statut NOT IN ('refuse', 'termine')").get().c,
      ce_mois: db.prepare("SELECT COUNT(*) as c FROM devis WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().c,
      ca_mois: db.prepare("SELECT COALESCE(SUM(cout_total), 0) as total FROM interventions WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')").get().total,
      par_service: db.prepare(`
        SELECT type_service, COUNT(*) as count FROM devis GROUP BY type_service
      `).all()
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDevis,
  suiviDevis,
  getAllDevis,
  getDevisById,
  updateDevisStatut,
  addIntervention,
  getDevisStats
};
