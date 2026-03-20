# Vercel Deployment Guide - Luxury Estate Showcase

This guide will help you deploy the Luxury Estate Showcase project to Vercel. The project is a monorepo containing:

- **Frontend**: React/Vite app (dar-al-naseem) - the main website
- **API Server**: Express.js backend (api-server) - handles API requests
- **Shared Libraries**: Database schemas, API validation, and API client

## Prerequisites

1. **Vercel Account**: Create a free account at https://vercel.com
2. **Git Repository**: Your project should be pushed to GitHub, GitLab, or Bitbucket
3. **Node.js**: Installed locally for testing
4. **pnpm**: Package manager used in this project

## Step 1: Prepare Your Repository

### 1.1 Push to Git

Make sure your code is pushed to a Git repository:

```bash
cd c:\Users\fk773\Downloads\Luxury-Estate-Showcase
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 1.2 Verify Configuration Files

The following files have been created for Vercel:

- ✅ `vercel.json` - Main Vercel configuration
- ✅ `.vercelignore` - Files to ignore during build
- ✅ Updated `artifacts/dar-al-naseem/vite.config.ts` - Vercel-compatible build config

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Authenticate**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd c:\Users\fk773\Downloads\Luxury-Estate-Showcase
   vercel
   ```

4. **Follow the prompts**:
   - Select "y" to link to an existing project or create a new one
   - Choose your GitHub/GitLab/Bitbucket account
   - Confirm project settings
   - Environment variables will be auto-configured

### Option B: Using Vercel Web Interface

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your Git repository
4. Configure project settings:
   - **Framework**: Vite
   - **Root Directory**: ./ (leave as is)
   - **Build Command**: Already configured in `vercel.json`
   - **Install Command**: Already configured in `vercel.json`
   - **Output Directory**: `artifacts/dar-al-naseem/dist`
5. Add Environment Variables (Optional - usually auto-configured):
   - `PORT`: `3000`
   - `BASE_PATH`: `/`
6. Click "Deploy"

## Step 3: Environment Variables (If Needed)

If you need to set custom environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables like:
   - `API_URL`: Your API endpoint
   - `DATABASE_URL`: Database connection string (if using a backend database)
   - Any other sensitive configuration

**Note**: Sensitive information should NEVER be committed to Git. Use `.env.local` locally and set variables in Vercel dashboard.

## Step 4: Verification

After deployment:

1. **Check Deployment Status**: View logs in Vercel dashboard
2. **Test Frontend**: Visit your deployed URL
3. **Test API Routes**: Visit `https://your-domain.vercel.app/api/health` (if available)
4. **Check Console Errors**: Open browser DevTools → Console tab

## Troubleshooting

### Build Fails with "PORT is required"

**Solution**: The vite.config.ts now defaults to port 3000 if PORT is not set. Make sure you're using the updated config file.

### API Routes Not Working

**Current Setup**: The API server is configured in `vercel.json` but requires proper serverless function setup. You may need to:

1. Create an `api` directory at the root with serverless functions
2. Or use a separate Vercel deployment for the backend
3. Update API_URL in frontend to point to the correct backend

### Deployment Timeout

**Solutions**:
- Increase timeout in `vercel.json`
- Check build logs for performance issues
- Ensure `pnpm-lock.yaml` is committed to Git
- Try clearing Vercel cache: `vercel env list` → select environment → clear

### Dependency Issues

**Solutions**:
- Delete `node_modules` and lock files locally
- Run `pnpm install` to regenerate lock files
- Commit updated `pnpm-lock.yaml`
- Try deploying again

## Project Structure for Deployment

```
Luxury-Estate-Showcase/
├── vercel.json                 ← Deployment config ✅
├── .vercelignore              ← Files to ignore ✅
├── pnpm-lock.yaml             ← Lock file (MUST commit)
├── package.json
├── artifacts/
│   ├── dar-al-naseem/         ← Frontend (deployed as main site)
│   │   ├── vite.config.ts     ← Updated for Vercel ✅
│   │   ├── dist/              ← Built files (auto-generated)
│   │   └── src/
│   └── api-server/            ← Backend API
├── lib/
│   ├── api-client-react/      ← React API client
│   ├── api-spec/              ← OpenAPI spec
│   └── api-zod/               ← Zod validation schemas
```

## Next Steps

### For Frontend Only (Recommended for Start)

If you only want to deploy the frontend without the backend API:

1. The current config will deploy `dar-al-naseem` as the main site
2. Generate a static build that works standalone
3. You can add the API backend later as a separate deployment

### For Full Stack Deployment

To deploy both frontend + API as one project:

1. Restructure API into serverless functions (requires more setup)
2. Or deploy API separately to a different Vercel project
3. Update frontend to call the API backend URL

### Recommended Deployment Strategy

1. **Deploy Frontend First**: Get `dar-al-naseem` live on Vercel
2. **Test Static Site**: Ensure all pages load correctly
3. **Deploy API Later**: Set up backend API separately (using Vercel Functions or another host)
4. **Connect Frontend to API**: Update environment variables to point to the deployed API

## Useful Commands

```bash
# View Vercel logs
vercel logs [deployment-url]

# List deployments
vercel list

# Promote a deployment to production
vercel promote [deployment-url]

# Pull environment variables
vercel env pull

# Open project
vercel open
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment on Vercel](https://vitejs.dev/guide/deploy.html#vercel)
- [Monorepo Deployment](https://vercel.com/docs/concepts/monorepos)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support & Issues

If you encounter issues:

1. Check Vercel deployment logs: Dashboard → Project → Deployments → Click the failed deployment
2. Review build output for error messages
3. Verify all required files are committed to Git
4. Ensure `pnpm-lock.yaml` is up to date

---

**Good luck with your deployment! 🚀**
