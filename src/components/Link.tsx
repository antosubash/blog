import { Link as TanStackLink } from "@tanstack/react-router"
import type { AnchorHTMLAttributes } from "react"

interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

const CustomLink = ({ href, ...rest }: CustomLinkProps) => {
  const isInternalLink = href && href.startsWith("/")
  const isAnchorLink = href && href.startsWith("#")

  if (isInternalLink) {
    return <TanStackLink to={href} {...(rest as any)} />
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default CustomLink
