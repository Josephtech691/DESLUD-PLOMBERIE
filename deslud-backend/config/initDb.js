// config/initDb.js
require('dotenv').config();
const { getDb, initializeSchema } = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  console.log('🚀 Initialisation de la base de données Deslud Plomberie...\n');

  initializeSchema();

  const db = getDb();

  // ---- SEED: Admin par défaut ----
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 12);
    db.prepare(`
      INSERT INTO users (id, nom, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(uuidv4(), 'Super Admin', adminEmail, hashedPassword, 'super_admin');
    console.log(`✅ Admin créé: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('ℹ️  Admin déjà existant, skip...');
  }

  // ---- SEED: Services Deslud Plomberie ----
  const services = [
    {
      id: uuidv4(),
      nom: 'Installation Sanitaire',
      slug: 'installation-sanitaire',
      description: 'Nous réalisons l\'installation complète de vos équipements sanitaires : robinets, lavabos, baignoires, douches, WC, chauffe-eau et bien plus. Nos techniciens qualifiés garantissent une installation conforme aux normes et durable.',
      description_courte: 'Installation complète de vos équipements sanitaires par des techniciens qualifiés.',
      icone: 'wrench',
      prix_a_partir: 15000,
      actif: 1,
      ordre: 1
    },
    {
      id: uuidv4(),
      nom: 'Entretien & Maintenance',
      slug: 'entretien-maintenance',
      description: 'Nous assurons l\'entretien régulier de vos installations de plomberie pour éviter les pannes et prolonger leur durée de vie. Contrats d\'entretien annuels disponibles pour particuliers et entreprises.',
      description_courte: 'Entretien régulier et maintenance préventive de vos installations.',
      icone: 'settings',
      prix_a_partir: 10000,
      actif: 1,
      ordre: 2
    },
    {
      id: uuidv4(),
      nom: 'Dépannage Rapide',
      slug: 'depannage-rapide',
      description: 'Fuite d\'eau, canalisation bouchée, robinet cassé ? Notre équipe intervient rapidement partout à Yaoundé et dans tout le Cameroun. Disponible 7j/7 pour les urgences.',
      description_courte: 'Intervention d\'urgence rapide 7j/7 pour tous vos problèmes de plomberie.',
      icone: 'zap',
      prix_a_partir: 5000,
      actif: 1,
      ordre: 3
    },
    {
      id: uuidv4(),
      nom: 'Dépannage de Fuites',
      slug: 'depannage-fuites',
      description: 'Détection et réparation de fuites d\'eau visibles ou cachées. Nous utilisons des méthodes modernes pour localiser les fuites sans casser inutilement vos murs.',
      description_courte: 'Détection et réparation professionnelle de toutes vos fuites d\'eau.',
      icone: 'droplet',
      prix_a_partir: 8000,
      actif: 1,
      ordre: 4
    },
    {
      id: uuidv4(),
      nom: 'Réparation de Tuyauterie',
      slug: 'reparation-tuyauterie',
      description: 'Réparation et remplacement de tuyaux endommagés, rouillés ou fuyard. Nous travaillons sur tous types de tuyauteries : PVC, acier galvanisé, cuivre, PER.',
      description_courte: 'Réparation et remplacement de tous types de tuyauteries.',
      icone: 'tool',
      prix_a_partir: 12000,
      actif: 1,
      ordre: 5
    }
  ];

  const insertService = db.prepare(`
    INSERT OR IGNORE INTO services (id, nom, slug, description, description_courte, icone, prix_a_partir, actif, ordre)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  services.forEach(s => {
    insertService.run(s.id, s.nom, s.slug, s.description, s.description_courte, s.icone, s.prix_a_partir, s.actif, s.ordre);
  });
  console.log(`✅ ${services.length} services insérés`);

  // ---- SEED: Témoignages clients ----
  const temoignages = [
    {
      id: uuidv4(),
      nom_client: 'Marie Atangana',
      quartier: 'Bastos',
      note: 5,
      commentaire: 'Service impeccable ! L\'équipe est venue rapidement pour réparer une fuite majeure. Travail propre et soigné. Je recommande fortement Deslud Plomberie.',
      service_type: 'depannage_rapide',
      valide: 1
    },
    {
      id: uuidv4(),
      nom_client: 'Paul Mbarga',
      quartier: 'Nlongkak',
      note: 5,
      commentaire: 'Excellente prestation pour l\'installation de ma nouvelle salle de bain. Professionnel et dans les délais. Le prix était raisonnable.',
      service_type: 'installation',
      valide: 1
    },
    {
      id: uuidv4(),
      nom_client: 'Sophie Ngo Biyong',
      quartier: 'Melen',
      note: 4,
      commentaire: 'Très bon service, intervention rapide le dimanche pour une urgence. Je suis satisfaite du travail effectué.',
      service_type: 'depannage_rapide',
      valide: 1
    }
  ];

  const insertTemoignage = db.prepare(`
    INSERT OR IGNORE INTO temoignages (id, nom_client, quartier, note, commentaire, service_type, valide)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  temoignages.forEach(t => {
    insertTemoignage.run(t.id, t.nom_client, t.quartier, t.note, t.commentaire, t.service_type, t.valide);
  });
  console.log(`✅ ${temoignages.length} témoignages insérés`);

  console.log('\n🎉 Base de données initialisée avec succès !');
  console.log('📧 Admin:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('\n⚠️  Pensez à changer le mot de passe admin après le premier démarrage !');
  process.exit(0);
};

seedDatabase().catch(err => {
  console.error('❌ Erreur lors de l\'initialisation:', err);
  process.exit(1);
});
