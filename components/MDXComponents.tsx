import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import YoutubeVideo from './YoutubeVideo'
import CustomTOCInline from './CustomTOCInline'
import EnhancedCodeBlock from './EnhancedCodeBlock'

export const components: MDXComponents = {
  Image,
  TOCInline: CustomTOCInline,
  a: CustomLink,
  pre: EnhancedCodeBlock,
  table: TableWrapper,
  YoutubeVideo,
}
