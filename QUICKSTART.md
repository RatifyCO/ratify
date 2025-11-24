# Ratify - Full Stack Friend Rating Platform

A complete, production-ready web application for connecting with friends and sharing honest feedback through a 1-5 star rating system.

## 🌟 Key Features

### User Management
- Secure signup and login with password hashing
- Complete user profiles with bio and contact info
- Friend network management

### Rating System
- Rate friends on a 1-5 star scale
- Leave detailed comments with ratings
- View rating history and average scores
- Real-time rating updates

### Invitation System
- Invite friends via email
- Invite contacts via phone number (SMS-ready with Twilio)
- 7-day expiration on invitation links
- Automatic friend connection on acceptance

### Dashboard
- View your average rating
- See all ratings received with feedback
- Quick rating interface for friends
- Pending invitations tracking

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│  React Frontend │ ◄────► │  Express API     │ ◄────► │  MongoDB    │
│  (Tailwind CSS) │         │  (Node.js)       │         │  Database   │
└─────────────────┘         └──────────────────┘         └─────────────┘
                                     │
                            ┌────────┴────────┐
                            │                 │
                      ┌─────▼────┐   ┌────────▼────┐
                      │ Nodemailer│   │    Twilio   │
                      │ (Email)   │   │    (SMS)    │
                      └───────────┘   └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)
- npm/yarn

### Development Setup

**Backend:**
```bash
cd backend
npm install
# Update .env with your config
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
# Update .env with API URL
npm start
```

Access at `http://localhost:3000`

## 📦 Installation

### 1. Clone Repository
```bash
git clone <repo-url>
cd Ratify
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure .env
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ratify
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
FRONTEND_URL=http://localhost:3000
EOF

npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

npm start
```

## 🌐 Deployment

### Quick Deploy to Heroku + Netlify

**Backend:**
```bash
cd backend
heroku login
heroku create ratify-backend
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<strong-key>
git push heroku main
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy build/ to Netlify or Vercel
```

### Docker Deploy
```bash
docker-compose up -d
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (auth required)

### Users
- `GET /api/users` - List all users
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id/friends` - Get friends list

### Ratings
- `POST /api/ratings` - Submit rating
- `GET /api/ratings/user/:userId` - Get user's ratings
- `GET /api/ratings/my-ratings` - Get my ratings received

### Invitations
- `POST /api/invitations/send` - Send invitation
- `GET /api/invitations/pending` - Get pending invites
- `POST /api/invitations/accept/:token` - Accept invite
- `POST /api/invitations/decline/:token` - Decline invite

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- JavaScript ES6+

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT
- bcryptjs
- Nodemailer
- Twilio SDK

**Infrastructure:**
- Docker & Docker Compose
- Heroku/AWS/DigitalOcean ready

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT authentication tokens
- Protected routes
- CORS configuration
- Input validation
- Environment variables for secrets
- Secure invitation tokens

## 📋 Project Structure

```
Ratify/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── services/         # Business logic
│   ├── server.js         # Express app
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # Auth context
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── tailwind.config.js
│
├── README.md
├── DEPLOYMENT.md
└── docker-compose.yml
```

## 🎯 Use Cases

**Personal Social Network:**
- Track reputation with friends
- Get honest feedback

**Professional Network:**
- Rate colleagues/mentors
- Build professional reputation

**Community Apps:**
- Friend ratings for safety
- Trustworthiness scoring

## 🌱 Future Enhancements

- [ ] Real-time notifications (Socket.io)
- [ ] User profile pictures
- [ ] Badges & achievements
- [ ] Block/unblock users
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] OAuth authentication
- [ ] Recommendation algorithm

## 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**MongoDB Connection:**
- Ensure MongoDB is running
- Check connection string

**Email Not Sending:**
- Use Gmail app password
- Update EMAIL_USER and EMAIL_PASSWORD

## 📞 Support

For issues or questions:
1. Check DEPLOYMENT.md for setup help
2. Review API documentation
3. Check GitHub issues

## 📄 License

MIT License - Open source and free to use

---

**Built with ❤️ for connecting people through honest feedback.**

Start rating friends today! 🌟
