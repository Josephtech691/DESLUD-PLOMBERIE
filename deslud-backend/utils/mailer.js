// utils/mailer.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Template HTML générique
const htmlTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1565C0,#0D47A1);padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:bold;">💧 DESLUD PLOMBERIE</h1>
              <p style="color:#90CAF9;margin:5px 0 0;font-size:14px;">Votre Confort, Notre Expertise</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #e0e0e0;">
              <p style="color:#666;font-size:12px;margin:0;">
                📍 Basé à Yaoundé | 📞 683 90 62 25 | 📞 658 51 87 88<br>
                ✉️ ludovicnono83@gmail.com
              </p>
              <p style="color:#999;font-size:11px;margin:10px 0 0;">
                © ${new Date().getFullYear()} Deslud Plomberie - Tous droits réservés
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Email de confirmation au client après contact
const sendContactConfirmation = async (contact) => {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#1565C0;margin-top:0;">Bonjour ${contact.nom} !</h2>
    <p style="color:#333;line-height:1.6;">
      Nous avons bien reçu votre message et nous vous en remercions. 
      Notre équipe vous contactera dans les <strong>24 heures</strong> ouvrables.
    </p>
    <div style="background:#f0f7ff;border-left:4px solid #1565C0;padding:15px 20px;margin:20px 0;border-radius:4px;">
      <p style="margin:0;color:#1565C0;font-weight:bold;">Récapitulatif de votre message :</p>
      <p style="margin:8px 0 0;color:#333;"><strong>Sujet :</strong> ${contact.sujet || 'Non précisé'}</p>
      <p style="margin:5px 0 0;color:#333;"><strong>Message :</strong> ${contact.message}</p>
    </div>
    <p style="color:#333;line-height:1.6;">
      Pour toute urgence, n'hésitez pas à nous appeler directement :
    </p>
    <div style="text-align:center;margin:20px 0;">
      <a href="tel:+237683906225" style="display:inline-block;background:#1565C0;color:white;padding:12px 25px;border-radius:25px;text-decoration:none;font-weight:bold;margin:5px;">
        📞 683 90 62 25
      </a>
      <a href="tel:+237658518788" style="display:inline-block;background:#0D47A1;color:white;padding:12px 25px;border-radius:25px;text-decoration:none;font-weight:bold;margin:5px;">
        📞 658 51 87 88
      </a>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: contact.email,
    subject: '✅ Message reçu - Deslud Plomberie',
    html: htmlTemplate('Confirmation de votre message', content)
  });
};

// Email de notification à l'admin pour un nouveau contact
const sendContactNotification = async (contact) => {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#1565C0;margin-top:0;">🔔 Nouveau message de contact</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;width:140px;">Nom</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${contact.nom} ${contact.prenom || ''}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Téléphone</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${contact.telephone}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Email</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${contact.email || 'Non fourni'}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Sujet</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${contact.sujet || 'Non précisé'}</td></tr>
      <tr><td style="padding:8px;color:#666;vertical-align:top;">Message</td>
          <td style="padding:8px;"><p style="margin:0;white-space:pre-wrap;">${contact.message}</p></td></tr>
    </table>
    <div style="margin-top:20px;text-align:center;">
      <a href="${process.env.ADMIN_URL}/admin" 
         style="background:#1565C0;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Voir dans l'admin
      </a>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `🔔 Nouveau contact: ${contact.nom} - Deslud Plomberie`,
    html: htmlTemplate('Nouveau message de contact', content)
  });
};

// Email de confirmation après demande de devis
const sendDevisConfirmation = async (devis) => {
  const transporter = createTransporter();
  const servicesLabels = {
    installation: 'Installation Sanitaire',
    entretien: 'Entretien & Maintenance',
    depannage_rapide: 'Dépannage Rapide',
    autre: 'Autre Service'
  };
  const urgenceLabels = {
    normal: '⬜ Normal',
    urgent: '🟡 Urgent',
    tres_urgent: '🔴 Très Urgent'
  };

  const content = `
    <h2 style="color:#1565C0;margin-top:0;">Bonjour ${devis.nom} !</h2>
    <p style="color:#333;line-height:1.6;">
      Votre demande de devis a bien été enregistrée. Notre équipe vous contactera 
      rapidement pour vous proposer un devis personnalisé.
    </p>
    <div style="background:#f0f7ff;border:1px solid #BBDEFB;border-radius:8px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 10px;color:#1565C0;font-weight:bold;font-size:16px;">
        📋 Référence: <span style="font-family:monospace;">${devis.reference}</span>
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;width:140px;">Service demandé</td>
            <td style="padding:6px 0;font-weight:bold;">${servicesLabels[devis.type_service]}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Urgence</td>
            <td style="padding:6px 0;">${urgenceLabels[devis.urgence]}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Localisation</td>
            <td style="padding:6px 0;">${devis.quartier || ''} - ${devis.ville}</td></tr>
      </table>
    </div>
    <p style="color:#333;font-size:14px;">
      Conservez votre numéro de référence pour le suivi de votre demande.
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: devis.email,
    subject: `📋 Demande de devis reçue [${devis.reference}] - Deslud Plomberie`,
    html: htmlTemplate('Confirmation de demande de devis', content)
  });
};

// Email de notification admin pour un nouveau devis
const sendDevisNotification = async (devis) => {
  const transporter = createTransporter();
  const urgenceColors = { normal: '#4CAF50', urgent: '#FF9800', tres_urgent: '#f44336' };
  const color = urgenceColors[devis.urgence] || '#4CAF50';

  const content = `
    <h2 style="color:#1565C0;margin-top:0;">🔔 Nouvelle demande de devis</h2>
    <div style="background:${color}15;border-left:4px solid ${color};padding:10px 15px;margin-bottom:20px;border-radius:4px;">
      <strong style="color:${color};">Urgence: ${devis.urgence.replace('_', ' ').toUpperCase()}</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;width:160px;">Référence</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-family:monospace;font-weight:bold;">${devis.reference}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Client</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${devis.nom} ${devis.prenom || ''}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Téléphone</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${devis.telephone}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Email</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${devis.email || 'Non fourni'}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Service</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${devis.type_service}</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Adresse</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${devis.quartier || ''} - ${devis.ville}</td></tr>
      <tr><td style="padding:8px;color:#666;vertical-align:top;">Description</td>
          <td style="padding:8px;"><p style="margin:0;white-space:pre-wrap;">${devis.description}</p></td></tr>
    </table>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `🔔 Nouveau devis [${devis.reference}] - ${devis.type_service} - Deslud`,
    html: htmlTemplate('Nouvelle demande de devis', content)
  });
};

module.exports = {
  sendContactConfirmation,
  sendContactNotification,
  sendDevisConfirmation,
  sendDevisNotification
};
