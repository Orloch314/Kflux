// services/notify.js
const nodemailer = require('nodemailer');
const axios = require('axios');

async function sendNotification({ subject, message, status = 'info' }) {
  // ====== EMAIL SETUP ======
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Crea il trasportatore SMTP
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const mailOptions = {
    from: smtpUser,
    to: smtpUser, // Puoi usare una lista di destinatari
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo');
  } catch (err) {
    console.error('Errore invio email:', err.message);
  }

  // ====== TEAMS WEBHOOK ======
  const teamsWebhook = process.env.TEAMS_WEBHOOK;

  if (teamsWebhook) {
    try {
      await axios.post(teamsWebhook, {
        text: `🧠 *${subject}*\n${message}`,
        themeColor: status === 'error' ? 'FF0000' : '00AA00'
      });
      console.log('Notifica Teams inviata con successo');
    } catch (err) {
      console.error('Errore invio Teams:', err.message);
    }
  }
}

module.exports = { sendNotification };
