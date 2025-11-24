# Ratify - Friend Rating Platform

A modern web application where users can sign up, rate their friends on a 1-5 star scale, and invite others via email or phone number.

## Features

✨ **Core Features:**
- User authentication (signup/login with password hashing)
- Rate friends on a 1-5 star scale with optional comments
- Invite friends via email or phone number
- View average ratings and rating history
- User profiles with bio and contact info
- Friend network management
- Real-time rating feedback

## Project Structure

```
Ratify/
├── backend/               # Node.js/Express API
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth middleware
│   ├── services/         # Business logic
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
│
└── frontend/             # React application
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── contexts/     # Auth context
    │   ├── App.js        # Main app component
    │   └── index.js      # React entry point
    ├── public/           # Static files
    ├── package.json      # Dependencies
    └── tailwind.config.js # Tailwind CSS config
```

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB (Database)
- JWT (Authentication)
- Nodemailer (Email invitations)
- Twilio (SMS invitations - optional)
- bcryptjs (Password hashing)

**Frontend:**
- React 18
- React Router v6
- Axios (HTTP client)
- Tailwind CSS (Styling)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ratify
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development

# Email configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio (optional for SMS)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile (protected)
- `GET /api/users/:id/friends` - Get user's friends

### Ratings
- `POST /api/ratings` - Create/update rating (protected)
- `GET /api/ratings/user/:userId` - Get ratings for a user
- `GET /api/ratings/my-ratings` - Get ratings received (protected)

### Invitations
- `POST /api/invitations/send` - Send invitation (protected)
- `GET /api/invitations/pending` - Get pending invitations (protected)
- `POST /api/invitations/accept/:token` - Accept invitation (protected)
- `POST /api/invitations/decline/:token` - Decline invitation (protected)

## Deployment Guide

### Deploy Backend to Heroku

1. Create a Heroku account and install CLI
2. Login: `heroku login`
3. Create app: `heroku create ratify-backend`
4. Set environment variables:
```bash
heroku config:set MONGODB_URI=your-mongodb-connection-string
heroku config:set JWT_SECRET=your-secret-key
# ... set other env variables
```
5. Deploy: `git push heroku main`

### Deploy Frontend to Vercel/Netlify

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set `REACT_APP_API_URL` in Vercel dashboard to your backend URL

**Netlify:**
1. Build: `npm run build`
2. Deploy the `build` folder to Netlify

### Deploy with Docker

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Email Configuration

### Using Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `.env`

### Using Other Email Providers:
Update the transporter in `services/emailService.js` with your provider's SMTP settings.

## SMS Configuration (Twilio)

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Update `.env` with these credentials
5. Uncomment SMS sending in `routes/invitations.js`

## Usage Guide

### For New Users:
1. Sign up with name, email, password
2. Complete your profile (optional bio)
3. Find friends using search
4. Send invitations via email or phone
5. Accept invitations from friends

### For Registered Users:
1. Login with email and password
2. View your dashboard with ratings summary
3. Rate friends on a 1-5 star scale
4. Send invitations to new people
5. Check pending invitations
6. View detailed ratings and feedback

## Security Best Practices

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Protected routes require authentication
- ✅ CORS configured for allowed origins
- ✅ Input validation with express-validator
- ✅ Environment variables for sensitive data

## Improvements & Future Features

- [ ] Real-time notifications with Socket.io
- [ ] User profile picture uploads
- [ ] Rating badges/achievements
- [ ] Block/unblock users
- [ ] Advanced search filters
- [ ] User recommendations
- [ ] OAuth integration (Google, GitHub)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Rating appeal system

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access for Atlas

**Email Not Sending:**
- Use app password (not regular password) for Gmail
- Enable "Less secure app access" for other providers
- Check email configuration in `.env`

**CORS Errors:**
- Verify `FRONTEND_URL` matches your frontend domain
- Check CORS middleware in `server.js`

**Port Already in Use:**
- Change PORT in `.env`
- Or kill the process: `lsof -i :5000` then `kill -9 <PID>`

## Support & Contribution

For issues or feature requests, please open an issue in the repository.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Happy rating! 🌟**
