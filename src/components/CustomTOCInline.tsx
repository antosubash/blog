import { useState } from "react"

interface TOCItem {
  value: string
  url: string
  depth: number
}

interface TOCInlineProps {
  toc: TOCItem[]
}

const CustomTOCInline = ({ toc }: TOCInlineProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  )

  if (!toc || toc.length === 0) {
    return null
  }

  // Group TOC items by their parent sections
  const groupedToc = toc.reduce(
    (acc, item, index) => {
      if (item.depth === 2) {
        // Find all children that belong to this section
        const children: TOCItem[] = []
        let nextIndex = index + 1

        while (nextIndex < toc.length && toc[nextIndex].depth > 2) {
          children.push(toc[nextIndex])
          nextIndex++
        }

        acc.push({
          ...item,
          children,
        })
      }
      return acc
    },
    [] as (TOCItem & { children: TOCItem[] })[]
  )

  const toggleSection = (sectionUrl: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionUrl)) {
      newExpanded.delete(sectionUrl)
    } else {
      newExpanded.add(sectionUrl)
    }
    setExpandedSections(newExpanded)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 px-6 shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted/50">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Table of Contents
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={
            isCollapsed
              ? "Expand table of contents"
              : "Collapse table of contents"
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface hover:bg-surface"
        >
          <svg
            aria-hidden="true"
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <nav>
          <ul className="list-none space-y-1">
            {groupedToc.map((section, index) => (
              <li key={section.url || `toc-section-${index}`}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.url)}
                    aria-label={
                      expandedSections.has(section.url)
                        ? `Collapse section ${section.value}`
                        : `Expand section ${section.value}`
                    }
                    className={`mr-2 flex h-5 w-5 items-center justify-center rounded transition-colors ${
                      section.children.length > 0
                        ? "text-muted-foreground hover:text-foreground"
                        : "invisible"
                    }`}
                    disabled={section.children.length === 0}
                  >
                    <svg
                      aria-hidden="true"
                      className={`h-3 w-3 transition-transform duration-200 ${
                        expandedSections.has(section.url) ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <a
                    href={section.url}
                    className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent-muted/30 hover:text-accent"
                  >
                    {section.value}
                  </a>
                </div>

                {section.children.length > 0 &&
                  expandedSections.has(section.url) && (
                    <ul className="ml-6 mt-1 space-y-0.5 border-l-2 border-border pl-4">
                      {section.children.map((child, childIndex) => (
                        <li
                          key={child.url || `toc-child-${index}-${childIndex}`}
                        >
                          <a
                            href={child.url}
                            className={`block rounded-md px-3 py-1.5 text-sm transition-all duration-200 hover:bg-accent-muted/30 hover:text-accent ${
                              child.depth === 3
                                ? "text-muted-foreground"
                                : "ml-3 text-muted-foreground"
                            }`}
                            style={{
                              paddingLeft: `${(child.depth - 2) * 16 + 12}px`,
                            }}
                          >
                            {child.value}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default CustomTOCInline
