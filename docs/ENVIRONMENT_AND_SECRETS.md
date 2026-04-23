# Environment and Secrets Guide

This file explains where environment values live and which ones belong in Git versus only on the VPS.

## Safe files in the repository

These are templates and can be committed:

- `/Users/arnab/Documents/New project/.env.dev.example`
- `/Users/arnab/Documents/New project/.env.stage.example`
- `/Users/arnab/Documents/New project/.env.prod.example`

These should contain:
- variable names
- non-sensitive defaults
- `CHANGE_ME` placeholders

## Secret runtime files on the VPS

These should not be committed:

- `/opt/lavendertour/dev/.env.dev`
- `/opt/lavendertour/stage/.env.stage`
- `/opt/lavendertour/prod/.env.prod`

These hold real secrets such as:
- database passwords
- SMTP credentials
- Google App Passwords

## Core variables

### Frontend / environment routing

- `TARGET_ENV`
- `ENVIRONMENT`
- `NEXT_PUBLIC_API_URL`
- `FRONTEND_BASE_URL`

### Database

- `DATABASE_URL`

For deployed environments this should point to host Postgres through Docker host gateway, for example:

```env
DATABASE_URL=postgresql+psycopg://lavender:CHANGE_ME@host.docker.internal:5432/lavendertour_prod
```

### Email

- `EMAIL_DELIVERY_BACKEND`
- `EMAIL_DEBUG_RETURN_TOKEN`
- `EMAIL_FROM_ADDRESS`
- `CUSTOMER_CARE_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_USE_TLS`
- `SMTP_USE_SSL`

## Example production env

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

## Updating env files on the VPS

Use:

```bash
nano /opt/lavendertour/prod/.env.prod
```

Save:
- `Ctrl + O`
- `Enter`

Exit:
- `Ctrl + X`

Then rebuild:

```bash
cd /opt/lavendertour/prod
docker compose down
docker compose up --build -d
```

## When env changes require a rebuild

### Backend-only env changes

Usually rebuild/restart backend:
- database URL changes
- SMTP changes
- customer care email changes

### Frontend API URL changes

Must rebuild frontend image because `NEXT_PUBLIC_API_URL` is baked into the Next.js build.

That is why the VPS compose file includes:

```yaml
build:
  args:
    NEXT_PUBLIC_API_URL: https://lavendertour.in/api
```

## Current environment folders on the VPS

- `/opt/lavendertour/dev`
- `/opt/lavendertour/stage`
- `/opt/lavendertour/prod`

## Current repo deployment templates

- `/Users/arnab/Documents/New project/deploy/dev.docker-compose.yml`
- `/Users/arnab/Documents/New project/deploy/stage.docker-compose.yml`
- `/Users/arnab/Documents/New project/deploy/prod.docker-compose.yml`

These should stay aligned with the live VPS compose files.
