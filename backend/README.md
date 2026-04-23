# Backend README

This service lives in:
- `/Users/arnab/Documents/New project/backend`

It is a FastAPI application that handles:
- authentication
- password resets
- travel recommendations
- questionnaire enquiries
- quote persistence

## Tech stack

- Python 3.11 in Docker
- FastAPI
- SQLAlchemy
- PostgreSQL in deployed environments
- SQLite for lightweight local testing if needed

## Important backend files

- `/Users/arnab/Documents/New project/backend/app/main.py` - app startup, routes, table bootstrapping
- `/Users/arnab/Documents/New project/backend/app/api/auth.py` - auth endpoints
- `/Users/arnab/Documents/New project/backend/app/api/quotes.py` - quote and enquiry endpoints
- `/Users/arnab/Documents/New project/backend/app/api/recommendations.py` - recommendation endpoints
- `/Users/arnab/Documents/New project/backend/app/core/config.py` - settings and env variables
- `/Users/arnab/Documents/New project/backend/app/core/db.py` - SQLAlchemy engine/session setup
- `/Users/arnab/Documents/New project/backend/app/services/emailer.py` - SMTP and console email delivery

## API routes

Mounted under both:
- `/auth/...`
- `/api/auth/...`

Health routes:
- `GET /health`
- `GET /api/health`

Auth routes:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Quote / enquiry routes:
- `POST /api/quotes/`
- `POST /api/quotes/enquiry`

Recommendation routes:
- `POST /api/recommendations`

## Local backend setup

```bash
cd "/Users/arnab/Documents/New project/backend"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run with SQLite for local UI testing

```bash
cd "/Users/arnab/Documents/New project/backend"
source .venv/bin/activate
DATABASE_URL='sqlite+pysqlite:///./local-dev.db' \
ENVIRONMENT=dev \
FRONTEND_BASE_URL='http://localhost:3001' \
EMAIL_DELIVERY_BACKEND=console \
EMAIL_DEBUG_RETURN_TOKEN=true \
uvicorn app.main:app --reload
```

## Run with local Docker PostgreSQL

From repo root:

```bash
cd "/Users/arnab/Documents/New project"
docker compose up postgres backend --build
```

The local compose file uses:
- DB name: `lavendertour`
- DB user: `lavender`
- DB password: `lavender`

## Backend Docker build

Dockerfile:
- `/Users/arnab/Documents/New project/backend/Dockerfile`

Manual build:

```bash
cd "/Users/arnab/Documents/New project/backend"
docker build -t lavendertour-backend .
```

Manual run:

```bash
docker run --rm -p 8000:8000 \
  -e DATABASE_URL='sqlite+pysqlite:///./local-dev.db' \
  -e FRONTEND_BASE_URL='http://localhost:3001' \
  -e EMAIL_DELIVERY_BACKEND='console' \
  lavendertour-backend
```

## Auth behavior

### Register

Required payload:

```json
{
  "first_name": "Arnab",
  "email": "user@example.com",
  "phone": "9876543211",
  "password": "Password123"
}
```

### Login

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Current session token:
- a stub token is returned today
- frontend stores it in local storage for session persistence

## Password reset behavior

- `forgot-password` always returns a success-style message
- if the email exists, backend generates a token and sends a reset email
- in local development, `EMAIL_DEBUG_RETURN_TOKEN=true` can return the token in the API response

## Questionnaire enquiry behavior

The questionnaire endpoint:
- stores the enquiry in the `quotes` table
- emails the full questionnaire details to customer care

Current intended inbox:
- `helpdesk@lavendertour.in`

## Email delivery modes

### Console mode

Use for local development:

```env
EMAIL_DELIVERY_BACKEND=console
EMAIL_DEBUG_RETURN_TOKEN=true
```

### SMTP mode

Use for stage/prod:

```env
EMAIL_DELIVERY_BACKEND=smtp
EMAIL_FROM_ADDRESS=helpdesk@lavendertour.in
CUSTOMER_CARE_EMAIL=helpdesk@lavendertour.in
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=helpdesk@lavendertour.in
SMTP_PASSWORD=<GOOGLE_APP_PASSWORD>
SMTP_USE_TLS=false
SMTP_USE_SSL=true
```

## Schema notes

The backend currently relies on startup table creation and lightweight schema adjustment.

Important:
- `Base.metadata.create_all()` creates missing tables
- `app.main.ensure_auth_user_schema()` adds the `first_name` column if it does not exist

For larger schema changes, a proper migration tool such as Alembic would be safer.

## Backend verification commands

Compile check:

```bash
PYTHONPYCACHEPREFIX='/Users/arnab/Documents/New project/.pycache' python3 -m compileall '/Users/arnab/Documents/New project/backend/app'
```

Health check:

```bash
curl -i http://127.0.0.1:8000/api/health
```

Register test:

```bash
curl -i -X POST http://127.0.0.1:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"first_name":"Arnab","email":"local@example.com","phone":"9876543211","password":"Password123"}'
```

Enquiry test:

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
