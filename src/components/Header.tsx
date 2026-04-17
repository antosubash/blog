import headerNavLinks from "@/config/headerNavLinks"
import siteMetadata from "@/config/siteMetadata"
import { useEffect, useState } from "react"
import FeedButton from "./FeedButton"
import Link from "./Link"
import MobileNav from "./MobileNav"
import SearchButton from "./SearchButton"
import ThemeSwitch from "./ThemeSwitch"

const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled ? "bg-background/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <div className="flex items-center justify-between py-4 sm:py-5">
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <span className="text-lg font-semibold text-foreground">
              {siteMetadata.headerTitle}
              <span className="text-accent">.</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {headerNavLinks
              .filter((link) => link.href !== "/")
              .map((link) => {
                const cls =
                  "relative rounded-sm text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
                return link.track ? (
                  <a
                    key={link.title}
                    href={link.href}
                    className={cls}
                    data-umami-event={`header_${link.title.toLowerCase()}`}
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link key={link.title} href={link.href} className={cls}>
                    {link.title}
                  </Link>
                )
              })}
          </nav>
          <div className="flex items-center gap-1">
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
