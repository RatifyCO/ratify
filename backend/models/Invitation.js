const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientEmail: {
    type: String,
    sparse: true,
  },
  recipientPhone: {
    type: String,
    sparse: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  message: {
    type: String,
    default: '',
  },
  inviteToken: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000), // 7 days from now
  },
});

module.exports = mongoose.model('Invitation', invitationSchema);
