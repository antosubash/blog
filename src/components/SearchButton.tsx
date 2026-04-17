import { Search } from "lucide-react"

const SearchButton = () => {
  return (
    <button
      type="button"
      aria-label="Search (Ctrl+K)"
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
      onClick={() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
        )
      }}
    >
      <Search className="h-[18px] w-[18px]" />
    </button>
  )
}

export default SearchButton
