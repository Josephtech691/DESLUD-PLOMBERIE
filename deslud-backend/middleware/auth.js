// middleware/auth.js
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token manquant.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDb();
    const user = db.prepare('SELECT id, nom, email, role, actif FROM users WHERE id = ?').get(decoded.id);

    if (!user || !user.actif) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou désactivé.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expiré.' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux super administrateurs.'
    });
  }
  next();
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const db = getDb();
      req.user = db.prepare('SELECT id, nom, email, role FROM users WHERE id = ?').get(decoded.id);
    }
  } catch {
    // Token invalide, on continue sans auth
  }
  next();
};

module.exports = { authenticate, requireSuperAdmin, optionalAuth };
