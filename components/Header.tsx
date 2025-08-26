import { Code2 } from 'lucide-react'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import FeedButton from './FeedButton'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import ThemeSwitch from './ThemeSwitch'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white sm:h-8 sm:w-8">
                  <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden text-lg font-bold text-gray-900 dark:text-gray-100 sm:block sm:text-xl">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <nav className="hidden items-center space-x-6 md:flex lg:space-x-8">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => {
                if (link.track) {
                  return (
                    <a
                      key={link.title}
                      href={link.href}
                      className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                      data-umami-event={`header_${link.title.toLowerCase()}`}
                    >
                      {link.title}
                    </a>
                  )
                } else {
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      {link.title}
                    </Link>
                  )
                }
              })}
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <FeedButton />
            <SearchButton />
            <ThemeSwitch />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
