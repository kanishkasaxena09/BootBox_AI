const nodemailer = require('nodemailer');
require('dotenv').config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SENDER_EMAIL,
  RECEIVER_EMAIL
} = process.env;

let transporter = null;
let transporterReady = false;

function initTransporter() {
  if (!SMTP_HOST || !SMTP_USER) {
    console.warn('SMTP not configured - emails will be skipped.');
    return;
  }
  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
      secure: SMTP_PORT && parseInt(SMTP_PORT, 10) === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    transporterReady = true;
    console.log('SMTP transporter initialized for', SMTP_USER);
  } catch (err) {
    console.error('Failed to initialize SMTP transporter:', err.message);
    transporterReady = false;
  }
}

initTransporter();

async function sendFeedbackEmail({ name, email, rating, comment }) {
  if (!transporterReady) {
    console.warn('SMTP transporter not configured - skipping sending feedback email.');
    return;
  }

  const to = RECEIVER_EMAIL || SENDER_EMAIL || SMTP_USER;
  const from = SENDER_EMAIL || SMTP_USER;
  const subject = `New Feedback Received - Rating: ${rating}`;
  const text = `Name: ${name || 'Anonymous'}\nEmail: ${email || 'Not provided'}\nRating: ${rating}\n\nComment:\n${comment}`;
  const html = `<h3>New Feedback Received</h3><p><strong>Name:</strong> ${name || 'Anonymous'}</p><p><strong>Email:</strong> ${email || 'Not provided'}</p><p><strong>Rating:</strong> ${rating}</p><hr/><p>${comment.replace(/\n/g,'<br/>')}</p>`;

  try {
    await transporter.sendMail({ from, to, subject, text, html });
    console.log('Feedback email sent to', to);
  } catch (err) {
    console.error('Failed to send feedback email:', err.message);
  }
}

module.exports = {
  sendFeedbackEmail,
  transporterReady
};
