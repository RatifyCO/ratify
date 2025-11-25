const nodemailer = require('nodemailer');
let sgMail;
try {
  sgMail = require('@sendgrid/mail');
} catch (e) {
  sgMail = null;
}

let transporter = null;
let usingTestAccount = false;

async function createTransporter() {
  // If user provided SMTP settings (recommended), use them
  if (process.env.EMAIL_SMTP_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT, 10) : 587,
      secure: process.env.EMAIL_SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // No SMTP credentials: create an Ethereal test account so developers can preview emails
  const testAccount = await nodemailer.createTestAccount();
  usingTestAccount = true;
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// sendEmailInvite supports three modes (priority):
// 1) SendGrid HTTP API when SENDGRID_API_KEY is provided
// 2) SMTP (EMAIL_SMTP_* + EMAIL_USER/PASSWORD)
// 3) Ethereal test account fallback (for developers)
const sendEmailInvite = async (recipientEmail, senderName, inviteLink) => {
  // 1) Send via SendGrid if API key present
  if (process.env.SENDGRID_API_KEY && sgMail) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const fromAddress = process.env.EMAIL_USER || 'no-reply@ratify.app';
      const msg = {
        to: recipientEmail,
        from: fromAddress,
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
      const result = await sgMail.send(msg);
      return { info: result, previewUrl: null, provider: 'sendgrid' };
    } catch (err) {
      throw new Error(`SendGrid error: ${err.message}`);
    }
  }

  // 2/3) SMTP or Ethereal via nodemailer
  if (!transporter) {
    transporter = await createTransporter();
  }

  const fromAddress = process.env.EMAIL_USER || `"Ratify (test)" <${transporter.options.auth.user}>`;

  const mailOptions = {
    from: fromAddress,
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

  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : null;
    return { info, previewUrl, provider: usingTestAccount ? 'ethereal' : 'smtp' };
  } catch (err) {
    throw err;
  }
};

module.exports = { sendEmailInvite };
