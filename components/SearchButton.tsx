import { Search } from 'lucide-react'
import { KBarButton } from 'pliny/search/KBarButton'
import siteMetadata from '@/data/siteMetadata'

const SearchButton = () => {
  if (siteMetadata.search && siteMetadata.search.provider === 'kbar') {
    return (
      <KBarButton aria-label="Search">
        <Search className="h-5 w-5 text-gray-700 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400" />
      </KBarButton>
    )
  }
}

export default SearchButton
