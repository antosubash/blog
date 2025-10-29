import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import { remarkCodeTitles } from './mdx-plugins/remark-code-titles'
import { remarkImgToJsx } from './mdx-plugins/remark-img-to-jsx'
import path from 'path'

const root = process.cwd()

export async function serializeMDX(content: string) {
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkCodeTitles, remarkMath, remarkImgToJsx],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      ],
    },
  }

  // Type assertion to resolve vfile version conflict between dependencies
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await serialize(content, options as any)
}
