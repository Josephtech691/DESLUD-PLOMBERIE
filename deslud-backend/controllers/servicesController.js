// controllers/servicesController.js
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');

// GET /api/services — Liste tous les services actifs (public)
const getAllServices = (req, res, next) => {
  try {
    const db = getDb();
    const services = db.prepare(`
      SELECT * FROM services WHERE actif = 1 ORDER BY ordre ASC
    `).all();

    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

// GET /api/services/:slug — Détails d'un service par slug (public)
const getServiceBySlug = (req, res, next) => {
  try {
    const db = getDb();
    const service = db.prepare('SELECT * FROM services WHERE slug = ? AND actif = 1').get(req.params.slug);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé.' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/services — Créer un service (admin)
const createService = (req, res, next) => {
  try {
    const { nom, slug, description, description_courte, icone, image_url, prix_a_partir, ordre } = req.body;
    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO services (id, nom, slug, description, description_courte, icone, image_url, prix_a_partir, ordre)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, nom, slug, description, description_courte || null, icone || null,
      image_url || null, prix_a_partir || null, ordre || 0);

    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/services/:id — Modifier un service (admin)
const updateService = (req, res, next) => {
  try {
    const { nom, description, description_courte, icone, image_url, prix_a_partir, actif, ordre } = req.body;
    const db = getDb();

    const service = db.prepare('SELECT id FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service non trouvé.' });
    }

    db.prepare(`
      UPDATE services SET
        nom = COALESCE(?, nom),
        description = COALESCE(?, description),
        description_courte = COALESCE(?, description_courte),
        icone = COALESCE(?, icone),
        image_url = COALESCE(?, image_url),
        prix_a_partir = COALESCE(?, prix_a_partir),
        actif = COALESCE(?, actif),
        ordre = COALESCE(?, ordre),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nom, description, description_courte, icone, image_url, prix_a_partir, actif, ordre, req.params.id);

    res.json({ success: true, message: 'Service mis à jour.' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/services/:id — Désactiver un service (soft delete)
const deleteService = (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare('UPDATE services SET actif = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Service non trouvé.' });
    }

    res.json({ success: true, message: 'Service désactivé.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/temoignages — Liste des témoignages validés (public)
const getAllTemoignages = (req, res, next) => {
  try {
    const db = getDb();
    const temoignages = db.prepare(`
      SELECT * FROM temoignages WHERE valide = 1 ORDER BY created_at DESC LIMIT 20
    `).all();

    const moyenne = db.prepare('SELECT AVG(note) as moyenne FROM temoignages WHERE valide = 1').get().moyenne;

    res.json({
      success: true,
      data: temoignages,
      meta: { moyenne: moyenne ? parseFloat(moyenne.toFixed(1)) : 0, total: temoignages.length }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/temoignages — Soumettre un témoignage (public)
const createTemoignage = (req, res, next) => {
  try {
    const { nom_client, quartier, note, commentaire, service_type } = req.body;
    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO temoignages (id, nom_client, quartier, note, commentaire, service_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, nom_client, quartier || null, parseInt(note), commentaire, service_type || null);

    res.status(201).json({
      success: true,
      message: 'Merci pour votre avis ! Il sera publié après validation par notre équipe.'
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/temoignages/:id/valider — Valider un témoignage
const validerTemoignage = (req, res, next) => {
  try {
    const db = getDb();
    const result = db.prepare('UPDATE temoignages SET valide = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Témoignage non trouvé.' });
    }

    res.json({ success: true, message: 'Témoignage validé et publié.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/temoignages — Tous les témoignages (admin)
const getAllTemoignagesAdmin = (req, res, next) => {
  try {
    const db = getDb();
    const { valide } = req.query;
    let query = 'SELECT * FROM temoignages';
    const params = [];

    if (valide !== undefined) {
      query += ' WHERE valide = ?';
      params.push(parseInt(valide));
    }

    query += ' ORDER BY created_at DESC';
    const temoignages = db.prepare(query).all(...params);

    res.json({ success: true, data: temoignages });
  } catch (error) {
    next(error);
  }
};

// POST /api/newsletter — S'abonner à la newsletter
const subscribeNewsletter = (req, res, next) => {
  try {
    const { email } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT id, actif FROM newsletter WHERE email = ?').get(email);
    if (existing) {
      if (existing.actif) {
        return res.json({ success: true, message: 'Vous êtes déjà abonné à notre newsletter.' });
      }
      db.prepare('UPDATE newsletter SET actif = 1 WHERE email = ?').run(email);
      return res.json({ success: true, message: 'Abonnement réactivé avec succès !' });
    }

    db.prepare('INSERT INTO newsletter (id, email) VALUES (?, ?)').run(uuidv4(), email);
    res.status(201).json({
      success: true,
      message: 'Merci pour votre abonnement ! Vous recevrez nos actualités et offres.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getAllTemoignages,
  createTemoignage,
  validerTemoignage,
  getAllTemoignagesAdmin,
  subscribeNewsletter
};
