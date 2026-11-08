import { describe, expect, it } from "vitest"
import { toFeedHtml } from "../feed-html"

const url = "https://blog.antosubash.com/posts/demo"

describe("toFeedHtml", () => {
  it("makes links and images absolute against the post URL", () => {
    const html = toFeedHtml(
      '<p><a href="/posts/other">o</a> <a href="#part">p</a> <a href="https://x.dev/a">x</a></p><img src="/static/a.png" alt="A" width="10" height="5" loading="lazy">',
      url
    )
    expect(html).toBe(
      '<p><a href="https://blog.antosubash.com/posts/other">o</a> <a href="https://blog.antosubash.com/posts/demo#part">p</a> <a href="https://x.dev/a">x</a></p><img src="https://blog.antosubash.com/static/a.png" alt="A" width="10" height="5" />'
    )
  })

  it("drops heading self-links, code block headers and scripts", () => {
    const html = toFeedHtml(
      [
        '<h2 id="intro"><a href="#intro" aria-hidden="true" tabindex="-1"><span class="icon icon-link"></span></a>Intro</h2>',
        '<div class="code-block"><div class="flex items-center justify-between bg-surface px-4 py-2"><span>ts</span><button type="button" data-copy-code=""><svg><path d="M1"></path></svg><span>Copy</span></button></div>',
        '<pre class="astro-code" style="color:red"><code><span class="line">const a = 1</span></code></pre></div>',
        "<script>alert(1)</script>",
      ].join(""),
      url
    )
    expect(html).toBe(
      "<h2>Intro</h2><div><pre><code><span>const a = 1</span></code></pre></div>"
    )
  })

  it("keeps the Mermaid source but not the loading placeholder", () => {
    const html = toFeedHtml(
      '<div class="mermaid-diagram" data-mermaid=""><div class="mermaid-loading"><p>Rendering diagram...</p></div><pre hidden data-mermaid-source>graph TD\n  A--&gt;B</pre></div>',
      url
    )
    expect(html).toBe("<div><pre>graph TD\n  A--&gt;B</pre></div>")
  })
})
