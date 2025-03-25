import Link from 'next/link'
import { slug as createSlug } from 'github-slugger'
import { designSystemUtils, componentVariants } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface TagProps {
  text: string
  className?: string
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  asLink?: boolean
}

const Tag = ({ text, className = '', variant = 'default', asLink = true }: TagProps) => {
  const slug = createSlug(text)

  // Generate color based on tag content for consistent theming
  const getTagVariant = (tagText: string) => {
    const tag = tagText.toLowerCase()

    // Technology-specific tags
    if (tag.includes('dotnet') || tag.includes('c#') || tag.includes('aspnet')) return 'primary'
    if (tag.includes('react') || tag.includes('nextjs') || tag.includes('javascript'))
      return 'secondary'
    if (tag.includes('docker') || tag.includes('kubernetes') || tag.includes('microservice'))
      return 'success'
    if (tag.includes('azure') || tag.includes('aws') || tag.includes('cloud')) return 'warning'
    if (tag.includes('security') || tag.includes('auth') || tag.includes('identity'))
      return 'danger'

    // Default fallback
    return 'default'
  }

  const effectiveVariant = variant === 'default' ? getTagVariant(text) : variant

  // Use design system badge classes
  const badgeClasses = designSystemUtils.badge(
    effectiveVariant as keyof typeof componentVariants.badge.variants
  )
  const baseClasses = cn(badgeClasses, 'transition-all duration-200', className)

  if (asLink) {
    return (
      <Link
        href={`/tags/${slug}`}
        className={`${baseClasses} hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
        aria-label={`View posts tagged ${text}`}
      >
        {text}
      </Link>
    )
  }

  return <span className={baseClasses}>{text}</span>
}

export default Tag
