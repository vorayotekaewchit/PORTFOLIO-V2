# Deployment Guide

## ✅ Code Pushed to GitHub

Your code has been successfully pushed to: https://github.com/vorayotekaewchit/PORTFOLIO-V2

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository:
   - Select `vorayotekaewchit/PORTFOLIO-V2`
   - Vercel will auto-detect Vite settings
4. Configure build settings (auto-detected):
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` (or `npm install`)
5. Click **"Deploy"**

Vercel will automatically:
- Install dependencies
- Build your project
- Deploy to a production URL
- Set up automatic deployments on every push to `main`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Navigate to project directory
cd "/Users/vorayotekaewchit/Portfolio V2"

# Deploy
vercel

# For production deployment
vercel --prod
```

Follow the prompts to:
- Link to your Vercel account
- Link to your GitHub repository
- Confirm project settings

## 📋 Vercel Configuration

Your `vercel.json` is already configured:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install"
}
```

## 🔧 Environment Variables

No environment variables needed for this project. If you add audio features later, you may need to configure:
- `VITE_SOUNDCLOUD_CLIENT_ID` (if using SoundCloud API)
- `VITE_AUDIO_ENABLED` (for audio reactivity)

## 📦 Build Optimization

Your project is optimized for:
- **Bundle size**: <200kb target
- **Performance**: 60fps WebGL rendering
- **PWA**: Service worker configured
- **Code splitting**: Three.js and GSAP in separate chunks

## 🔄 Continuous Deployment

Once connected to Vercel:
- Every push to `main` branch = automatic production deployment
- Pull requests = preview deployments
- Custom domains can be added in Vercel dashboard

## 🎯 Post-Deployment

After deployment, you can:
1. Add a custom domain in Vercel settings
2. Configure analytics
3. Set up environment variables if needed
4. Enable preview deployments for PRs

## 🐛 Troubleshooting

### Build Fails
- Check that `pnpm` is available (or use `npm`)
- Verify all dependencies in `package.json`
- Check build logs in Vercel dashboard

### WebGL Not Working
- Ensure HTTPS is enabled (Vercel provides this automatically)
- Check browser console for WebGL errors
- Verify Three.js is loading correctly

### Audio Not Working
- Web Audio API requires user interaction (click) on some browsers
- Check browser console for audio context errors

---

**Your portfolio is ready to deploy!** 🚀

Visit: https://vercel.com/new to get started.
