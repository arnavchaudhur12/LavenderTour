# Gmail / Google Workspace SMTP Setup

This project sends:
- password reset emails
- questionnaire enquiry notifications

through:
- `helpdesk@lavendertour.in`

## Why Google App Password is required

For Google Workspace SMTP, the safest practical setup is:
- `smtp.gmail.com`
- port `465`
- username `helpdesk@lavendertour.in`
- password = Google App Password

Do not rely on the mailbox login password in production.

## Step-by-step App Password setup

1. Sign in to the mailbox account:
   - `helpdesk@lavendertour.in`

2. Open security settings:
   - [https://myaccount.google.com/security](https://myaccount.google.com/security)

3. Enable `2-Step Verification`

4. Open App Passwords:
   - [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

5. Choose:
   - App: `Mail`
   - Device: `Other (Custom name)`
   - Name: `LavenderTour VPS`

6. Click `Generate`

7. Copy the 16-character app password

8. Put it into:
   - `/opt/lavendertour/prod/.env.prod`

Like this:

```env
SMTP_PASSWORD=YOUR_APP_PASSWORD_HERE
```

## Required SMTP env values

```env
EMAIL_DELIVERY_BACKEND=smtp
EMAIL_FROM_ADDRESS=helpdesk@lavendertour.in
CUSTOMER_CARE_EMAIL=helpdesk@lavendertour.in
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=helpdesk@lavendertour.in
SMTP_PASSWORD=YOUR_APP_PASSWORD_HERE
SMTP_USE_TLS=false
SMTP_USE_SSL=true
```

## Update and redeploy on the VPS

```bash
nano /opt/lavendertour/prod/.env.prod
```

After saving:

```bash
cd /opt/lavendertour/prod
docker compose down
docker compose up --build -d
docker compose logs --tail=120 backend
```

## Validate password reset email

```bash
curl -i -X POST https://lavendertour.in/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com"}'
```

## Validate questionnaire enquiry email

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

Expected:
- HTTP `200 OK`
- email arrives in `helpdesk@lavendertour.in`

## If App Passwords is missing

Usually one of these is true:
- 2-Step Verification is not enabled
- Google Workspace admin policy blocks App Passwords
- the account is under advanced protection

In that case, use Google SMTP relay or adjust admin settings before retrying.
