const nodemailer = require('nodemailer');

// Support Gmail by default, or custom SMTP (e.g., Outlook) when SMTP env vars are provided.
let transporter;
if (process.env.EMAIL_SMTP_HOST) {
  // Use explicit SMTP settings (recommended for Outlook/Office365)
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT, 10) : 587,
    secure: process.env.EMAIL_SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

const sendEmailInvite = async (recipientEmail, senderName, inviteLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `${senderName} invited you to Ratify!`,
    html: `
      <h2>You're invited to Ratify!</h2>
      <p>${senderName} invited you to join Ratify, a platform to connect with friends and share feedback.</p>
      <p>
        <a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Accept Invitation
        </a>
      </p>
      <p>Or copy this link: ${inviteLink}</p>
      <p>This invitation expires in 7 days.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmailInvite };
