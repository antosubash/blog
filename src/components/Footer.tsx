import siteMetadata from "@/config/siteMetadata"
import Link from "./Link"

export default function Footer() {
  const links = [
    { href: siteMetadata.github, label: "GitHub" },
    { href: siteMetadata.youtube, label: "YouTube" },
    { href: siteMetadata.linkedin, label: "LinkedIn" },
    { href: "/feed.xml", label: "RSS" },
  ]

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteMetadata.author}
          </span>
          <nav className="flex items-center gap-4">
            {links.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground transition-colors duration-150 hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
