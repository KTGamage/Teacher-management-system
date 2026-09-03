# Railway Deployment Guide - KCC Teacher Management System

## Prerequisites
- Railway account (https://railway.app)
- Git repository pushed to GitHub/GitLab/Bitbucket

## Step 1: Prepare Your Repository

All necessary files have been created:
- ✅ `nixpacks.toml` - Railway build configuration
- ✅ `Procfile` - Process start command
- ✅ `.env.example` - Updated for production with MySQL

Commit and push these changes:
```bash
git add .
git commit -m "feat: add Railway deployment configuration"
git push origin kasun2-branch
```

## Step 2: Create Railway Project

1. Go to https://railway.app and sign in
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository and branch (`kasun2-branch`)
5. Railway will automatically detect it as a Laravel app

## Step 3: Add MySQL Database

1. In your Railway project dashboard, click **New**
2. Select **Database** → **Add MySQL**
3. Railway will automatically create a MySQL service and inject environment variables:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

The `.env.example` is already configured to use these variables.

## Step 4: Configure Environment Variables

In your Railway project, go to **Variables** and add:

### Required
- `APP_NAME` = `KCC TMS`
- `APP_ENV` = `production`
- `APP_KEY` = (generate using command below)
- `APP_DEBUG` = `false`
- `APP_URL` = (Railway will provide this, e.g., `https://your-app.railway.app`)

### Generate APP_KEY
Run locally and copy the key:
```bash
php artisan key:generate --show
```
The output looks like: `base64:xxxxxxxxxxxxxxxxxxxxx`

### Optional (Already set by Railway/MySQL)
- Database vars are auto-injected by the MySQL service
- `PORT` is auto-set by Railway

## Step 5: Deploy

1. Railway will automatically deploy when you push to your branch
2. Monitor deployment logs in the **Deployments** tab
3. First deployment takes 3-5 minutes:
   - Install Composer dependencies
   - Install NPM dependencies
   - Build Vite assets
   - Run migrations
   - Start server

## Step 6: Seed Database (First Time Only)

After first successful deployment, open **Railway Shell** and run:
```bash
php artisan db:seed
```

This will create:
- 1 Admin account (admin@kcc.lk / password)
- 4 Teachers
- 3 Students
- Sample sections, classrooms, and subjects

## Step 7: Access Your App

Railway provides a public URL like: `https://teacher-management-system-production.up.railway.app`

**Default login credentials:**
- Admin: `admin@kcc.lk` / `password`
- Teacher: `nimal@kcc.lk` / `password`
- Student: `kasun@student.kcc.lk` / `password`

⚠️ **Security**: Change all default passwords after first login!

## Troubleshooting

### Build fails with "npm not found"
- Check `nixpacks.toml` includes `nodejs-18_x`

### Database connection error
- Verify MySQL service is linked to your app
- Check Variables tab for `MYSQL*` environment variables

### Assets not loading (404 on JS/CSS)
- Ensure `npm run build` ran successfully in build logs
- Check `APP_URL` matches your Railway domain

### Migration errors
- Check Railway logs for specific error
- Verify database credentials are correct

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `kcc-tms.yourdomain.com`)
4. Add the CNAME record to your DNS provider
5. Update `APP_URL` environment variable

## Continuous Deployment

Every push to `kasun2-branch` will automatically trigger a new deployment on Railway.

## Cost Estimate

Railway Free Tier includes:
- $5 free credit per month
- ~500 hours of compute
- Sufficient for small projects and testing

For production use, expect ~$10-20/month (app + MySQL).

## Maintenance

### View Logs
Railway Dashboard → **Deployments** → Select deployment → **View Logs**

### Restart Service
Railway Dashboard → **Settings** → **Restart**

### Run Artisan Commands
Railway Dashboard → **Shell** tab → Run commands directly

---

**Need help?** Railway docs: https://docs.railway.app/guides/laravel
