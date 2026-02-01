# 🚀 LedgerCore Deployment Guide

## Platform: Render (All-in-One Deployment)

**Why Render?** It supports Node.js + SQLite + Static Frontend in one place, with a free tier.

---

## 📁 File Structure Overview

```
exp/
├── index.html          → Frontend (React app)
├── server.js           → Backend API
├── database.js         → Database setup
├── package.json        → Dependencies
├── .gitignore          → Files to ignore
└── data/               → Database storage (auto-created)
    └── .ledgercore.db  → SQLite database
```

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Project

1. **Create a `package.json` if you don't have one:**
   ```bash
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express cors body-parser bcryptjs sqlite3
   ```

3. **Update `package.json` to include a start script:**
   ```json
   {
     "name": "ledgercore",
     "version": "1.0.0",
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "cors": "^2.8.5",
       "body-parser": "^1.20.2",
       "bcryptjs": "^2.4.3",
       "sqlite3": "^5.1.6"
     }
   }
   ```

---

### Step 2: Update Your Code for Production

#### **A. Update `server.js`**

Add this code to serve your `index.html` file:

```javascript
// Add AFTER all your API routes, BEFORE app.listen()

// Serve static frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
```

#### **B. Update `index.html` API URL**

Find this line in `index.html` (around line 1550):

```javascript
const API_URL = 'http://localhost:5000/api';
```

Replace it with:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api';
```

This makes it work both locally and in production!

---

### Step 3: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - LedgerCore"
   ```

2. **Create a new repository on GitHub** at https://github.com/new

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ledgercore.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 4: Deploy to Render

1. **Go to Render:** https://render.com
2. **Sign up** with your GitHub account
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository** (`ledgercore`)

5. **Configure the service:**
   - **Name:** `ledgercore`
   - **Region:** Select closest to you
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` ⭐

6. **Add Environment Variables** (Optional):
   - Click "Advanced"
   - Add: `PORT` = `5000` (usually auto-detected)

7. **Click "Create Web Service"** 🎉

---

### Step 5: Wait for Deployment

- Render will:
  1. ✅ Clone your repository
  2. ✅ Install dependencies
  3. ✅ Start your server
  4. ✅ Give you a live URL like: `https://ledgercore.onrender.com`

- **First deploy takes 2-3 minutes**
- Watch the logs in real-time!

---

## 🔗 How Frontend & Backend Are Linked

### In Development (Local):
```
Frontend (index.html) → http://localhost:5000 → Backend (server.js)
```

### In Production (Render):
```
User → https://ledgercore.onrender.com/ → index.html (Frontend)
Frontend → https://ledgercore.onrender.com/api/* → server.js (Backend)
```

**They run on the SAME server!** 🎯

---

## 💾 Database Handling

### SQLite on Render:
- ✅ Your SQLite database (`data/.ledgercore.db`) will be created automatically
- ✅ Data persists on Render's disk storage
- ⚠️ **Important:** Free tier instances may sleep after inactivity, but data is preserved

### Database Persistence:
- Render's free tier keeps your database as long as the service exists
- For critical production data, consider upgrading to a paid plan
- Or migrate to **Render PostgreSQL** (more reliable for production)

---

## 🧪 Testing Your Deployment

1. **Visit your deployed URL:** `https://ledgercore.onrender.com`
2. **Sign up** for a test account
3. **Add expenses** and verify they save correctly
4. **Refresh the page** - your session should persist!

---

## 🔄 Updating Your App

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

**Render auto-deploys!** Your site updates in 1-2 minutes. 🚀

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Instance sleeps after 15 min of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (roughly unlimited for one service)

### To Prevent Sleep:
- Use a service like **UptimeRobot** to ping your app every 10 minutes
- Or upgrade to Render's paid plan ($7/month)

---

## 🎉 You're Live!

Your LedgerCore app is now:
- ✅ Accessible from anywhere
- ✅ Fully functional with database
- ✅ Auto-deploying on every Git push
- ✅ Using persistent SQLite storage

**Share your link:** `https://ledgercore.onrender.com`

---

## 🆘 Troubleshooting

### Issue: "Application Error" or 503
- **Check Render logs** for errors
- Ensure `package.json` has correct dependencies
- Verify `PORT` is read from `process.env.PORT`

### Issue: Database not saving
- Check that `data/` folder is created
- Ensure `.gitignore` includes `data/` but Render will recreate it
- Review server logs for SQLite errors

### Issue: Frontend can't reach backend
- Verify API_URL is set correctly in `index.html`
- Check CORS is enabled in `server.js`
- Inspect browser console for errors

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Community:** https://community.render.com
- **Status:** https://status.render.com

Happy Deploying! 🚀
