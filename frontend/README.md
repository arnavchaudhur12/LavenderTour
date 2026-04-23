# Frontend README

This app lives in:
- `/Users/arnab/Documents/New project/frontend`

It is a Next.js 14 App Router frontend for Lavender Tour.

## What the frontend currently includes

- rotating hero background slideshow
- India destination galleries
- abroad gallery collections
- login / sign up / forgot password / reset password
- persistent browser auth state
- questionnaire enquiry form
- success popup after enquiry submission

## Important frontend files

- `/Users/arnab/Documents/New project/frontend/app/page.tsx` - homepage
- `/Users/arnab/Documents/New project/frontend/app/login/page.tsx` - auth page
- `/Users/arnab/Documents/New project/frontend/app/components/NavBar.tsx` - top navigation
- `/Users/arnab/Documents/New project/frontend/app/components/AuthProvider.tsx` - local session persistence
- `/Users/arnab/Documents/New project/frontend/app/components/Survey.tsx` - questionnaire flow
- `/Users/arnab/Documents/New project/frontend/app/components/HeroBackgroundSlideshow.tsx` - background slideshow
- `/Users/arnab/Documents/New project/frontend/app/components/DestinationExplorer.tsx` - destination gallery UI
- `/Users/arnab/Documents/New project/frontend/app/lib/wikimedia.ts` - public image fetching

## Local setup

```bash
cd "/Users/arnab/Documents/New project/frontend"
npm install
```

## Run locally

If the backend is running on `127.0.0.1:8000`:

```bash
cd "/Users/arnab/Documents/New project/frontend"
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api npm run dev -- --port 3001
```

Open:
- `http://localhost:3001`

## Important API base URL rule

This frontend must know the backend URL at build time for production.

That is why:
- local dev uses:
  - `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`
- prod build uses:
  - `NEXT_PUBLIC_API_URL=https://lavendertour.in/api`

The Dockerfile now accepts `NEXT_PUBLIC_API_URL` as a build arg and environment variable.

## Frontend Docker build

Dockerfile:
- `/Users/arnab/Documents/New project/frontend/Dockerfile`

Manual build:

```bash
cd "/Users/arnab/Documents/New project/frontend"
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://lavendertour.in/api \
  -t lavendertour-frontend .
```

Manual run:

```bash
docker run --rm -p 3000:3000 lavendertour-frontend
```

## Production build verification

```bash
cd "/Users/arnab/Documents/New project/frontend"
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api npm run build
```

## Auth UI behavior

- Create account asks for:
  - first name
  - email
  - phone
  - password
- Login persists browser state through local storage
- Navbar changes after login and shows:
  - `Welcome <first name>`
- `Show password` is available on login, sign up, and reset password flows

## Questionnaire behavior

- user fills the form
- button says `Enquire now`
- frontend sends data to:
  - `POST /api/quotes/enquiry`
- success popup appears after successful submission
- backend sends the enquiry to customer care email

## Design notes

- the hero uses public Wikimedia images
- slideshow advances every 2 seconds
- navbar and hero cards were darkened for better readability
- destination images are fetched live rather than stored in the repo

## Common local issues

### Register/login hits `http://localhost:8000/...` on the deployed site

Cause:
- frontend bundle was built without `NEXT_PUBLIC_API_URL`

Fix:
- rebuild frontend with build arg
- update VPS compose file to pass:

```yaml
args:
  NEXT_PUBLIC_API_URL: https://lavendertour.in/api
```

### UI works locally but not in production

Check:
- browser Network tab request URL
- frontend container rebuild actually happened
- nginx is proxying `/api` to the backend

## Frontend smoke checks

Home page:

```bash
curl -I https://lavendertour.in
```

Login page:

```bash
curl -I https://lavendertour.in/login
```

API route base correctness:

In the browser devtools Network tab, auth requests should go to:
- `https://lavendertour.in/api/...` in prod
- `https://stage.lavendertour.in/api/...` in stage
- `https://dev.lavendertour.in/api/...` in dev
