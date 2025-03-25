import { NextRequest, NextResponse } from 'next/server'

// Ensure Node.js runtime so process.env is available reliably
export const runtime = 'nodejs'

const RESEND_API_URL = 'https://api.resend.com/emails'

interface ResendErrorDetail {
  message?: string
  code?: string
  field?: string
}

interface ResendError {
  message?: string
  errors?: ResendErrorDetail[]
}

export async function POST(req: NextRequest) {
  // Minimal request metadata (no console logs)
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  // Parse JSON safely
  let parsed: { name?: string; email?: string; subject?: string; message?: string }
  try {
    parsed = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  try {
    const { name, email, subject, message } = parsed

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Payload validated above

    const apiKey = process.env.RESEND_API_KEY
    const toAddress = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL
    const fromAddress = process.env.CONTACT_FROM_EMAIL
    const fromName = process.env.CONTACT_FROM_NAME || 'Contact Form'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service not configured (RESEND_API_KEY missing).' },
        { status: 500 }
      )
    }
    if (!toAddress) {
      return NextResponse.json(
        { error: 'Destination address not configured (CONTACT_TO_EMAIL).' },
        { status: 500 }
      )
    }
    if (!fromAddress) {
      return NextResponse.json(
        { error: 'Sender address not configured (CONTACT_FROM_EMAIL).' },
        { status: 500 }
      )
    }

    const html = `
      <div>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
        <hr/>
        <div>${escapeHtml(message).replace(/\n/g, '<br/>')}</div>
      </div>
    `

    const payload = {
      from: `${fromName} <${fromAddress}>`,
      to: [toAddress],
      subject: `[Contact] ${subject}`,
      reply_to: email,
      html,
    }

    let resp: Response
    try {
      resp = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      return NextResponse.json(
        { error: 'Email provider request failed. Please try again later.' },
        { status: 502 }
      )
    }

    if (!resp.ok) {
      const status = resp.status
      const contentType = resp.headers.get('content-type') || ''
      let providerMessage = 'Failed to send email.'
      let details: ResendError | string | null = null
      if (contentType.includes('application/json')) {
        const err: ResendError = (await resp.json().catch(() => ({}))) as ResendError
        providerMessage = err?.message || providerMessage
        if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          providerMessage = err.errors
            .map((e: ResendErrorDetail) => e?.message)
            .filter((m): m is string => Boolean(m))
            .join('; ')
        }
        details = err
      } else {
        const text = await resp.text().catch(() => '')
        providerMessage = text || providerMessage
        details = text
      }

      // Helpful hints for common provider errors
      if (status === 401 || status === 403) {
        providerMessage = 'Email provider rejected the request (check RESEND_API_KEY).'
      } else if (status === 422) {
        providerMessage =
          providerMessage ||
          'Unprocessable request. Ensure the from domain is verified in Resend and the payload is valid.'
      }

      return NextResponse.json({ error: providerMessage, status, details }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// All console logging removed after validation
