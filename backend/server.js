const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const ratingsRoutes = require('./routes/ratings');
const invitationsRoutes = require('./routes/invitations');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ratify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/invitations', invitationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Root landing page for quick verification in browser
app.get('/', (req, res) => {
  res.send(
    `
      <html>
        <head><title>Ratify Backend</title></head>
        <body style="font-family: Arial, sans-serif; line-height:1.6; margin:40px;">
          <h1>Ratify Backend</h1>
          <p>API is running. Use the API routes under <code>/api/</code>.</p>
          <ul>
            <li><a href="/api/health">/api/health</a> — health check</li>
            <li><a href="/api/auth">/api/auth</a> — authentication routes</li>
            <li><a href="/api/users">/api/users</a> — user routes</li>
            <li><a href="/api/ratings">/api/ratings</a> — ratings routes</li>
            <li><a href="/api/invitations">/api/invitations</a> — invitation routes</li>
          </ul>
          <p>If you see "Cannot GET /" after this change, try redeploying the service so the new code is used.</p>
        </body>
      </html>
    `
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
