import { useState, useEffect, useRef } from "react"
import Link from "./Link"
import headerNavLinks from "@/config/headerNavLinks"
import { Menu, X } from "lucide-react"

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      document.body.style.overflow = status ? "auto" : "hidden"
      return !status
    })
  }

  const closeNav = () => {
    setNavShow(false)
    document.body.style.overflow = "auto"
    toggleRef.current?.focus()
  }

  // Focus trap inside the panel
  useEffect(() => {
    if (!navShow || !panelRef.current) return
    const panel = panelRef.current
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length > 0) focusables[0].focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeNav(); return }
      if (e.key !== "Tab" || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [navShow])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && navShow) closeNav()
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [navShow])

  useEffect(() => {
    return () => { document.body.style.overflow = "auto" }
  }, [])

  return (
    <>
      <button
        ref={toggleRef}
        aria-label="Open menu"
        aria-expanded={navShow}
        onClick={onToggleNav}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 md:hidden ${
          navShow ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeNav}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-background shadow-2xl transition-transform duration-200 ease-out md:hidden ${
          navShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="text-lg font-semibold text-foreground">
            Menu
          </span>
          <button
            aria-label="Close Menu"
            onClick={closeNav}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-1">
            {headerNavLinks
              .filter((link) => link.href !== "/")
              .map((link) => {
                const cls =
                  "block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"

                return link.track ? (
                  <a
                    key={link.title}
                    href={link.href}
                    className={cls}
                    data-umami-event={`mobile_header_${link.title.toLowerCase()}`}
                    onClick={closeNav}
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    key={link.title}
                    href={link.href}
                    className={cls}
                    onClick={closeNav}
                  >
                    {link.title}
                  </Link>
                )
              })}
          </div>
        </nav>
      </div>
    </>
  )
}

export default MobileNav
