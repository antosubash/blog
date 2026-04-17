import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Mastodon,
  Threads,
  Twitter,
  Youtube,
} from "./icons"

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (
    !href ||
    (kind === "mail" &&
      !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))
  )
    return null

  const SocialSvg = components[kind]

  return (
    <a
      className="rounded-sm text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={
        kind === "mail"
          ? "Send email"
          : `Follow on ${kind.charAt(0).toUpperCase() + kind.slice(1)}`
      }
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-muted-foreground hover:text-accent h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
