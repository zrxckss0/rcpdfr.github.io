# Roblox Stats Proxy (Cloudflare Worker)

Use `cloudflare-worker.js` as a minimal backend proxy for GitHub Pages.

## Why
Roblox game endpoints do not provide permissive CORS for browser-only frontend requests.
This proxy calls Roblox server-side and returns only the values the site needs.

## Deploy
1. Install Wrangler (`npm i -g wrangler`).
2. Create a Worker and paste the code from `cloudflare-worker.js`.
3. Deploy your Worker.
4. Update `script.js`:
   - Replace `https://your-proxy-domain.example/api/roblox-stats` with your Worker URL.
   - Or set `window.RCPDFR_PROXY_URL` before loading `script.js`.

## Example endpoint
`https://your-worker-subdomain.workers.dev?placeId=1486528523`
