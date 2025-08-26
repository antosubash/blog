import type { MDXComponents } from 'mdx/types'
import CustomTOCInline from './CustomTOCInline'
import EnhancedCodeBlock from './EnhancedCodeBlock'
import Image from './Image'
import CustomLink from './Link'
import Parts from './Parts'
import TableWrapper from './TableWrapper'
import YoutubeVideo from './YoutubeVideo'

export const components: MDXComponents = {
  Image,
  TOCInline: CustomTOCInline,
  a: CustomLink,
  pre: EnhancedCodeBlock,
  table: TableWrapper,
  Parts,
  YoutubeVideo,
}
