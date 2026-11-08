import type { Element, ElementContent } from "hast"
import type { ShikiTransformer } from "shiki"

/** hast wants class lists as arrays */
const cx = (classes: string) => classes.split(" ")

// lucide "copy" and "check" icons, inlined so code blocks need no framework.
const copyIcon: Element = svg("lucide lucide-copy h-3.5 w-3.5", [
  el("rect", {
    width: "14",
    height: "14",
    x: "8",
    y: "8",
    rx: "2",
    ry: "2",
  }),
  el("path", {
    d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
  }),
])
const checkIcon: Element = svg("lucide lucide-check h-3.5 w-3.5 text-accent", [
  el("path", { d: "M20 6 9 17l-5-5" }),
])

function el(
  tagName: string,
  properties: Element["properties"] = {},
  children: ElementContent[] = []
): Element {
  return { type: "element", tagName, properties, children }
}

function svg(className: string, children: ElementContent[]): Element {
  return el(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: cx(className),
      ariaHidden: "true",
    },
    children
  )
}

const text = (value: string): ElementContent => ({ type: "text", value })

/**
 * Wraps every highlighted `<pre>` in the site's code block chrome: a header with
 * the language and a Copy button (wired up by `CodeCopy.astro`).
 */
export function codeBlockChrome(): ShikiTransformer {
  return {
    name: "blog:code-block-chrome",
    pre(node) {
      const existing = String(node.properties.class ?? "")
      node.properties.class = `${existing} overflow-x-auto bg-background p-4 text-sm leading-relaxed text-foreground`
    },
    root(root) {
      const pre = root.children[0]
      if (!pre || pre.type !== "element") return
      const lang = this.options.lang
      const label =
        !lang || lang === "plaintext" || lang === "text" ? "code" : lang

      const header = el(
        "div",
        {
          className: cx(
            "flex items-center justify-between bg-surface px-4 py-2"
          ),
          // Lets the feed drop the header (see toFeedHtml).
          dataCodeHeader: "",
        },
        [
          el(
            "span",
            { className: cx("text-xs font-medium text-muted-foreground") },
            [text(label)]
          ),
          el(
            "button",
            {
              type: "button",
              ariaLabel: "Copy code",
              dataCopyCode: "",
              className: cx(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              ),
            },
            [
              el(
                "span",
                { className: cx("copy-idle inline-flex items-center gap-1.5") },
                [
                  copyIcon,
                  el("span", { className: cx("hidden sm:inline") }, [
                    text("Copy"),
                  ]),
                ]
              ),
              el(
                "span",
                { className: cx("copy-done hidden items-center gap-1.5") },
                [
                  checkIcon,
                  el("span", { className: cx("text-accent") }, [
                    text("Copied"),
                  ]),
                ]
              ),
            ]
          ),
        ]
      )

      root.children = [
        el(
          "div",
          {
            className: cx(
              "code-block group overflow-hidden rounded-lg border border-border"
            ),
          },
          [header, pre]
        ),
      ]
    },
  }
}
