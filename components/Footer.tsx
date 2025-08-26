import { Heart } from 'lucide-react'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import Link from './Link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-600 text-white sm:h-8 sm:w-8">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
                {siteMetadata.author}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
              Full-stack developer passionate about web technologies and modern software
              development.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 sm:text-sm">
              Quick Links
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              <Link
                href="/posts"
                className="block text-xs text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:text-sm"
              >
                All Posts
              </Link>
              <Link
                href="/series"
                className="block text-xs text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:text-sm"
              >
                Series
              </Link>
              <Link
                href="/projects"
                className="block text-xs text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:text-sm"
              >
                Projects
              </Link>
              <Link
                href="/consulting"
                className="block text-xs text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 sm:text-sm"
              >
                Consulting
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 sm:text-sm">
              Connect
            </h3>
            <div className="flex space-x-3 sm:space-x-4">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={4} />
              <SocialIcon kind="github" href={siteMetadata.github} size={4} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={4} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={4} />
              <SocialIcon kind="threads" href={siteMetadata.threads} size={4} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700 sm:mt-8 sm:pt-8">
          <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400 sm:space-x-2 sm:text-sm">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>{siteMetadata.author}</span>
              <span>•</span>
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500 sm:h-4 sm:w-4" />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              <Link
                href="https://github.com/antosubash/blog"
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                View Source
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
