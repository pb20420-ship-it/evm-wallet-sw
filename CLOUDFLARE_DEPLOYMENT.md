# Cloudflare Workers Deployment Guide

## Overview

This project has been configured to deploy to **Cloudflare Workers** with proper ES module support. However, due to the project's architecture (Express server + React frontend), there are two recommended deployment strategies.

## Option 1: Cloudflare Pages + Pages Functions (RECOMMENDED)

This is the **best approach** for your full-stack application.

### Setup

1. **Push your code to GitHub** (you've already done this)

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project" → "Connect to Git"
   - Select your GitHub repository

3. **Configure build settings:**
   - **Framework preset:** None (or Custom)
   - **Build command:** `npm run build:all`
   - **Build output directory:** `dist-ui`
   - **Environment variables:**
     ```
     NODE_ENV=production
     CORS_ORIGIN=your-domain.com
     ```

4. **Add Pages Functions for API routes:**
   Create `/functions/api/[[path]].ts`:
   ```typescript
   export async function onRequest(context) {
     // This can proxy to your backend or implement API logic
     const { pathname } = new URL(context.request.url);
     
     if (pathname.startsWith('/api/')) {
       // Forward to your backend or implement handlers
       return new Response('API endpoint', { status: 200 });
     }
     
     return context.next();
   }
   ```

5. **Deploy:**
   - Wrangler automatically deploys on git push
   - Pages Functions handle API routes
   - Static files served from `dist-ui`

---

## Option 2: Cloudflare Workers Only (Simple API)

If you only need a simple Workers endpoint:

### Setup

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   npm run build
   wrangler deploy
   ```

4. **Limitations:**
   - Express routes need to be manually converted to Fetch handlers
   - No direct file serving without Cloudflare Pages
   - Database/state management complexity increases

---

## Option 3: Hybrid Approach

Deploy the **UI to Cloudflare Pages** and **API to a traditional Node.js host** (Railway, Render, etc.):

1. Deploy UI: `npm run build` → upload `dist-ui` to Pages
2. Deploy API: Keep existing Express server on Railway/Heroku/Render
3. Configure CORS with your UI domain

---

## Current Configuration

### Files Added

- **`wrangler.toml`** - Cloudflare Workers config
- **`src/worker.ts`** - Simple Workers entry point
- **`tsconfig.json`** - Updated to use `"module": "esnext"`

### Build Scripts

```json
{
  "build": "vite build",                    // UI only
  "build:all": "vite build && npm run server:build", // UI + Server
  "server:build": "tsc -p tsconfig.server.json"    // Server only
}
```

---

## Recommended: Pages + Functions Architecture

```
your-domain.com/
├── / → Pages (React UI from dist-ui/)
├── /api/* → Functions (Route handlers)
└── dist-ui/index.html (SPA)
```

### Implementation Example

**`functions/api/health.ts`:**
```typescript
export async function onRequest(context) {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**`functions/api/balances/[address].ts`:**
```typescript
export async function onRequest(context) {
  const { address } = context.params;
  // Implement balance fetching logic
  return new Response(JSON.stringify({ address, balances: {} }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## Next Steps

1. **Choose your deployment strategy** (Pages recommended)
2. **Set up Cloudflare Pages/Workers account**
3. **Configure environment variables** in Wrangler dashboard
4. **Deploy:** `wrangler deploy` or push to GitHub for automatic Pages deployment
5. **Monitor:** Use Cloudflare dashboard to view logs and analytics

---

## Troubleshooting

### Module errors
- Ensure `tsconfig.json` has `"module": "esnext"`
- Check `wrangler.toml` for correct `main` path

### CORS issues
- Update `CORS_ORIGIN` environment variable
- Add CORS headers to all API responses

### Missing dependencies
- Keep `package.json` dependencies up to date
- Some Node.js APIs may not work in Workers (e.g., `fs`)

### Express incompatibility
- Cloudflare Workers uses the Fetch API, not Express
- Migrate routes to serverless functions gradually

---

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Fetch API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
