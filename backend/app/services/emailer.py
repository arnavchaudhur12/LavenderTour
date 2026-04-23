import logging
import smtplib
from email.message import EmailMessage

from app.core.config import Settings

logger = logging.getLogger(__name__)


def send_password_reset_email(email: str, reset_token: str, settings: Settings) -> None:
    reset_link = f"{settings.frontend_base_url.rstrip('/')}/login?mode=reset&token={reset_token}"
    subject = 'Reset your Lavender Tour password'
    body = (
        'We received a request to reset your Lavender Tour password.\n\n'
        f'Use this link to continue: {reset_link}\n\n'
        f'This link expires in {settings.password_reset_ttl_minutes} minutes.'
    )

    _dispatch_email(email, subject, body, settings, console_label='Password reset')


def send_internal_notification_email(subject: str, body: str, settings: Settings) -> None:
    inbox = settings.customer_care_email or settings.email_from_address
    if not inbox:
        raise RuntimeError('CUSTOMER_CARE_EMAIL or EMAIL_FROM_ADDRESS is required for internal notifications')

    _dispatch_email(inbox, subject, body, settings, console_label='Internal notification')


def _dispatch_email(recipient: str, subject: str, body: str, settings: Settings, console_label: str) -> None:
    if settings.email_delivery_backend == 'console':
        logger.info('%s to %s\nSubject: %s\n\n%s', console_label, recipient, subject, body)
        return

    if settings.email_delivery_backend == 'smtp':
        _send_via_smtp(recipient, subject, body, settings)
        return

    raise RuntimeError(f'Unsupported email delivery backend: {settings.email_delivery_backend}')


def _send_via_smtp(email: str, subject: str, body: str, settings: Settings) -> None:
    if not settings.smtp_host:
        raise RuntimeError('SMTP_HOST is required for smtp email delivery')
    if not settings.email_from_address:
        raise RuntimeError('EMAIL_FROM_ADDRESS is required for smtp email delivery')
    if not settings.smtp_username or not settings.smtp_password:
        raise RuntimeError('SMTP_USERNAME and SMTP_PASSWORD are required for smtp email delivery')

    message = EmailMessage()
    message['Subject'] = subject
    message['From'] = settings.email_from_address
    message['To'] = email
    message.set_content(body)

    try:
        if settings.smtp_use_ssl:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port) as smtp:
                smtp.login(settings.smtp_username, settings.smtp_password)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
                if settings.smtp_use_tls:
                    smtp.starttls()
                smtp.login(settings.smtp_username, settings.smtp_password)
                smtp.send_message(message)
    except smtplib.SMTPException as exc:
        raise RuntimeError('Failed to send email') from exc
