const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Search users by name or email
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    }).select('-password').limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('friends', '-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure user can only update their own profile
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, bio, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, bio, profilePicture, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Get friends list
router.get('/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('friends', '-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends' });
  }
});

module.exports = router;
