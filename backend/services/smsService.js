const twilioPkg = require('twilio');

const sendSmsInvite = async (toPhone, senderName, inviteLink) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;

  if (!sid || !token || !from) {
    throw new Error('Twilio credentials not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM)');
  }

  const client = twilioPkg(sid, token);

  const body = `${senderName} invited you to Ratify! Accept: ${inviteLink}`;

  const msg = await client.messages.create({
    body,
    from,
    to: toPhone,
  });

  return { sid: msg.sid, status: msg.status, to: msg.to };
};

module.exports = { sendSmsInvite };
