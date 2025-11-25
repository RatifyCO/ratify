const express = require('express');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { generateInviteToken } = require('../services/authService');
const { sendEmailInvite } = require('../services/emailService');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all invitations (authenticated users only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const invitations = await Invitation.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender recipient', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ error: 'Error fetching invitations' });
  }
});

// Send invitation via email or phone
router.post('/send', authenticateToken, [
  body('recipientEmail').optional().isEmail().withMessage('Valid email is required'),
  body('recipientPhone').optional().isMobilePhone().withMessage('Valid phone is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { recipientEmail, recipientPhone, message } = req.body;
    const sender = req.user.userId;

    if (!recipientEmail && !recipientPhone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    const inviteToken = generateInviteToken();

    // Check if user with email/phone exists
    let recipient = null;
    if (recipientEmail) {
      recipient = await User.findOne({ email: recipientEmail });
    } else if (recipientPhone) {
      recipient = await User.findOne({ phone: recipientPhone });
    }

    const invitation = new Invitation({
      sender,
      recipientEmail,
      recipientPhone,
      recipient: recipient ? recipient._id : null,
      message,
      inviteToken,
    });

    await invitation.save();

    // If user exists, you can also add them directly (optional - based on your preference)
    // If not, they'll receive email/SMS with the invite link

    const senderUser = await User.findById(sender);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${frontendUrl}/accept-invite/${inviteToken}`;

    let emailSent = false;
    let emailError = null;
    let emailPreviewUrl = null;
    try {
      if (recipientEmail) {
        const result = await sendEmailInvite(recipientEmail, senderUser.name, inviteLink);
        emailSent = !!result;
        if (result && result.previewUrl) {
          emailPreviewUrl = result.previewUrl;
        }
      }
      // SMS sending would go here with Twilio
    } catch (err) {
      console.error('Error sending invite email:', err);
      emailError = err.message;
    }

    const resp = {
      message: 'Invitation sent successfully',
      invitationId: invitation._id,
      emailSent,
    };

    if (emailPreviewUrl) resp.emailPreviewUrl = emailPreviewUrl;
    if (emailError) resp.emailWarning = `Invitation created but email could not be sent: ${emailError}`;

    res.json(resp);
  } catch (error) {
    console.error('Invitation error:', error);
    res.status(500).json({ error: 'Error sending invitation' });
  }
});

// Get pending invitations for current user
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const invitations = await Invitation.find({
      $or: [{ recipient: userId }, { recipientEmail: (await User.findById(userId)).email }],
      status: 'pending',
    })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(invitations);
  } catch (error) {
    console.error('Fetching invitations error:', error);
    res.status(500).json({ error: 'Error fetching invitations' });
  }
});

// Accept invitation
router.post('/accept/:token', authenticateToken, async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.userId;

    const invitation = await Invitation.findOne({ inviteToken: token });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Invitation expired' });
    }

    // Add friends to each other
    const sender = await User.findById(invitation.sender);
    const recipient = await User.findById(userId);

    if (!sender.friends.includes(userId)) {
      sender.friends.push(userId);
    }
    if (!recipient.friends.includes(invitation.sender)) {
      recipient.friends.push(invitation.sender);
    }

    await sender.save();
    await recipient.save();

    invitation.status = 'accepted';
    invitation.recipient = userId;
    await invitation.save();

    res.json({ message: 'Invitation accepted', friend: sender });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Error accepting invitation' });
  }
});

// Decline invitation
router.post('/decline/:token', authenticateToken, async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ inviteToken: token });

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    invitation.status = 'declined';
    await invitation.save();

    res.json({ message: 'Invitation declined' });
  } catch (error) {
    res.status(500).json({ error: 'Error declining invitation' });
  }
});

module.exports = router;
