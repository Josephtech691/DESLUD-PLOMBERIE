// server.js — Deslud Plomberie Backend
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { initializeSchema } = require('./config/database');
const routes = require('./routes/index');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT;

// ============================================================
// 🛡️ SÉCURITÉ
// ============================================================

// Headers de sécurité HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS — Origines autorisées
const allowedOrigins = (process.env.ALLOWED_ORIGINS).split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (ex: Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origine non autorisée par CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ============================================================
// 🚦 RATE LIMITING
// ============================================================

// Limite globale : 100 req/15min par IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Limite stricte pour les formulaires publics : 10 req/15min
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Trop de soumissions. Veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Limite pour la connexion : 5 tentatives/15min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', globalLimiter);
app.use('/api/contact', formLimiter);
app.use('/api/devis', formLimiter);
app.use('/api/admin/auth/login', loginLimiter);

// ============================================================
// 📝 MIDDLEWARES
// ============================================================

// Parser JSON avec limite de taille
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Logging HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Confiance au proxy (pour rate limiter en prod)
app.set('trust proxy', 1);

// ============================================================
// 🚀 ROUTES
// ============================================================

app.use('/api', routes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '💧 Deslud Plomberie API',
    version: '1.0.0',
    docs: '/api/health',
    contact: 'ludovicnono83@gmail.com'
  });
});

// ============================================================
// ❌ GESTION DES ERREURS
// ============================================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================
// ▶️ DÉMARRAGE
// ============================================================
// ── Auto-initialisation des données de base ──────────────────
const autoSeed = async () => {
  const { query } = require('./config/database');
  const bcrypt = require('bcryptjs');
  const { v4: uuidv4 } = require('uuid');

  // Admin
  const adminEmail    = process.env.ADMIN_EMAIL ;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existingAdmin = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (existingAdmin.rows.length === 0) {
    const hashed = bcrypt.hashSync(adminPassword, 12);
    await query(
      'INSERT INTO users (id, nom, email, password, role, actif) VALUES ($1,$2,$3,$4,$5,$6)',
      [uuidv4(), 'Super Admin', adminEmail, hashed, 'super_admin', 1]
    );
    console.log('✅ Admin créé:', adminEmail);
  }

  // Services
  const services = [
    { nom: 'Installation Sanitaire',  slug: 'installation-sanitaire', description: 'Installation complète de vos équipements sanitaires.', prix: 15000, ordre: 1 },
    { nom: 'Entretien & Maintenance', slug: 'entretien-maintenance',  description: 'Entretien régulier et maintenance préventive.',        prix: 10000, ordre: 2 },
    { nom: 'Dépannage Rapide',        slug: 'depannage-rapide',       description: 'Intervention d\'urgence 7j/7.',                       prix: 5000,  ordre: 3 },
    { nom: 'Dépannage de Fuites',     slug: 'depannage-fuites',       description: 'Détection et réparation de fuites.',                  prix: 8000,  ordre: 4 },
    { nom: 'Réparation Tuyauterie',   slug: 'reparation-tuyauterie',  description: 'Réparation de tous types de tuyaux.',                 prix: 12000, ordre: 5 },
  ];

  for (const s of services) {
    await query(
      'INSERT INTO services (id, nom, slug, description, prix_a_partir, actif, ordre) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (slug) DO NOTHING',
      [uuidv4(), s.nom, s.slug, s.description, s.prix, 1, s.ordre]
    );
  }

  // Témoignages
  const temoignages = [
    { nom: 'Marie Atangana',    quartier: 'Bastos',   note: 5, commentaire: 'Service impeccable !',                         service: 'depannage_rapide' },
    { nom: 'Paul Mbarga',       quartier: 'Nlongkak', note: 5, commentaire: 'Excellente prestation pour mon installation.', service: 'installation'     },
    { nom: 'Sophie Ngo Biyong', quartier: 'Melen',    note: 4, commentaire: 'Très bon service, intervention rapide.',       service: 'depannage_rapide' },
  ];

  for (const t of temoignages) {
    const ex = await query('SELECT id FROM temoignages WHERE nom_client = $1', [t.nom]);
    if (ex.rows.length === 0) {
      await query(
        'INSERT INTO temoignages (id, nom_client, quartier, note, commentaire, service_type, valide) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [uuidv4(), t.nom, t.quartier, t.note, t.commentaire, t.service, 1]
      );
    }
  }
};
const startServer = async () => {
  try {
    await initializeSchema();
    console.log('✅ Schéma base de données OK');

    await autoSeed();
    console.log('✅ Données initiales OK');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer:', error);
    process.exit(1);
  }
};
// Gestion des erreurs non catchées
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Arrêt propre
process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

startServer();

module.exports = app;
