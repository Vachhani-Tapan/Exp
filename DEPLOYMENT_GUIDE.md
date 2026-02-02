# 🚀 LedgerCore MongoDB Deployment Guide

This guide details how to deploy LedgerCore with **Permanent Cloud Storage** using **Render** and **MongoDB Atlas**.

---

## 🏗️ Architecture
- **Frontend:** HTML5/CSS3/React (Served as static files by Node.js)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (Cloud Database)

---

## 🎯 Step 1: Set Up MongoDB Atlas (Permanent Storage)

Render's free tier deletes local files every time the server restarts. To keep your data forever, you MUST use a cloud database.

1.  **Create Account:** Sign up for a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create Cluster:** Click "Create" and select the **M0 Shared (Free)** tier.
3.  **Network Access:** Go to "Network Access" -> "Add IP Address" -> Select **"Allow Access from Anywhere"** (Required for Render).
4.  **Database User:** Go to "Database Access" -> "Add New Database User". Create a username and password (remember these!).

---

## 🔍 How to Find Your Connection URI

If you're stuck finding the connection string, follow these specific clicks:

1.  Go to the **"Database"** tab (under "Deployment" in the left sidebar).
2.  Locate your cluster (usually named `Cluster0`).
3.  Click the **"Connect"** button next to your cluster name.
4.  In the popup, choose **"Drivers"** (It's usually the first option).
5.  Under **"1. Select your driver and version"**, ensure **"Node.js"** is selected.
6.  Look at **"3. Add your connection string into your application code"**.
7.  **Copy the link** that looks like this:
    `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`

> [!IMPORTANT]
> **Don't forget to edit the link!**
> Replace `<password>` with the password you created for your database user.
> Add `ledgercore` after the `/` and before the `?` to keep your data organized.

---

## 🎯 Step 2: Push to GitHub

1.  **Commit changes:** 
    ```bash
    git add .
    git commit -m "Migrate to MongoDB for persistence"
    git push origin main
    ```

---

## 🎯 Step 3: Deploy to Render

1.  **Go to Render:** [dashboard.render.com](https://dashboard.render.com)
2.  **New Web Service:** Select "+ New" -> "Web Service".
3.  **Connect Repo:** Select your `ledgercore` repository.
4.  **Configuration:**
    - **Runtime:** `Node`
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
5.  **Environment Variables (CRITICAL):**
    - Click **"Environment"** or **"Advanced"**.
    - Add Variable: `MONGODB_URI`
    - Value: Paste your **MongoDB Atlas URI** (with your password replaced).
    - Click **"Save Changes"**.

---

## 🎯 Step 4: Verify Your Deployment

1.  Wait for the logs to say `Successfully connected to MongoDB`.
2.  Open your live URL (e.g., `https://ledgercore.onrender.com`).
3.  **Sign Up:** Create an admin account.
4.  **Test Persistence:** Refresh the page or wait a few hours; your data will now be stored safely in the cloud and will **never disappear**.

---

## 🆘 Common Issues

### "Cannot connect to MongoDB"
- Ensure you "Allowed Access from Anywhere" in MongoDB Atlas Network settings.
- Check that your username/password in the URI are correct.

### "Deployment failing - npm not found"
- Ensure your `package.json` is in the root directory and has a `"start": "node server.js"` script.

---

**LedgerCore is now powered by MongoDB 🚀**
