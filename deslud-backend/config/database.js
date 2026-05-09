// config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const query = async (text, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

const initializeSchema = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      actif INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT,
      email TEXT,
      telephone TEXT NOT NULL,
      sujet TEXT,
      message TEXT NOT NULL,
      statut TEXT DEFAULT 'nouveau',
      ip_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS devis (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      nom TEXT NOT NULL,
      prenom TEXT,
      email TEXT,
      telephone TEXT NOT NULL,
      adresse TEXT,
      quartier TEXT,
      ville TEXT DEFAULT 'Yaoundé',
      type_service TEXT NOT NULL,
      description TEXT NOT NULL,
      urgence TEXT DEFAULT 'normal',
      disponibilite TEXT,
      budget_estime TEXT,
      statut TEXT DEFAULT 'en_attente',
      montant_devis REAL,
      notes_admin TEXT,
      admin_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS interventions (
      id TEXT PRIMARY KEY,
      devis_id TEXT,
      technicien TEXT,
      date_intervention TIMESTAMP,
      duree_heures REAL,
      description_travaux TEXT,
      materiel_utilise TEXT,
      cout_main_oeuvre REAL,
      cout_materiel REAL,
      cout_total REAL,
      statut TEXT DEFAULT 'planifie',
      rapport TEXT,
      satisfaction_client INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      description_courte TEXT,
      icone TEXT,
      image_url TEXT,
      prix_a_partir REAL,
      actif INTEGER DEFAULT 1,
      ordre INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS temoignages (
      id TEXT PRIMARY KEY,
      nom_client TEXT NOT NULL,
      quartier TEXT,
      note INTEGER NOT NULL,
      commentaire TEXT NOT NULL,
      service_type TEXT,
      valide INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      actif INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entite TEXT,
      entite_id TEXT,
      user_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS actualites (
      id TEXT PRIMARY KEY,
      titre TEXT,
      texte TEXT,
      media_url TEXT,
      media_type TEXT DEFAULT 'texte',
      categorie TEXT,
      actif INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Schéma PostgreSQL initialisé');
};

// ── Compatibilité avec l'ancien code SQLite ──────────────
// Permet d'utiliser db.prepare('...').get() / .all() / .run()
// sans modifier tous les controllers existants

const getDb = () => ({
  prepare: (text) => ({
    get: async (...params) => {
      const flat = params.flat();
      let i = 0;
      const pgText = text.replace(/\?/g, () => `$${++i}`);
      const r = await pool.query(pgText, flat);
      return r.rows[0] || null;
    },
    all: async (...params) => {
      const flat = params.flat();
      let i = 0;
      const pgText = text.replace(/\?/g, () => `$${++i}`);
      const r = await pool.query(pgText, flat);
      return r.rows;
    },
    run: async (...params) => {
      const flat = params.flat();
      let i = 0;
      const pgText = text.replace(/\?/g, () => `$${++i}`);
      const r = await pool.query(pgText, flat);
      return { changes: r.rowCount };
    },
  }),
  exec: async (text) => {
    await pool.query(text);
  },
});

module.exports = { query, initializeSchema, pool, getDb };
