'use client'

import { Briefcase, FileText, Heart, Home, Layers, Mail, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import Link from './Link'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  const closeNav = useCallback(() => {
    setNavShow(false)
    document.body.style.overflow = 'auto'
  }, [])

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navShow) {
        closeNav()
      }
    }

    if (navShow) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [navShow, closeNav])

  // Close menu on window resize to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && navShow) {
        closeNav()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [navShow, closeNav])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Icon mapping for navigation items
  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'posts':
        return <FileText className="h-5 w-5" />
      case 'series':
        return <Layers className="h-5 w-5" />
      case 'projects':
        return <Briefcase className="h-5 w-5" />
      case 'consulting':
        return <Mail className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Menu Overlay - Click outside to close */}
      {navShow && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/40 transition-all duration-300 md:hidden"
          onClick={closeNav}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              closeNav()
            }
          }}
          aria-label="Close menu"
          tabIndex={0}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-white shadow-2xl transition-all duration-300 ease-out dark:bg-gray-900 md:hidden ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ display: navShow ? 'block' : 'none' }}
      >
        {/* Header */}
        <div className="relative border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Menu</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Navigation</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close Menu"
              onClick={closeNav}
              className="inline-flex items-center justify-center rounded-xl p-2 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto bg-white p-6 dark:bg-gray-900">
          <div className="space-y-3">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link, index) => (
                <div key={link.title} className="group">
                  {link.track ? (
                    <a
                      href={link.href}
                      className="flex items-center space-x-4 rounded-xl border border-gray-200 bg-white px-4 py-4 text-base font-medium text-gray-900 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                      data-umami-event={`mobile_header_${link.title.toLowerCase()}`}
                      onClick={closeNav}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-blue-900 dark:group-hover:text-blue-400">
                        {getIcon(link.title)}
                      </div>
                      <span>{link.title}</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex items-center space-x-4 rounded-xl border border-gray-200 bg-white px-4 py-4 text-base font-medium text-gray-900 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                      onClick={closeNav}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-blue-900 dark:group-hover:text-blue-400">
                        {getIcon(link.title)}
                      </div>
                      <span>{link.title}</span>
                    </Link>
                  )}
                </div>
              ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/posts"
                className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
                onClick={closeNav}
              >
                <FileText className="h-4 w-4" />
                <span>Browse All Posts</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center justify-center space-x-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                onClick={closeNav}
              >
                <Briefcase className="h-4 w-4" />
                <span>View Projects</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500" />
              <span>by</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {siteMetadata.author}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} All rights reserved
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileNav
