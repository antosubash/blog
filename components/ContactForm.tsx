'use client'

import { useCallback, useMemo, useState } from 'react'

type SubmitStatus =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string }

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<SubmitStatus>({ state: 'idle' })

  const isDisabled = useMemo(() => {
    return (
      status.state === 'submitting' ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    )
  }, [status.state, name, email, subject, message])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (website.trim().length > 0) {
        // Honeypot triggered
        return
      }
      setStatus({ state: 'submitting' })
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          const errorMsg = data?.error || 'Failed to send your message. Please try again later.'
          setStatus({ state: 'error', message: errorMsg })
          return
        }

        setStatus({ state: 'success', message: 'Thanks! Your message has been sent.' })
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
      } catch (err) {
        setStatus({ state: 'error', message: 'Network error. Please try again.' })
      }
    },
    [name, email, subject, message, website]
  )

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {/* Honeypot field */}
      <div className="hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-400"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-400"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-400"
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-400"
          placeholder="Tell me more about your project or question..."
        />
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center space-x-2 rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-offset-gray-900"
        >
          <span>{status.state === 'submitting' ? 'Sending…' : 'Send Message'}</span>
        </button>

        {status.state === 'success' && (
          <p className="text-sm text-green-600 dark:text-green-400">{status.message}</p>
        )}
        {status.state === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">{status.message}</p>
        )}
      </div>
    </form>
  )
}
