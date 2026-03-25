# Lavender Tour

Initial scaffold for `lavendertour.in` with Next.js (frontend) and FastAPI (backend).

## Structure
- `frontend/` - Next.js 14 App Router UI.
- `backend/` - FastAPI service with PostgreSQL persistence for OTPs, users, quotes, and destinations.
- `docker-compose.yml` - local development stack.
- `docker-compose.prod.yml` - runtime compose file for deployed environments.
- `deploy/deploy.sh` - SSH-based deployment script for Jenkins.

## Branching model
- `dev` - integration branch for active development.
- `stage` - pre-production validation branch.
- `prod` - deployment branch for production releases.

Jenkins should be configured as a multibranch pipeline so it creates separate jobs for:
- `dev` -> development build and deployment
- `stage` -> staging build and deployment
- `prod` -> production build and deployment

Each merge to one of those branches should trigger only that branch's job.

## Local quick start
1. Frontend:
   `cd frontend && npm install && npm run dev`
2. Backend:
   `cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
3. Docker:
   `docker compose up --build`
4. Jenkins:
   `docker compose -f docker-compose.jenkins.yml up --build -d`

Frontend runs on `http://localhost:3000`. Backend runs on `http://localhost:8000`.
Jenkins runs on `http://localhost:8080`.

## Backend database

The backend now expects PostgreSQL through `DATABASE_URL`.

Local Docker Compose starts Postgres automatically with:
- database: `lavendertour`
- user: `lavender`
- password: `lavender`

Tables are created on startup and seed destination data is inserted automatically.

For the VPS deployment model used in production/stage/dev:
- PostgreSQL runs on the VPS host
- backend containers connect through `host.docker.internal`
- Linux Docker hosts need `extra_hosts: ["host.docker.internal:host-gateway"]`, which is already included in `docker-compose.prod.yml`

Suggested VPS databases:
- `lavendertour_prod`
- `lavendertour_stage`
- `lavendertour_dev`

## Jenkins requirements
Create this Jenkins credential before enabling deploys:
- `lavendertour-vps-ssh` - SSH private key that can log into the VPS as `root`

Install these tools on the Jenkins node:
- Git
- Python 3
- Node.js 20 + npm
- SSH Agent plugin

The pipeline verifies the backend and frontend locally, then deploys by SSH to the VPS and runs `/opt/lavendertour/deploy-by-branch.sh`.

## Jenkins job setup
1. Create one Jenkins `Multibranch Pipeline` job pointed at the GitHub repository.
2. Configure branch discovery for `dev`, `stage`, and `prod`.
3. Add GitHub webhook support so pushes and merges trigger indexing automatically.
4. Jenkins will expose separate branch jobs for `dev`, `stage`, and `prod`.
5. Each branch job runs local verification and then SSHes to the VPS to deploy the matching environment.

For the full SCM, credentials, and webhook setup, see:
- `docs/JENKINS_SCM_SETUP.md`
- `deploy/vps-deploy-by-branch.sh`

The `Jenkinsfile` maps branches like this:
- `dev` -> deploy to development
- `stage` -> deploy to staging
- `prod` -> deploy to production
- `main` -> treated as production if you keep using it

## Environment files
Use the provided templates as a starting point:
- `.env.dev.example`
- `.env.stage.example`
- `.env.prod.example`

Copy each template to the matching runtime file on the target server and add the real secrets there.
