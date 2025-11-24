# Ratify Setup Guide

## Quick Start (Development)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create/update `.env` file with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ratify
JWT_SECRET=dev-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

## Production Deployment

### Option 1: Heroku + Netlify

**Backend (Heroku):**
1. `heroku login`
2. `heroku create ratify-api`
3. Set environment variables in Heroku dashboard
4. Push to Heroku

**Frontend (Netlify):**
1. Build: `npm run build`
2. Deploy `build` folder to Netlify
3. Set build command: `npm run build`

### Option 2: AWS/DigitalOcean

1. Set up Ubuntu VM
2. Install Node.js and MongoDB
3. Clone repo and setup backend
4. Use PM2 for process management: `pm2 start server.js`
5. Use Nginx as reverse proxy
6. Deploy frontend to S3 + CloudFront or similar CDN

### Option 3: Docker Compose (Local/VPS)

```bash
docker-compose up -d
```

## Testing

### Backend API Testing
```bash
# Test health check
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Frontend Testing
- Create account at http://localhost:3000/signup
- Login and test rating system
- Try sending invitations

## Configuration Files

### Backend `.env` (required)
All variables in `.env` must be set for production

### Frontend `.env` (required)
- `REACT_APP_API_URL` - Backend API URL

## Database Setup

### MongoDB Local:
```bash
mongod
```

### MongoDB Atlas (Cloud):
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to `MONGODB_URI` in backend `.env`

## Email Service Setup

Gmail with App Password:
1. https://myaccount.google.com/apppasswords
2. Generate password for "Mail"
3. Use in EMAIL_PASSWORD

## Next Steps After Deployment

1. Enable HTTPS/SSL certificate
2. Set strong JWT_SECRET
3. Configure proper error logging
4. Set up database backups
5. Monitor performance
6. Enable rate limiting
7. Add analytics

## Support

Check README.md for full documentation
