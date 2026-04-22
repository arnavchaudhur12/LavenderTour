# Lavender Tour

Lavender Tour is a full-stack travel planning application for `lavendertour.in`.

The project includes:
- a Next.js 14 frontend
- a FastAPI backend
- PostgreSQL-backed auth and enquiry persistence
- Docker-based local and VPS deployment flows
- branch-based environment deployment for `dev`, `stage`, and `prod`

## Repository layout

- `/Users/arnab/Documents/New project/frontend` - customer-facing Next.js app
- `/Users/arnab/Documents/New project/backend` - FastAPI API service
- `/Users/arnab/Documents/New project/deploy` - compose templates and deployment helpers
- `/Users/arnab/Documents/New project/docs` - operational documentation
- `/Users/arnab/Documents/New project/docker-compose.yml` - local full-stack dev stack
- `/Users/arnab/Documents/New project/docker-compose.prod.yml` - image-based runtime reference

## Current live environments

- `dev` -> `https://dev.lavendertour.in`
- `stage` -> `https://stage.lavendertour.in`
- `prod` -> `https://lavendertour.in`

## What the app currently does

- email/password registration and login
- persistent signed-in browser state
- password reset through email
- destination galleries for India and abroad
- rotating photographic hero background
- questionnaire-based travel enquiry flow
- customer-care email delivery for questionnaire submissions

## Documentation map

Read these in order if you are setting up the project from scratch:

1. `/Users/arnab/Documents/New project/README.md`
2. `/Users/arnab/Documents/New project/backend/README.md`
3. `/Users/arnab/Documents/New project/frontend/README.md`
4. `/Users/arnab/Documents/New project/docs/ENVIRONMENT_AND_SECRETS.md`
5. `/Users/arnab/Documents/New project/docs/GMAIL_SMTP_SETUP.md`
6. `/Users/arnab/Documents/New project/docs/VPS_DEPLOYMENT.md`
7. `/Users/arnab/Documents/New project/docs/JENKINS_SCM_SETUP.md`

## Branching model

- `dev` - active integration branch
- `stage` - pre-production validation
- `prod` - production deployment branch
- `main` - primary development branch, usually merged into environment branches before deployment

Recommended flow:

1. work on `main`
2. test locally
3. merge `main` into `dev`, `stage`, or `prod`
4. deploy the target branch on the VPS

## Local development quick start

### Option 1: local Docker stack

Run:

```bash
cd "/Users/arnab/Documents/New project"
docker compose up --build
```

This starts:
- frontend on `http://localhost:3000`
- backend on `http://localhost:8000`
- PostgreSQL on `localhost:5432`

### Option 2: local frontend + local backend without Docker

Backend:

```bash
cd "/Users/arnab/Documents/New project/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
DATABASE_URL='sqlite+pysqlite:///./local-dev.db' \
ENVIRONMENT=dev \
FRONTEND_BASE_URL='http://localhost:3001' \
EMAIL_DELIVERY_BACKEND=console \
EMAIL_DEBUG_RETURN_TOKEN=true \
uvicorn app.main:app --reload
```

Frontend:

```bash
cd "/Users/arnab/Documents/New project/frontend"
npm install
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api npm run dev -- --port 3001
```

Use:
- frontend: `http://localhost:3001`
- backend health: `http://127.0.0.1:8000/api/health`

## Local validation commands

Backend health:

```bash
curl -i http://127.0.0.1:8000/api/health
```

Register:

```bash
curl -i -X POST http://127.0.0.1:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"first_name":"Arnab","email":"local@example.com","phone":"9876543211","password":"Password123"}'
```

Login:

```bash
curl -i -X POST http://127.0.0.1:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"local@example.com","password":"Password123"}'
```

Questionnaire enquiry:

```bash
curl -i -X POST http://127.0.0.1:8000/api/quotes/enquiry \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name":"Arnab",
    "email":"local@example.com",
    "phone":"9876543211",
    "indie":"yes",
    "region":"india",
    "group_size":"couple",
    "days":"6-8",
    "budget":"comfort",
    "hotel":"4-star",
    "group_travel":"no",
    "suggested_trips":["Great Himalayan Trek","Kaziranga + Shillong"]
  }'
```

## Production architecture summary

- PostgreSQL runs on the VPS host machine
- backend runs in Docker
- frontend runs in Docker
- nginx terminates TLS and proxies requests
- backend containers reach the host database through `host.docker.internal`
- each environment has its own runtime folder on the VPS:
  - `/opt/lavendertour/dev`
  - `/opt/lavendertour/stage`
  - `/opt/lavendertour/prod`

## Files you should not commit

Do not commit:
- live `.env` files
- SMTP passwords
- Google App Passwords
- VPS-only runtime files
- local SQLite databases such as `local-dev.db`

Safe to commit:
- `.env.*.example`
- compose templates in `/deploy`
- application source code
- documentation

## Environment templates

Use these as starting points:
- `/Users/arnab/Documents/New project/.env.dev.example`
- `/Users/arnab/Documents/New project/.env.stage.example`
- `/Users/arnab/Documents/New project/.env.prod.example`

Then copy them to live runtime files on the VPS:
- `/opt/lavendertour/dev/.env.dev`
- `/opt/lavendertour/stage/.env.stage`
- `/opt/lavendertour/prod/.env.prod`

## Gmail / helpdesk email usage

Password reset emails and questionnaire enquiries are designed to go through:
- `helpdesk@lavendertour.in`

Google SMTP should use:
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_USERNAME=helpdesk@lavendertour.in`
- `SMTP_PASSWORD=<Google App Password>`

Do not use the normal mailbox password in production config.

Full setup instructions:
- `/Users/arnab/Documents/New project/docs/GMAIL_SMTP_SETUP.md`

## VPS deployment shortcut

When the repository is already on the VPS, the usual production refresh looks like:

```bash
cd /opt/lavendertour/repo
git fetch origin
git checkout prod
git reset --hard origin/prod
git merge origin/main
git push origin prod

cd /opt/lavendertour/prod
docker compose down
docker compose up --build -d
docker compose ps
```

Detailed VPS instructions:
- `/Users/arnab/Documents/New project/docs/VPS_DEPLOYMENT.md`

## Jenkins automation

The project supports Jenkins multibranch deployment.

Detailed setup:
- `/Users/arnab/Documents/New project/docs/JENKINS_SCM_SETUP.md`

## Useful references

- backend guide: `/Users/arnab/Documents/New project/backend/README.md`
- frontend guide: `/Users/arnab/Documents/New project/frontend/README.md`
- secrets and env guide: `/Users/arnab/Documents/New project/docs/ENVIRONMENT_AND_SECRETS.md`
- Gmail setup guide: `/Users/arnab/Documents/New project/docs/GMAIL_SMTP_SETUP.md`
- VPS deploy guide: `/Users/arnab/Documents/New project/docs/VPS_DEPLOYMENT.md`
