# Deploy Ratify for FREE

## Option 1: GitHub + Vercel (Frontend) + Railway (Backend) - **RECOMMENDED**

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ratify.git
git push -u origin main
```

### Step 2: Deploy Backend to Railway (FREE)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select your `ratify` repo
5. Railway will detect it's a Node.js project
6. Add these environment variables in Railway dashboard:
   - `MONGODB_URI=mongodb://127.0.0.1:27017/ratify`
   - `JWT_SECRET=your-super-secret-key`
   - `EMAIL_USER=yonathangal12345@gmail.com`
   - `EMAIL_PASSWORD=uwyk lvsk sicl pdbg`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `NODE_ENV=production`
7. Click Deploy - **Done!**
8. Copy your Railway backend URL (looks like: `https://ratify-backend-production.railway.app`)

### Step 3: Deploy Frontend to Vercel (FREE)

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo
4. Set build command: `npm run build`
5. Add environment variables:
   - `REACT_APP_API_URL=https://your-railway-backend-url/api`
6. Click Deploy - **Done!**
7. Your app is live at `https://your-app.vercel.app`

---

## Option 2: Netlify (Frontend) + Render (Backend)

### Backend on Render:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Select root directory: `backend`
5. Build command: `npm install && npm start`
6. Add environment variables (same as above)
7. Deploy

### Frontend on Netlify:
1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect GitHub
4. Build command: `cd frontend && npm run build`
5. Publish directory: `frontend/build`
6. Add environment variables
7. Deploy

---

## Option 3: Using Railway + Vercel (Easiest)

### Railway (Backend + MongoDB)
- Railway includes FREE MongoDB Atlas alternative
- Just push your code, it auto-deploys
- Get a URL immediately

### Vercel (Frontend)
- Auto-deploys from GitHub
- Blazingly fast
- 100% free forever

---

## After Deployment

1. Update your frontend `.env` to point to your deployed backend
2. Test signup, login, and rating features
3. Share your app URL with friends!

Your app URL will be: `https://ratify-yourname.vercel.app`

---

## Troubleshooting

If backend doesn't connect:
- Check environment variables in deployment platform
- Verify MongoDB URI is correct
- Check email credentials

If frontend shows blank:
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Check browser console for errors
- Restart deployment

