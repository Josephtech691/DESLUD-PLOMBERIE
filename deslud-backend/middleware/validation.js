// middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array().map(e => ({ champ: e.path, message: e.msg }))
    });
  }
  next();
};

// Règles de validation pour le formulaire de contact
const contactRules = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('prenom')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Le prénom ne peut dépasser 100 caractères'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('telephone')
    .trim()
    .notEmpty().withMessage('Le téléphone est obligatoire')
    .matches(/^[+\d\s()-]{8,20}$/).withMessage('Numéro de téléphone invalide'),
  body('sujet')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Le sujet ne peut dépasser 200 caractères'),
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est obligatoire')
    .isLength({ min: 10, max: 2000 }).withMessage('Le message doit contenir entre 10 et 2000 caractères')
];

// Règles de validation pour la demande de devis
const devisRules = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Nom invalide'),
  body('prenom')
    .optional().trim()
    .isLength({ max: 100 }),
  body('email')
    .optional().trim()
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('telephone')
    .trim()
    .notEmpty().withMessage('Le téléphone est obligatoire')
    .matches(/^[+\d\s()-]{8,20}$/).withMessage('Numéro de téléphone invalide'),
  body('adresse').optional().trim().isLength({ max: 300 }),
  body('quartier').optional().trim().isLength({ max: 100 }),
  body('ville').optional().trim().isLength({ max: 100 }),
  body('type_service')
    .trim()
    .notEmpty().withMessage('Le type de service est obligatoire')
    .isIn(['installation', 'entretien', 'depannage_rapide', 'autre'])
    .withMessage('Type de service invalide'),
  body('description')
    .trim()
    .notEmpty().withMessage('La description est obligatoire')
    .isLength({ min: 10, max: 3000 }).withMessage('Description entre 10 et 3000 caractères'),
  body('urgence')
    .optional()
    .isIn(['normal', 'urgent', 'tres_urgent']).withMessage('Niveau d\'urgence invalide'),
  body('disponibilite').optional().trim().isLength({ max: 200 }),
  body('budget_estime').optional().trim().isLength({ max: 100 })
];

// Règles pour la mise à jour de statut d'un devis
const devisStatutRules = [
  body('statut')
    .notEmpty().withMessage('Le statut est obligatoire')
    .isIn(['en_attente', 'en_cours', 'devis_envoye', 'accepte', 'refuse', 'termine'])
    .withMessage('Statut invalide'),
  body('montant_devis').optional().isFloat({ min: 0 }).withMessage('Montant invalide'),
  body('notes_admin').optional().trim().isLength({ max: 1000 })
];

// Règles pour la connexion admin
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 6 }).withMessage('Mot de passe trop court')
];

// Règles pour la création d'un admin
const adminCreateRules = [
  body('nom').trim().notEmpty().withMessage('Nom obligatoire').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Mot de passe minimum 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Mot de passe doit contenir majuscule, minuscule et chiffre'),
  body('role').optional().isIn(['admin', 'super_admin']).withMessage('Rôle invalide')
];

// Règles pour les témoignages
const temoignageRules = [
  body('nom_client').trim().notEmpty().withMessage('Nom obligatoire').isLength({ max: 100 }),
  body('quartier').optional().trim().isLength({ max: 100 }),
  body('note').isInt({ min: 1, max: 5 }).withMessage('Note entre 1 et 5'),
  body('commentaire').trim().notEmpty().withMessage('Commentaire obligatoire').isLength({ min: 10, max: 1000 }),
  body('service_type').optional().isIn(['installation', 'entretien', 'depannage_rapide', 'autre'])
];

// Règles pour l'abonnement newsletter
const newsletterRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email obligatoire')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
];

// Validation de l'ID UUID dans les params
const uuidParam = (paramName = 'id') => [
  param(paramName)
    .isUUID().withMessage('Identifiant invalide')
];

module.exports = {
  validate,
  contactRules,
  devisRules,
  devisStatutRules,
  loginRules,
  adminCreateRules,
  temoignageRules,
  newsletterRules,
  uuidParam
};
