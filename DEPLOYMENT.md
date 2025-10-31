# Auto Deployment Guide

This project has been configured with GitHub Actions for automatic deployment. Choose one of the following platforms:

## 🚀 Option 1: Deploy to Vercel (Recommended)

### Setup Steps:

1. **Create a Vercel account** (if you don't have one)
   - Go to [vercel.com](https://vercel.com) and sign up

2. **Get your Vercel tokens:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel login` in your terminal
   - Run `vercel link` in your project directory to link your project
   - Or create a new project in Vercel dashboard and get the tokens

3. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to: **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `VERCEL_TOKEN`: Get from [vercel.com/account/tokens](https://vercel.com/account/tokens)
     - `VERCEL_ORG_ID`: Found in `.vercel/project.json` after running `vercel link`, or in Vercel dashboard
     - `VERCEL_PROJECT_ID`: Found in `.vercel/project.json` after running `vercel link`, or in Vercel dashboard

4. **Enable the workflow:**
   - The workflow file `.github/workflows/deploy-vercel.yml` is already created
   - Push your code to GitHub
   - Every push to `main` branch will automatically deploy

---

## 🌐 Option 2: Deploy to Netlify

### Setup Steps:

1. **Create a Netlify account** (if you don't have one)
   - Go to [netlify.com](https://netlify.com) and sign up

2. **Get your Netlify tokens:**
   - Go to [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
   - Click "New access token" and create a token
   - Copy the token

3. **Create a site in Netlify:**
   - In Netlify dashboard, create a new site
   - Copy the Site ID from the site settings

4. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to: **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify access token
     - `NETLIFY_SITE_ID`: Your Netlify site ID

5. **Enable the workflow:**
   - The workflow file `.github/workflows/deploy-netlify.yml` is already created
   - Push your code to GitHub
   - Every push to `main` branch will automatically deploy

**Note:** If using Netlify, you can delete `.github/workflows/deploy-vercel.yml` and `vercel.json` files if you don't need Vercel.

---

## 📦 Option 3: Deploy to GitHub Pages

If you prefer GitHub Pages, you can use this simpler approach:

1. Go to repository **Settings** → **Pages**
2. Set source to **GitHub Actions**
3. Create a workflow file (we can add this if needed)

---

## 🔧 Manual Setup (Alternative)

### Vercel CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Netlify CLI:
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

---

## ✅ Quick Start

1. **For Vercel:**
   - Add the 3 secrets to GitHub (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
   - Push to GitHub → Auto-deploys!

2. **For Netlify:**
   - Add the 2 secrets to GitHub (NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID)
   - Delete `.github/workflows/deploy-vercel.yml` (optional)
   - Push to GitHub → Auto-deploys!

---

## 🎯 Testing

After setup, make a small change and push to `main` branch. Check the **Actions** tab in your GitHub repository to see the deployment progress.

