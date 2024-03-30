'use client'
import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
const REPO_NAME = 'antosubash/blog-comments'
export default function Comments({ slug }: { slug: string }) {
  const commentNodeId = 'comments-' + slug
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const utterancesTheme = theme === 'light' ? 'github-light' : 'photon-dark'

  useEffect(() => {
    const scriptParentNode = document.getElementById(commentNodeId)
    if (!scriptParentNode) return

    // docs - https://utteranc.es/
    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.setAttribute('repo', REPO_NAME)
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('label', 'comment :speech_balloon:')
    script.setAttribute('theme', utterancesTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.onload = () => {
      console.log('utterances script has loaded')
      const commentElement = document.getElementById(commentNodeId)
      if (commentElement && commentElement.childNodes.length > 0) {
        //@ts-ignore
        commentElement.children[1].style.display = 'none'
      }
    }

    ref?.current?.appendChild(script)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div ref={ref} className="pt-8" id={commentNodeId} />
}
