import headerNavLinks from "@/config/headerNavLinks"
import { Menu, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "./Link"

const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDialogElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => {
    setOpen(false)
    document.body.style.overflow = ""
    toggleRef.current?.focus()
  }, [])

  const toggle = useCallback(() => {
    setOpen((prev) => {
      document.body.style.overflow = prev ? "" : "hidden"
      return !prev
    })
  }, [])

  // Focus trap + keyboard handling
  useEffect(() => {
    if (!open || !panelRef.current) return
    const panel = panelRef.current
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length > 0) focusables[0].focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close()
        return
      }
      if (e.key !== "Tab" || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && open) close()
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [open, close])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const navLinks = headerNavLinks.filter((link) => link.href !== "/")

  const overlay = (
    <dialog
      ref={panelRef}
      aria-modal="true"
      aria-label="Navigation menu"
      className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-200 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Full-screen backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-background/95 backdrop-blur-lg"
        onClick={close}
        aria-label="Close navigation menu"
      />

      {/* Content */}
      <div className="relative flex h-dvh flex-col">
        {/* Close button */}
        <div className="flex justify-end px-5 py-4">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links — centered */}
        <nav className="flex flex-1 flex-col items-start justify-center px-10">
          <div className="space-y-2">
            {navLinks.map((link, i) => {
              const cls =
                "block text-2xl font-display font-semibold tracking-tight text-foreground/80 transition-colors duration-150 hover:text-accent py-2"

              return link.track ? (
                <a
                  key={link.title}
                  href={link.href}
                  className={cls}
                  style={{ animationDelay: `${i * 50}ms` }}
                  data-umami-event={`mobile_header_${link.title.toLowerCase()}`}
                  onClick={close}
                >
                  {link.title}
                </a>
              ) : (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cls}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={close}
                >
                  {link.title}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </dialog>
  )

  return (
    <>
      <button
        type="button"
        ref={toggleRef}
        aria-label="Open menu"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-accent md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Portal overlay to body — avoids backdrop-blur containing block */}
      {mounted && createPortal(overlay, document.body)}
    </>
  )
}

export default MobileNav
