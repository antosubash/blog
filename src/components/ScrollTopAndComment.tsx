import siteMetadata from "@/config/siteMetadata"
import { ArrowUp, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      setShow(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleWindowScroll)
    return () => window.removeEventListener("scroll", handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleScrollToComment = () => {
    document.getElementById("comment")?.scrollIntoView({ behavior: "smooth" })
  }

  const buttonClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm transition-all duration-200 hover:text-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"

  return (
    <div
      className={`fixed bottom-8 right-8 hidden flex-col gap-2 transition-opacity duration-200 ${
        show ? "md:flex" : "pointer-events-none opacity-0 md:flex"
      }`}
    >
      {siteMetadata.comments?.provider && (
        <button
          type="button"
          aria-label="Scroll To Comment"
          onClick={handleScrollToComment}
          className={buttonClass}
        >
          <MessageCircle className="h-[18px] w-[18px]" />
        </button>
      )}
      <button
        type="button"
        aria-label="Scroll To Top"
        onClick={handleScrollTop}
        className={buttonClass}
      >
        <ArrowUp className="h-[18px] w-[18px]" />
      </button>
    </div>
  )
}

export default ScrollTopAndComment
