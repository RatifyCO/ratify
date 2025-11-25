const express = require('express');
const Rating = require('../models/Rating');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all ratings (public endpoint)
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate('rater ratee', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Error fetching ratings' });
  }
});

// Create or update a rating
router.post('/', authenticateToken, [
  body('ratee').notEmpty().withMessage('User to rate is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { ratee, rating, comment } = req.body;
    const rater = req.user.userId;

    // Check if users are friends
    const raterUser = await User.findById(rater);
    if (!raterUser.friends.includes(ratee)) {
      return res.status(403).json({ error: 'You can only rate your friends' });
    }

    // Create or update rating
    let ratingDoc = await Rating.findOneAndUpdate(
      { rater, ratee },
      { rating, comment, updatedAt: new Date() },
      { new: true, upsert: true }
    ).populate('rater ratee', '-password');

    res.json(ratingDoc);
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ error: 'Error creating rating' });
  }
});

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const ratings = await Rating.find({ ratee: userId })
      .populate('rater', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Calculate average rating
    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      avgRating = (sum / ratings.length).toFixed(2);
    }

    res.json({ ratings, averageRating: avgRating, totalRatings: ratings.length });
  } catch (error) {
    console.error('Fetching ratings error:', error);
    res.status(500).json({ error: 'Error fetching ratings' });
  }
});

// Get my ratings given by others
router.get('/my-ratings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const ratings = await Rating.find({ ratee: userId })
      .populate('rater', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ratings' });
  }
});

module.exports = router;
