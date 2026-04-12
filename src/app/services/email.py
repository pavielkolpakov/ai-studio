import resend
import structlog

from app.core.config import settings

logger = structlog.get_logger()


def _render_transcript_html(transcript: list[dict]) -> str:
    rows = []
    for msg in transcript:
        role = msg.get("role", "unknown")
        content = msg.get("content", "")
        if role == "user":
            bg = "#f0f0f0"
            label = "User"
        else:
            bg = "#e8f4e8"
            label = "Assistant"
        rows.append(
            f'<div style="padding:10px;margin:4px 0;border-radius:6px;background:{bg}">'
            f"<strong>{label}:</strong><br>{content}</div>"
        )
    return "".join(rows)


def _render_transcript_text(transcript: list[dict]) -> str:
    lines = []
    for msg in transcript:
        role = msg.get("role", "unknown").capitalize()
        content = msg.get("content", "")
        lines.append(f"{role}:\n{content}\n")
    return "\n".join(lines)


def _build_html(name: str, email: str, message: str, transcript: list[dict] | None) -> str:
    transcript_section = ""
    if transcript:
        transcript_section = (
            '<hr style="margin:20px 0">'
            "<h3>Chat Transcript</h3>"
            f"{_render_transcript_html(transcript)}"
        )

    return (
        '<div style="font-family:sans-serif;max-width:600px;margin:0 auto">'
        "<h2>New Contact Form Submission</h2>"
        "<table>"
        f"<tr><td><strong>Name:</strong></td><td>{name}</td></tr>"
        f'<tr><td><strong>Email:</strong></td><td><a href="mailto:{email}">{email}</a></td></tr>'
        "</table>"
        '<div style="margin-top:16px"><strong>Message:</strong></div>'
        f'<div style="padding:12px;background:#f9f9f9;border-radius:6px;margin-top:8px">{message}</div>'
        f"{transcript_section}"
        "</div>"
    )


def _build_text(name: str, email: str, message: str, transcript: list[dict] | None) -> str:
    text = f"New Contact Form Submission\n{'='*40}\nName: {name}\nEmail: {email}\n\nMessage:\n{message}"
    if transcript:
        text += f"\n\n{'='*40}\nChat Transcript\n{'-'*40}\n{_render_transcript_text(transcript)}"
    return text


async def send_contact_email(
    *,
    name: str,
    email: str,
    message: str,
    transcript: list[dict] | None = None,
) -> bool:
    resend.api_key = settings.RESEND_API_KEY

    html = _build_html(name, email, message, transcript)
    text = _build_text(name, email, message, transcript)

    try:
        resend.Emails.send(
            {
                "from": "Neuronetis <noreply@neuronetis.com>",
                "to": [settings.CONTACT_TO_EMAIL],
                "subject": f"New Contact Form Submission from {name}",
                "html": html,
                "text": text,
                "reply_to": email,
            }
        )
        logger.info("contact_email_sent", to=settings.CONTACT_TO_EMAIL, from_name=name)
        return True
    except Exception:
        logger.exception("contact_email_failed", to=settings.CONTACT_TO_EMAIL, from_name=name)
        return False
