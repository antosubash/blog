import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime, { ReadTimeResults } from 'reading-time'
import { serialize } from 'next-mdx-remote/serialize'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from '../data/siteMetadata'

const root = process.cwd()

function extractTocHeadings(content: string): TOCItem[] {
  const headings: TOCItem[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const value = match[2].trim()
      const url = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
      headings.push({ value, url: `#${url}`, depth })
    }
  }
  return headings
}

interface TOCItem {
  value: string
  url: string
  depth: number
}

interface Frontmatter {
  title: string
  date: string
  tags: string[]
  lastmod?: string
  draft?: boolean
  isDraft?: boolean
  excerpt?: string
  videoId?: string
  series?: string
  part?: number
  images?: string[]
  authors?: string[]
  layout?: string
  bibliography?: string
  canonicalUrl?: string
}

interface StructuredData {
  '@context': string
  '@type': string
  headline: string
  datePublished: string
  dateModified: string
  description?: string
  image: string
  url: string
  fileName: string
}

interface Doc extends Frontmatter {
  content: string
  fileName: string
  fullPath: string
}

export interface Post {
  title: string
  date: string
  tags: string[]
  lastmod?: string
  draft?: boolean
  isDraft?: boolean
  excerpt?: string
  videoId?: string
  series?: string
  part?: number
  images?: string[]
  authors?: string[]
  layout?: string
  bibliography?: string
  canonicalUrl?: string
  readingTime: ReadTimeResults
  slug: string
  path: string
  filePath: string
  postUrl: string
  toc: string | TOCItem[]
  structuredData: StructuredData
  frontmatter: Frontmatter
  content?: MDXRemoteSerializeResult
}

const computedFields = async (doc: Doc) => ({
  readingTime: readingTime(doc.content),
  slug: doc.fileName.replace(/\.mdx?$/, ''),
  path: `posts/${doc.fileName.replace(/\.mdx?$/, '')}`,
  filePath: doc.fullPath,
  postUrl: `/posts/${doc.fileName.replace(/\.mdx?$/, '')}`,
  toc: await extractTocHeadings(doc.content),
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: doc.title,
    datePublished: doc.date,
    dateModified: doc.lastmod || doc.date,
    description: doc.excerpt,
    image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
    url: `${siteMetadata.siteUrl}/posts/${doc.fileName.replace(/\.mdx?$/, '')}`,
    fileName: doc.fileName.replace(/\.mdx?$/, ''),
  },
})

function findFilePath(dirPath: string, slug: string): string | null {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      const found = findFilePath(fullPath, slug)
      if (found) return found
    } else if (file === `${slug}.mdx`) {
      return fullPath
    }
  }
  return null
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const postsDirectory = path.join(root, 'data', '_posts')
  const filePath = findFilePath(postsDirectory, slug)
  if (!filePath) {
    throw new Error(`Post not found: ${slug}`)
  }
  const source = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(source)
  const frontmatter = data as Frontmatter

  let mdxSource
  try {
    // Try with basic plugins first
    mdxSource = await serialize(content, {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    })
  } catch (error) {
    console.error('Error serializing MDX with basic plugins:', error)
    try {
      // Try with minimal plugins
      mdxSource = await serialize(content, {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [rehypeSlug],
        },
      })
    } catch (fallbackError) {
      console.error('Error serializing MDX with minimal plugins:', fallbackError)
      // Final fallback - no plugins
      mdxSource = await serialize(content, {
        parseFrontmatter: false,
        mdxOptions: {},
      })
    }
  }

  const fields = await computedFields({
    ...frontmatter,
    content,
    fileName: `${slug}.mdx`,
    fullPath: filePath,
  })

  return {
    ...frontmatter,
    ...fields,
    frontmatter,
    content: mdxSource,
  }
}

export interface Author {
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  layout?: string
  slug: string
  path: string
  filePath: string
}

export async function getAuthorBySlug(
  slug: string
): Promise<Author & { content: MDXRemoteSerializeResult }> {
  const filePath = path.join(root, 'data', 'authors', `${slug}.mdx`)
  const source = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(source)

  const mdxSource = await serialize(content, {
    parseFrontmatter: false,
  })

  return {
    ...data,
    slug,
    path: `authors/${slug}`,
    filePath,
    content: mdxSource,
  } as Author & { content: MDXRemoteSerializeResult }
}

export function getAllAuthors(): Author[] {
  const authorsDirectory = path.join(root, 'data', 'authors')
  const fileNames = fs.readdirSync(authorsDirectory)

  const authors = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const filePath = path.join(authorsDirectory, fileName)
      const source = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(source)

      return {
        ...data,
        slug,
        path: `authors/${slug}`,
        filePath,
      } as Author
    })

  return authors
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles)
    } else if (file.endsWith('.mdx')) {
      arrayOfFiles.push(fullPath)
    }
  })

  return arrayOfFiles
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(root, 'data', '_posts')
  const filePaths = getAllFiles(postsDirectory)

  const allPosts = await Promise.all(
    filePaths.map(async (filePath) => {
      const source = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(source)
      const frontmatter = data as Frontmatter
      const fileName = path.basename(filePath)

      const fields = await computedFields({
        ...frontmatter,
        content,
        fileName,
        fullPath: filePath,
      })

      return {
        ...frontmatter,
        ...fields,
        frontmatter,
      } as Post
    })
  )

  const posts = allPosts
    .filter((post) => !post.draft && !post.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}
