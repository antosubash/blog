import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname, relative, extname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import siteMetadata from '../data/siteMetadata.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = process.cwd()

const CONTENT_DIR = join(root, 'data')
const OUTPUT_DIR = join(root, '.content')
const POSTS_DIR = join(CONTENT_DIR, '_posts')
const AUTHORS_DIR = join(CONTENT_DIR, 'authors')

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath, { withFileTypes: true })

  files.forEach((file) => {
    const filePath = join(dirPath, file.name)
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else if (extname(file.name) === '.mdx') {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

function extractTocHeadings(markdown) {
  const headings = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const depth = match[1].length
      const value = match[2].trim()
      const url =
        '#' +
        value
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
      headings.push({ value, depth, url })
    }
  }

  return headings
}

function processPost(filePath) {
  const fileContents = readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const relativePath = relative(CONTENT_DIR, filePath)
  const sourceFileName = relativePath.replace(/\\/g, '/')
  const sourceFileDir = dirname(relativePath).replace(/\\/g, '/')
  const slug = sourceFileName.replace(/\.mdx?$/, '').replace(/^_posts\//, '')

  const readingTimeResult = readingTime(content)
  const toc = extractTocHeadings(content)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    datePublished: data.date,
    dateModified: data.lastmod || data.date,
    description: data.excerpt,
    image: data.images && data.images.length > 0 ? data.images[0] : siteMetadata.socialBanner,
    url: `${siteMetadata.siteUrl}/posts/${slug}`,
    fileName: sourceFileName.replace(/\.mdx?$/, ''),
  }

  return {
    ...data,
    slug,
    path: `posts/${slug}`,
    filePath: sourceFileName,
    postUrl: `/posts/${slug}`,
    readingTime: readingTimeResult,
    toc,
    structuredData,
    body: {
      raw: content,
      code: '', // Will be serialized on-demand or in a separate step
    },
    _id: filePath,
    _raw: {
      sourceFileName,
      sourceFilePath: filePath,
      sourceFileDir,
      contentType: 'mdx',
      flattenedPath: `posts/${slug}`,
    },
  }
}

function processAuthor(filePath) {
  const fileContents = readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const relativePath = relative(CONTENT_DIR, filePath)
  const sourceFileName = relativePath.replace(/\\/g, '/')
  const sourceFileDir = dirname(relativePath).replace(/\\/g, '/')
  const slug = sourceFileName.replace(/\.mdx?$/, '').replace(/^authors\//, '')

  const readingTimeResult = readingTime(content)
  const toc = extractTocHeadings(content)

  return {
    ...data,
    slug,
    path: slug,
    filePath: sourceFileName,
    postUrl: `/${slug}`,
    readingTime: readingTimeResult,
    toc,
    body: {
      raw: content,
      code: '', // Will be serialized on-demand
    },
    _id: filePath,
    _raw: {
      sourceFileName,
      sourceFilePath: filePath,
      sourceFileDir,
      contentType: 'mdx',
      flattenedPath: slug,
    },
  }
}

async function buildContent() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const postsDir = join(OUTPUT_DIR, 'Posts')
  const authorsDir = join(OUTPUT_DIR, 'Authors')

  if (!existsSync(postsDir)) {
    mkdirSync(postsDir, { recursive: true })
  }

  if (!existsSync(authorsDir)) {
    mkdirSync(authorsDir, { recursive: true })
  }

  // Process posts
  const postFiles = getAllFiles(POSTS_DIR)
  const posts = postFiles.map(processPost)

  // Process authors
  const authorFiles = getAllFiles(AUTHORS_DIR)
  const authors = authorFiles.map(processAuthor)

  // Write posts index
  writeFileSync(join(postsDir, '_index.json'), JSON.stringify(posts, null, 2))

  // Write authors index
  writeFileSync(join(authorsDir, '_index.json'), JSON.stringify(authors, null, 2))

  // Write combined index (for compatibility)
  writeFileSync(join(OUTPUT_DIR, 'index.json'), JSON.stringify({ posts, authors }, null, 2))

  console.log(`Processed ${posts.length} posts and ${authors.length} authors`)
}

buildContent().catch(console.error)
