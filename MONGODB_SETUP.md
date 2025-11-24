# MongoDB Setup - Choose One Option

## Option 1: MongoDB Atlas (Cloud - Easiest)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create an account
4. Create a new project
5. Create a cluster (select free tier)
6. Wait for cluster to deploy (~5-10 minutes)
7. Click "Connect"
8. Choose "Drivers"
9. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/ratify?retryWrites=true&w=majority`)
10. Replace YOUR_PASSWORD and YOUR_USERNAME in the connection string
11. Update backend/.env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ratify?retryWrites=true&w=majority
```

## Option 2: MongoDB Local (Requires Installation)

1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install it
3. Start MongoDB service:
   - On Windows, MongoDB starts automatically as a service
   - Or run: `mongod` in PowerShell

4. Your connection string stays as default:
```
MONGODB_URI=mongodb://localhost:27017/ratify
```

## Quick Fix for Now

Use this temporary connection string in backend/.env to test:
```
MONGODB_URI=mongodb+srv://testuser:testpass@cluster0.mongodb.net/ratify?retryWrites=true&w=majority
```

Or download MongoDB Community and run it locally.
