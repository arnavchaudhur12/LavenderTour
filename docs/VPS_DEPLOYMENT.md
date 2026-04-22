# VPS Deployment Guide

This document captures the current VPS deployment model used by Lavender Tour.

## VPS summary

- host IP: `31.97.202.218`
- main repo path: `/opt/lavendertour/repo`
- environment runtime folders:
  - `/opt/lavendertour/dev`
  - `/opt/lavendertour/stage`
  - `/opt/lavendertour/prod`

## Connect to the VPS

From your Mac:

```bash
ssh root@31.97.202.218
```

If using a specific key:

```bash
ssh -i ~/.ssh/jenkins_vps_mac root@31.97.202.218
```

## Current deployment model

- code is stored in `/opt/lavendertour/repo`
- environment-specific compose files live outside the repo
- each environment is deployed separately
- nginx fronts the services and exposes:
  - `dev.lavendertour.in`
  - `stage.lavendertour.in`
  - `lavendertour.in`

## Required production files

- repo:
  - `/opt/lavendertour/repo`
- runtime:
  - `/opt/lavendertour/prod/docker-compose.yml`
  - `/opt/lavendertour/prod/.env.prod`

## Recommended production pull sequence

```bash
cd /opt/lavendertour/repo
git fetch origin
git checkout prod
git reset --hard origin/prod
git merge origin/main
git push origin prod
```

If `nano` opens for the merge commit:
- `Ctrl + O`
- `Enter`
- `Ctrl + X`

## Current production compose file shape

The frontend must receive `NEXT_PUBLIC_API_URL` at build time.

Working production compose pattern:

```yaml
services:
  backend:
    build:
      context: /opt/lavendertour/repo/backend
    container_name: lavendertour-backend-prod
    restart: unless-stopped
    env_file:
      - /opt/lavendertour/prod/.env.prod
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - "8001:8000"

  frontend:
    build:
      context: /opt/lavendertour/repo/frontend
      args:
        NEXT_PUBLIC_API_URL: https://lavendertour.in/api
    container_name: lavendertour-frontend-prod
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: https://lavendertour.in/api
      NODE_ENV: production
    ports:
      - "4000:3000"
    depends_on:
      - backend
```

## Why the build arg matters

Without the build arg, the deployed Next.js bundle can fall back to:

```text
http://localhost:8000/api
```

That breaks registration and login in production because browsers interpret `localhost` as the visitor's machine.

## Production env example

```env
TARGET_ENV=prod
ENVIRONMENT=prod
NEXT_PUBLIC_API_URL=https://lavendertour.in/api
DATABASE_URL=postgresql+psycopg://lavender:CHANGE_ME@host.docker.internal:5432/lavendertour_prod
FRONTEND_BASE_URL=https://lavendertour.in
EMAIL_DELIVERY_BACKEND=smtp
EMAIL_DEBUG_RETURN_TOKEN=false
EMAIL_FROM_ADDRESS=helpdesk@lavendertour.in
CUSTOMER_CARE_EMAIL=helpdesk@lavendertour.in
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=helpdesk@lavendertour.in
SMTP_PASSWORD=CHANGE_ME
SMTP_USE_TLS=false
SMTP_USE_SSL=true
```

## Redeploy production

```bash
cd /opt/lavendertour/prod
docker compose down
docker compose up --build -d
docker compose ps
docker compose logs --tail=120 backend
docker compose logs --tail=120 frontend
```

## Verify production

Health:

```bash
curl -i https://lavendertour.in/api/health
curl -I https://lavendertour.in/login
```

Register:

```bash
curl -i -X POST https://lavendertour.in/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"first_name":"Arnab","email":"workwitharnab24@gmail.com","phone":"6290699109","password":"Password123"}'
```

Questionnaire enquiry:

```bash
curl -i -X POST https://lavendertour.in/api/quotes/enquiry \
  -H 'Content-Type: application/json' \
  -d '{
    "first_name":"Arnab",
    "email":"workwitharnab24@gmail.com",
    "phone":"6290699109",
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

## Stage and dev

The same pattern is used for:
- `/opt/lavendertour/stage`
- `/opt/lavendertour/dev`

Only the hostnames, ports, and env files differ.

Build args should match the environment:

- dev: `https://dev.lavendertour.in/api`
- stage: `https://stage.lavendertour.in/api`
- prod: `https://lavendertour.in/api`

## PostgreSQL notes

The host machine runs PostgreSQL.

Containers connect using:
- `host.docker.internal`

Linux Docker requires:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

Postgres should allow Docker private ranges in `pg_hba.conf`. A practical rule is:

```text
host    all    all    172.16.0.0/12    scram-sha-256
```

## Common production issues

### `no pg_hba.conf entry`

Fix:
- add Docker subnet or `172.16.0.0/12` rule to `pg_hba.conf`
- restart PostgreSQL

### frontend calls `localhost:8000`

Fix:
- pass `NEXT_PUBLIC_API_URL` as frontend build arg
- rebuild frontend container

### forgot-password or enquiry email returns 502

Fix:
- verify `.env.prod`
- confirm Gmail App Password is in `SMTP_PASSWORD`
- inspect backend logs:

```bash
cd /opt/lavendertour/prod
docker compose logs --tail=200 backend
```
