# 💧 Deslud Plomberie — Backend API

> Backend complet pour le site web de **Deslud Plomberie**, entreprise de plomberie basée à Yaoundé, Cameroun.

---

## 🏗️ Stack Technique

| Technologie | Usage |
|---|---|
| **Node.js + Express** | Serveur web & API REST |
| **SQLite (better-sqlite3)** | Base de données locale |
| **JWT** | Authentification admin |
| **Nodemailer** | Envoi d'emails |
| **Helmet** | Sécurité HTTP headers |
| **express-rate-limit** | Protection contre les abus |
| **express-validator** | Validation des données |
| **bcryptjs** | Hashage des mots de passe |

---

## 📦 Installation

```bash
# 1. Cloner le projet
cd deslud-plomberie-backend

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# → Modifiez les valeurs dans .env

# 4. Initialiser la base de données
npm run init-db

# 5. Démarrer le serveur
npm run dev   # Développement (avec nodemon)
npm start     # Production
```

---

## ⚙️ Configuration `.env`

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=votre_secret_jwt_tres_long
JWT_EXPIRES_IN=7d

EMAIL_USER=ludovicnono83@gmail.com
EMAIL_PASS=votre_mot_de_passe_application_gmail

ADMIN_EMAIL=admin@deslud-plomberie.cm
ADMIN_PASSWORD=Admin@2024!

ALLOWED_ORIGINS=http://localhost:3000
```

> ⚠️ Pour Gmail, activez l'authentification à 2 facteurs et créez un **mot de passe d'application**.

---

## 🗄️ Structure de la Base de Données

| Table | Description |
|---|---|
| `users` | Administrateurs du site |
| `contacts` | Messages du formulaire de contact |
| `devis` | Demandes de devis clients |
| `interventions` | Rapports d'interventions |
| `services` | Services proposés |
| `temoignages` | Avis clients |
| `newsletter` | Abonnés newsletter |
| `logs` | Journal des actions admin |

---

## 🌐 API Endpoints

### 🔓 Routes Publiques

#### Informations
```
GET  /api/health          → Santé de l'API
GET  /api/info            → Informations de la société
```

#### Contact
```
POST /api/contact         → Envoyer un message
  Body: { nom*, telephone*, message*, prenom?, email?, sujet? }
```

#### Devis
```
POST /api/devis                        → Demande de devis
  Body: { nom*, telephone*, type_service*, description*, 
          prenom?, email?, adresse?, quartier?, urgence?, disponibilite? }

GET  /api/devis/suivi/:reference       → Suivi d'un devis par référence
```

#### Services
```
GET  /api/services         → Liste des services
GET  /api/services/:slug   → Détails d'un service
```

#### Témoignages
```
GET  /api/temoignages      → Témoignages validés
POST /api/temoignages      → Soumettre un avis
  Body: { nom_client*, note* (1-5), commentaire*, quartier?, service_type? }
```

#### Newsletter
```
POST /api/newsletter       → S'abonner
  Body: { email* }
```

---

### 🔐 Routes Admin (JWT requis)

Toutes les routes admin nécessitent le header :
```
Authorization: Bearer <token>
```

#### Authentification
```
POST  /api/admin/auth/login             → Connexion
  Body: { email*, password* }

POST  /api/admin/auth/logout            → Déconnexion
GET   /api/admin/auth/me                → Mon profil
POST  /api/admin/auth/change-password   → Changer mot de passe
```

#### Tableau de Bord
```
GET /api/admin/dashboard   → Statistiques générales
GET /api/admin/logs        → Journal des actions (super_admin)
```

#### Contacts
```
GET    /api/admin/contacts              → Liste (filtres: statut, page, limit)
GET    /api/admin/contacts/stats        → Statistiques
GET    /api/admin/contacts/:id          → Détails
PATCH  /api/admin/contacts/:id/statut   → Changer statut
DELETE /api/admin/contacts/:id          → Supprimer
```

#### Devis
```
GET   /api/admin/devis                     → Liste (filtres: statut, type_service, urgence, search)
GET   /api/admin/devis/stats               → Statistiques
GET   /api/admin/devis/:id                 → Détails + interventions
PATCH /api/admin/devis/:id/statut          → Changer statut + montant + notes
POST  /api/admin/devis/:id/intervention    → Ajouter rapport d'intervention
```

#### Services
```
POST   /api/admin/services       → Créer un service
PUT    /api/admin/services/:id   → Modifier un service
DELETE /api/admin/services/:id   → Désactiver
```

#### Témoignages
```
GET   /api/admin/temoignages                 → Tous les avis
PATCH /api/admin/temoignages/:id/valider     → Publier un avis
```

#### Utilisateurs (super_admin uniquement)
```
GET   /api/admin/users              → Liste des admins
POST  /api/admin/users              → Créer un admin
PATCH /api/admin/users/:id/toggle   → Activer/Désactiver
```

---

## 📊 Statuts des Devis

| Statut | Description |
|---|---|
| `en_attente` | Nouvelle demande non traitée |
| `en_cours` | En cours de traitement |
| `devis_envoye` | Devis envoyé au client |
| `accepte` | Devis accepté par le client |
| `refuse` | Devis refusé |
| `termine` | Intervention terminée |

---

## 🔒 Sécurité

- **JWT** avec expiration configurable
- **Bcrypt** (12 rounds) pour les mots de passe
- **Rate Limiting** : 
  - Global: 100 req/15min
  - Formulaires: 10 req/15min
  - Login: 5 tentatives/15min
- **Helmet** pour les headers HTTP sécurisés
- **CORS** avec liste d'origines autorisées
- **Validation** de toutes les entrées utilisateur
- **Soft delete** pour préserver l'historique

---

## 📁 Structure du Projet

```
deslud-plomberie-backend/
├── server.js                   # Point d'entrée
├── package.json
├── .env.example                # Template de configuration
├── config/
│   ├── database.js             # Connexion & schéma SQLite
│   └── initDb.js               # Script d'initialisation + seed
├── controllers/
│   ├── adminController.js      # Auth & dashboard admin
│   ├── contactController.js    # Gestion des contacts
│   ├── devisController.js      # Gestion des devis
│   └── servicesController.js   # Services & témoignages
├── middleware/
│   ├── auth.js                 # Vérification JWT
│   ├── validation.js           # Règles de validation
│   └── errorHandler.js         # Gestion centralisée des erreurs
├── routes/
│   └── index.js                # Toutes les routes
├── utils/
│   └── mailer.js               # Templates & envoi d'emails
└── database/
    └── deslud.db               # Fichier SQLite (généré auto)
```

---

## 📞 Contact Deslud Plomberie

- 📍 Yaoundé, Cameroun (intervention dans tout le Cameroun)
- 📞 **683 90 62 25**
- 📞 **658 51 87 88**
- ✉️ **ludovicnono83@gmail.com**
