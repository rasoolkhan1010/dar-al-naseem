# Vercel Deployment Checklist

## Pre-Deployment Checklist

### Repository & Git
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] `pnpm-lock.yaml` is committed (do NOT use `package-lock.json` or `yarn.lock`)
- [ ] `.gitignore` includes `node_modules/` and sensitive files
- [ ] No uncommitted changes with `git status`

### Configuration Files
- [ ] ✅ `vercel.json` exists at root
- [ ] ✅ `.vercelignore` exists at root
- [ ] ✅ `artifacts/dar-al-naseem/vite.config.ts` updated for Vercel
- [ ] ✅ `VERCEL_DEPLOYMENT.md` created for reference

### Dependencies
- [ ] `pnpm` is listed as `packageManager` in root `package.json` ✅
- [ ] All dependencies are installable: Run `pnpm install` locally
- [ ] No `package-lock.json` or `yarn.lock` files (conflicts with pnpm)

### Build Verification
Run locally before deploying:

```bash
# 1. Clean install
pnpm install --frozen-lockfile

# 2. Type check
pnpm run typecheck

# 3. Build
pnpm run build

# 4. Check build output
ls artifacts/dar-al-naseem/dist/
```

## Deployment Steps

### Using Vercel CLI
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Navigate to project
cd C:\Users\fk773\Downloads\Luxury-Estate-Showcase

# 4. Deploy
vercel
```

### Or Use Web Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Connect your Git repository
4. Click "Deploy"

## Post-Deployment

### Immediate Tests
- [ ] Visit deployed URL
- [ ] Test responsive design on mobile
- [ ] Check for console errors (DevTools → Console)
- [ ] Test navigation/routing
- [ ] Verify images and assets load

### Integration Tests
- [ ] Test any forms
- [ ] Test API calls (if backend is deployed)
- [ ] Check third-party integrations
- [ ] Test in different browsers

### Production Setup
- [ ] Set custom domain (if needed)
- [ ] Enable auto-deployments from main branch
- [ ] Configure branch rules for preview deployments
- [ ] Add environment variables (if any)
- [ ] Set up monitoring/analytics

## Rollback Plan

If something goes wrong:

1. **Quick Rollback**: Vercel dashboard → Deployments → Select previous working deployment → Click "..." → "Promote to Production"
2. **Local Revert**: `git revert HEAD` → `git push` → Redeploy
3. **Branch Strategy**: Keep deploying from `main` or use `production` branch for releases

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Build fails** | Check logs in Vercel dashboard |
| **PORT required error** | vite.config.ts defaults to 3000 now ✅ |
| **Module not found** | Run `pnpm install` locally to test |
| **API not working** | API server needs separate deployment setup |
| **Styling broken** | Check Tailwind CSS build in vite.config.ts ✅ |
| **Assets not loading** | Verify asset paths use relative URLs |

## What's Been Set Up ✅

1. **vercel.json** - Configures build, environment, and routing
2. **Vite config** - Updated to support both Replit and Vercel
3. **Environment defaults** - PORT and BASE_PATH have fallbacks
4. **.vercelignore** - Optimizes build size
5. **Documentation** - VERCEL_DEPLOYMENT.md with detailed guide

## Next Actions

### Immediate (Now)
1. ✅ Ensure all files are committed
2. ✅ Run `pnpm install` to verify no errors
3. ✅ Run `pnpm run build` to ensure build works locally

### Short-term (Today/This Week)
1. Deploy to Vercel using CLI or Web Dashboard
2. Test the deployed site
3. Configure custom domain if needed

### Medium-term (This Month)
1. Set up backend API deployment
2. Configure environment variables
3. Add monitoring/analytics
4. Set up CI/CD pipelines

## Contacts & Support

- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Check your repo's issues tab
- Vercel Community: https://github.com/vercel/vercel/discussions

---

**Status**: Ready for deployment! 🚀

Last updated: 2026-03-20
