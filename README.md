# TEDDY AI Studio

An AI website-builder starter project for creating and editing website drafts, previewing generated HTML, managing bot project uploads/imports, configuring per-creator Deriv referral settings, and preparing projects for Vercel deployment.

> **Important:** This is a starter scaffold, not a fully production-ready multi-tenant SaaS. The AI generation endpoint works when `OPENAI_API_KEY` is configured. Bot uploads are held in memory in this demo and are not durable. The Vercel deployment endpoint validates configuration but intentionally does not deploy arbitrary uploaded code. Complete authentication, database/storage, isolated build workers, abuse controls, and the Vercel integration before public launch.

## Features included

- Responsive dark dashboard UI.
- AI prompt-to-HTML draft generation using the OpenAI API.
- Sandboxed HTML preview using an iframe with a restrictive sandbox.
- Local browser draft editing and HTML download.
- Bot project upload UI for ZIP/source archives (metadata only in this starter).
- Public GitHub repository URL import validation (does not clone or execute the repository).
- Per-session Deriv app ID and affiliate URL settings preview.
- Manual custom-domain entry and DNS guidance UI.
- Vercel deployment configuration endpoint scaffold.
- API routes with input validation and basic safeguards.

## Requirements

- Node.js 20 or newer
- npm
- An OpenAI API key for AI generation (or adapt the API route to your provider)

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

Add your real values to `.env.local`. Do not commit `.env.local` or paste secrets into client-side code.

## Environment variables

| Variable | Required? | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | For AI generation | Secret API key used only on the server by `/api/generate`. |
| `OPENAI_MODEL` | Optional | Model name accepted by your OpenAI account; defaults to `gpt-4o-mini`. |
| `VERCEL_TOKEN` | Optional; deployment integration | Server-side Vercel API token. Keep it secret. Use a restricted integration/token where possible. |
| `VERCEL_TEAM_ID` | Optional | Team ID if deploying under a Vercel team. |
| `NEXT_PUBLIC_DERIV_LANDING_URL` | Optional | Default public Deriv landing URL used for links. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Public base URL for this app, e.g. `https://your-builder.vercel.app`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL; reserved for a future database/auth integration. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase public/anon key; reserved for future integration. Apply database RLS policies before using. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only Supabase service key; never expose it to the browser. Reserved for future integration. |
| `STORAGE_ENDPOINT` | Optional | S3-compatible object storage endpoint for production uploads. |
| `STORAGE_BUCKET` | Optional | Private object-storage bucket name. |
| `STORAGE_ACCESS_KEY_ID` | Optional | Server-side object-storage access key. |
| `STORAGE_SECRET_ACCESS_KEY` | Optional | Server-side object-storage secret. |
| `STORAGE_REGION` | Optional | Object-storage region. |

### Configure environment variables on Vercel

1. Open your project in the Vercel dashboard.
2. Go to **Settings → Environment Variables**.
3. Add each required variable for Development, Preview, and/or Production as appropriate.
4. Redeploy after changing environment variables.

## Deploy the builder to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Set the environment variables listed above.
4. Deploy.

Vercel docs: <https://vercel.com/docs>

## How to use

### Generate a website
Type a prompt in the AI Studio and select **Generate website**. The app asks the server-side AI route for a self-contained HTML draft. You can edit the source, preview it, and download the HTML file.

### Upload or import bots
The current upload and import panels are prototype interfaces. They validate file extensions / GitHub URL shape but do not persist files or run bot code. For production:
- Store files in private object storage.
- Authenticate users and check ownership.
- Apply file size/type limits and malware scanning.
- Inspect archives for path traversal and decompression bombs.
- Never run uploaded code on the web server.
- Build/test untrusted projects in short-lived isolated workers with network restrictions.
- Respect repository licences and only import projects you are authorized to use.

### Deriv app IDs and affiliate links
The UI lets a creator enter an app ID and an affiliate/referral URL for the current browser session. This starter does not save creator settings to a database and does not guarantee that a custom app ID supports every redirect domain. Configure the app and callback URLs with Deriv as required, validate affiliate URLs, and persist each creator's settings against an authenticated account in a production database. Do not collect or store Deriv passwords or access tokens.

Official API resources: <https://api.deriv.com/>

### Custom domains
The UI collects a domain and displays generic DNS setup guidance. It does not automatically add the domain to Vercel yet. For production, authenticate the project owner, call the Vercel Domains API server-side, verify domain ownership, and show the actual DNS records returned by Vercel:
<https://vercel.com/docs/rest-api>

### Vercel deployments
`/api/deploy` is a protected-by-configuration scaffold that checks whether `VERCEL_TOKEN` exists. It intentionally does not accept arbitrary source files and deploy them. A production deploy flow should package a validated project, enforce user/project permissions, use the Vercel API, and record deployment status.

## Security checklist before public launch

- Add authentication and per-user authorization.
- Add a database and row-level security policies.
- Add rate limiting and usage quotas to AI routes.
- Keep provider and deployment secrets server-side.
- Add bot upload storage, virus scanning, and isolated build/test workers.
- Validate allowed domains and URL schemes to prevent SSRF and malicious links.
- Add audit logs, abuse reporting, terms, privacy policy, and copyright takedown process.
- Do not promise profitable trading signals; clearly label risk and test bots in demo environments.
- Test API routes and deployment behavior before enabling public users.

## Project structure

```text
src/
  app/
    api/
      generate/route.ts
      deploy/route.ts
      import/route.ts
    globals.css
    layout.tsx
    page.tsx
```

## License

Choose a license before publishing the repository. Do not repackage third-party bots unless their license permits it.
