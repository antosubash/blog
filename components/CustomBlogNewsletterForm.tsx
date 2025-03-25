'use client'

import { useState } from 'react'

interface CustomBlogNewsletterFormProps {
  title?: string
  description?: string
}

const CustomBlogNewsletterForm = ({
  title = 'Subscribe to the newsletter',
  description = 'Get notified when I publish new posts.',
}: CustomBlogNewsletterFormProps) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the newsletter subscription
    console.log('Newsletter subscription for:', email)
    setIsSubscribed(true)
    setEmail('')
  }

  if (isSubscribed) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
          Thank you for subscribing!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          You'll receive updates when new posts are published.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">{description}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default CustomBlogNewsletterForm
