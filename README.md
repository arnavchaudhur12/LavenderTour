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

## Jenkins requirements
Create these Jenkins credentials before enabling deploys:
- `aws-ecr-registry` - registry hostname or credential wrapper for ECR
- `lavendertour-ssh` - SSH private key for the target server

Install these tools on the Jenkins node:
- Docker + Docker Compose plugin
- Python 3
- Node.js 20 + npm
- AWS CLI

The repository includes a Jenkins container image under `jenkins/` that installs those tools locally.

## Jenkins job setup
1. Create one Jenkins `Multibranch Pipeline` job pointed at the GitHub repository.
2. Configure branch discovery for `dev`, `stage`, and `prod`.
3. Add GitHub webhook support so pushes and merges trigger indexing automatically.
4. Jenkins will then expose three separate branch builds using the same `Jenkinsfile`.

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
