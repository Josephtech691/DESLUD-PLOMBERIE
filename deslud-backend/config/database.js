// config/database.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../database');
const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'deslud.db');

// Créer le dossier database s'il n'existe pas
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db;

const getDb = () => {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
};
const initializeSchema = () => {
  const database = getDb();

  // Table: utilisateurs (admins)
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'super_admin')),
      actif INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table: contacts (messages du formulaire de contact)
  database.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT,
      email TEXT,
      telephone TEXT NOT NULL,
      sujet TEXT,
      message TEXT NOT NULL,
      statut TEXT DEFAULT 'nouveau' CHECK(statut IN ('nouveau', 'lu', 'traite', 'archive')),
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table: devis (demandes de devis)
  database.exec(`
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
      type_service TEXT NOT NULL CHECK(type_service IN ('installation', 'entretien', 'depannage_rapide', 'autre')),
      description TEXT NOT NULL,
      urgence TEXT DEFAULT 'normal' CHECK(urgence IN ('normal', 'urgent', 'tres_urgent')),
      disponibilite TEXT,
      budget_estime TEXT,
      statut TEXT DEFAULT 'en_attente' CHECK(statut IN ('en_attente', 'en_cours', 'devis_envoye', 'accepte', 'refuse', 'termine')),
      montant_devis REAL,
      notes_admin TEXT,
      admin_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id)
    )
  `);

  // Table: interventions (suivi des interventions)
  database.exec(`
    CREATE TABLE IF NOT EXISTS interventions (
      id TEXT PRIMARY KEY,
      devis_id TEXT,
      technicien TEXT,
      date_intervention DATETIME,
      duree_heures REAL,
      description_travaux TEXT,
      materiel_utilise TEXT,
      cout_main_oeuvre REAL,
      cout_materiel REAL,
      cout_total REAL,
      statut TEXT DEFAULT 'planifie' CHECK(statut IN ('planifie', 'en_cours', 'termine', 'annule')),
      rapport TEXT,
      satisfaction_client INTEGER CHECK(satisfaction_client BETWEEN 1 AND 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (devis_id) REFERENCES devis(id)
    )
  `);

  // Table: services (services proposés)
  database.exec(`
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table: temoignages (avis clients)
  database.exec(`
    CREATE TABLE IF NOT EXISTS temoignages (
      id TEXT PRIMARY KEY,
      nom_client TEXT NOT NULL,
      quartier TEXT,
      note INTEGER NOT NULL CHECK(note BETWEEN 1 AND 5),
      commentaire TEXT NOT NULL,
      service_type TEXT,
      valide INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table: newsletter / abonnés
  database.exec(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      actif INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table: logs (journal des actions)
  database.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entite TEXT,
      entite_id TEXT,
      user_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Schema de base de données initialisé avec succès');
};

module.exports = { getDb, initializeSchema };
