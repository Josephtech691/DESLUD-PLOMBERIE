const jwt     = require('jsonwebtoken');
const { query } = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token manquant.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expirée. Reconnectez-vous.' });
      }
      return res.status(401).json({ success: false, message: 'Token invalide.' });
    }

    // Chercher l'utilisateur par ID
    const result = await query(
      'SELECT id, nom, email, role, actif FROM users WHERE id = $1',
      [decoded.id]
    );
    const user = result.rows[0];

    // Utilisateur introuvable par ID → essayer par email (migration)
    if (!user) {
      const byEmail = await query(
        'SELECT id, nom, email, role, actif FROM users WHERE email = $1',
        [decoded.email]
      );
      const userByEmail = byEmail.rows[0];

      if (!userByEmail) {
        return res.status(401).json({
          success: false,
          message: 'Session invalide. Veuillez vous reconnecter.'
        });
      }

      // Vérifier actif (supporte INTEGER et BOOLEAN)
      if (userByEmail.actif == 0 || userByEmail.actif === false) {
        return res.status(401).json({ success: false, message: 'Compte désactivé.' });
      }

      req.user = userByEmail;
      return next();
    }

    // Vérifier actif (supporte INTEGER et BOOLEAN PostgreSQL)
    if (user.actif == 0 || user.actif === false) {
      return res.status(401).json({ success: false, message: 'Compte désactivé.' });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Erreur d\'authentification.' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Accès réservé aux super administrateurs.' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await query('SELECT id, nom, email, role FROM users WHERE id = $1', [decoded.id]);
      req.user = result.rows[0];
    }
  } catch {}
  next();
};

module.exports = { authenticate, requireSuperAdmin, optionalAuth };
module.exports = { authenticate, requireSuperAdmin, optionalAuth };
