const nodemailer = require('nodemailer');
const https = require('https');

let transporter = null;
let usingTestAccount = false;

async function createTransporter() {
  // If user provided SMTP settings (recommended), use them
  if (process.env.EMAIL_SMTP_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    console.log(`[emailService] Creating SMTP transporter: host=${process.env.EMAIL_SMTP_HOST}, port=${process.env.EMAIL_SMTP_PORT}, secure=${process.env.EMAIL_SMTP_SECURE}, user=${process.env.EMAIL_USER}`);
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
  console.log(`[emailService] No SMTP config found. Creating Ethereal test account...`);
  const testAccount = await nodemailer.createTestAccount();
  usingTestAccount = true;
  console.log(`[emailService] Ethereal test account created: ${testAccount.user}`);
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
  // 1) Send via SendGrid HTTP API if API key present (bypasses blocked SMTP on some hosts)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const fromAddress = process.env.EMAIL_USER || 'no-reply@ratify.app';
      const htmlBody = `
        <h2>You're invited to Ratify!</h2>
        <p>${senderName} invited you to join Ratify, a platform to connect with friends and share feedback.</p>
        <p>
          <a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Accept Invitation
          </a>
        </p>
        <p>Or copy this link: ${inviteLink}</p>
        <p>This invitation expires in 7 days.</p>
      `;

      const payload = {
        personalizations: [
          { to: [ { email: recipientEmail } ] }
        ],
        from: { email: fromAddress },
        subject: `${senderName} invited you to Ratify!`,
        content: [ { type: 'text/html', value: htmlBody } ]
      };

      const sendViaSendGrid = (apiKey, data) => {
        return new Promise((resolve, reject) => {
          const str = JSON.stringify(data);
          const options = {
            hostname: 'api.sendgrid.com',
            path: '/v3/mail/send',
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(str),
            },
          };

          const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve({ statusCode: res.statusCode, body });
              } else {
                reject(new Error(`SendGrid API ${res.statusCode}: ${body}`));
              }
            });
          });

          req.on('error', (err) => reject(err));
          req.write(str);
          req.end();
        });
      };

      console.log('[emailService] Attempting SendGrid API send to', recipientEmail);
      const result = await sendViaSendGrid(process.env.SENDGRID_API_KEY, payload);
      console.log('[emailService] SendGrid send successful', result && result.statusCode);
      return { info: result, previewUrl: null, provider: 'sendgrid' };
    } catch (err) {
      console.error('[emailService] SendGrid send failed:', err.message);
      // fall through to SMTP/Ethereal fallback
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
    console.log(`[emailService] Sending SMTP email to: ${recipientEmail}, from: ${fromAddress}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[emailService] Email sent successfully via SMTP. Response:`, JSON.stringify(info));
    const previewUrl = usingTestAccount ? nodemailer.getTestMessageUrl(info) : null;
    return { info, previewUrl, provider: usingTestAccount ? 'ethereal' : 'smtp' };
  } catch (err) {
    console.error(`[emailService] SMTP send failed for ${recipientEmail}:`, err.message);
    throw err;
  }
};

module.exports = { sendEmailInvite };
