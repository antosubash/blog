import type { MDXComponents } from 'mdx/types'
import Image from './components/Image'
import CustomLink from './components/Link'
import TableWrapper from './components/TableWrapper'
import YoutubeVideo from './components/YoutubeVideo'
import CustomTOCInline from './components/CustomTOCInline'
import EnhancedCodeBlock from './components/EnhancedCodeBlock'

const components: MDXComponents = {
  Image,
  TOCInline: CustomTOCInline,
  a: CustomLink,
  pre: EnhancedCodeBlock,
  table: TableWrapper,
  YoutubeVideo,
}

export function useMDXComponents(): MDXComponents {
  return components
}
