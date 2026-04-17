import { useEffect, useRef } from "react"
import { useTheme } from "./ThemeProvider"

const REPO_NAME = "antosubash/blog-comments"

export default function Comments({ slug }: { slug: string }) {
  const commentNodeId = `comments-${slug}`
  const { resolvedTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const utterancesTheme =
    resolvedTheme === "light" ? "github-light" : "photon-dark"

  useEffect(() => {
    const scriptParentNode = document.getElementById(commentNodeId)
    if (!scriptParentNode || scriptParentNode.querySelector("script")) return

    const script = document.createElement("script")
    script.src = "https://utteranc.es/client.js"
    script.async = true
    script.setAttribute("repo", REPO_NAME)
    script.setAttribute("issue-term", "pathname")
    script.setAttribute("label", "comment :speech_balloon:")
    script.setAttribute("theme", utterancesTheme)
    script.setAttribute("crossorigin", "anonymous")
    ref.current?.appendChild(script)
  }, [commentNodeId, utterancesTheme])

  useEffect(() => {
    const iframe =
      ref.current?.querySelector<HTMLIFrameElement>(".utterances-frame")
    iframe?.contentWindow?.postMessage(
      { type: "set-theme", theme: utterancesTheme },
      "https://utteranc.es"
    )
  }, [utterancesTheme])

  return <div ref={ref} className="pt-8" id={commentNodeId} />
}
