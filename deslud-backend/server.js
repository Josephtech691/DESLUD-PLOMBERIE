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

const startServer = () => {
  try {
    // Initialiser la base de données
    initializeSchema();
    console.log('✅ Base de données initialisée');

    app.listen(PORT, () => {
      console.log('\n══════════════════════════════════════════════════');
      console.log('   💧 DESLUD PLOMBERIE — API Backend');
      console.log('══════════════════════════════════════════════════');
      console.log(`   🌐 URL:        http://localhost:${PORT}`);
      console.log(`   📌 Env:        ${process.env.NODE_ENV || 'development'}`);
      console.log(`   📋 Health:     http://localhost:${PORT}/api/health`);
      console.log(`   📊 Dashboard:  http://localhost:${PORT}/api/admin/dashboard`);
      console.log('══════════════════════════════════════════════════');
      console.log('\n⚠️  Pour initialiser la DB avec des données:');
      console.log('   cd config && node initDb.js\n');
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
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
