# Lavender Tour

Initial scaffold for `lavendertour.in` with Next.js (frontend) and FastAPI (backend).

## Structure
- `frontend/` - Next.js 14 App Router UI.
- `backend/` - FastAPI service.
- `docker-compose.yml` - local development stack.
- `docker-compose.prod.yml` - runtime compose file for deployed environments.
- `deploy/deploy.sh` - SSH-based deployment script for Jenkins.

## Branching model
- `dev` - integration branch for active development.
- `stage` - pre-production validation branch.
- `prod` - deployment branch for production releases.

Jenkins should be configured so:
- pushes to `dev` build and deploy to the development environment
- pushes to `stage` build and deploy to staging
- pushes to `prod` build and deploy to production

## Local quick start
1. Frontend:
   `cd frontend && npm install && npm run dev`
2. Backend:
   `cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
3. Docker:
   `docker compose up --build`

Frontend runs on `http://localhost:3000`. Backend runs on `http://localhost:8000`.

## Jenkins requirements
Create these Jenkins credentials before enabling deploys:
- `aws-ecr-registry` - registry hostname or credential wrapper for ECR
- `lavendertour-ssh` - SSH private key for the target server

Install these tools on the Jenkins node:
- Docker + Docker Compose plugin
- Python 3
- Node.js 20 + npm
- AWS CLI

## Environment files
Use the provided templates as a starting point:
- `.env.dev.example`
- `.env.stage.example`
- `.env.prod.example`

Copy each template to the matching runtime file on the target server and add the real secrets there.
