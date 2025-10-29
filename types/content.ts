export interface ReadingTime {
  text: string
  minutes: number
  time: number
  words: number
}

export interface StructuredData {
  '@context': string
  '@type': string
  headline: string
  datePublished: string
  dateModified: string
  description?: string
  image?: string
  url: string
  fileName: string
}

export interface PostRaw {
  title: string
  date: string
  tags?: string[]
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

export interface AuthorRaw {
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  layout?: string
}

export interface PostRawMeta {
  sourceFileName: string
  sourceFilePath: string
  sourceFileDir: string
  contentType: string
  flattenedPath: string
}

export interface AuthorRawMeta {
  sourceFileName: string
  sourceFilePath: string
  sourceFileDir: string
  contentType: string
  flattenedPath: string
}

export interface Posts extends PostRaw {
  slug: string
  path: string
  filePath: string
  postUrl: string
  readingTime: ReadingTime
  toc?: TOCItem[]
  structuredData: StructuredData
  body: {
    raw: string
    code: string
  }
  _id: string
  _raw: PostRawMeta
}

export interface Authors extends AuthorRaw {
  slug: string
  path: string
  filePath: string
  postUrl: string
  readingTime: ReadingTime
  toc?: TOCItem[]
  body: {
    raw: string
    code: string
  }
  _id: string
  _raw: AuthorRawMeta
}

// Shared Table of Contents item type
export interface TOCItem {
  value: string
  url: string
  depth: number
}
