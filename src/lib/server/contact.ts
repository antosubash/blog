import { createServerFn } from "@tanstack/react-start"

const RESEND_API_URL = "https://api.resend.com/emails"

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string
      email: string
      subject: string
      message: string
    }) => data
  )
  .handler(async ({ data }) => {
    const { name, email, subject, message } = data

    if (!name || !email || !subject || !message) {
      throw new Error("All fields are required.")
    }

    const apiKey = process.env.RESEND_API_KEY
    const toAddress =
      process.env.CONTACT_TO_EMAIL || process.env.VITE_CONTACT_TO_EMAIL
    const fromAddress = process.env.CONTACT_FROM_EMAIL
    const fromName = process.env.CONTACT_FROM_NAME || "Contact Form"

    if (!apiKey) {
      throw new Error("Email service not configured (RESEND_API_KEY missing).")
    }
    if (!toAddress) {
      throw new Error(
        "Destination address not configured (CONTACT_TO_EMAIL)."
      )
    }
    if (!fromAddress) {
      throw new Error("Sender address not configured (CONTACT_FROM_EMAIL).")
    }

    const html = `
      <div>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <hr/>
        <div>${escapeHtml(message).replace(/\n/g, "<br/>")}</div>
      </div>
    `

    const payload = {
      from: `${fromName} <${fromAddress}>`,
      to: [toAddress],
      subject: `[Contact] ${subject}`,
      reply_to: email,
      html,
    }

    const resp = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "")
      throw new Error(
        `Failed to send email: ${errorText || resp.statusText}`
      )
    }

    return { ok: true }
  })
