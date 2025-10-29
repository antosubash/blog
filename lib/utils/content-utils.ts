import type { Posts, Authors } from '@/types/content'

export type CoreContent<T> = Omit<T, '_id' | '_raw' | 'body' | 'toc' | 'structuredData'>

export function sortPosts(posts: Posts[]): Posts[] {
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return 0
  })
}

export function coreContent<T extends Posts | Authors>(content: T): CoreContent<T> {
  // Use loose destructuring to avoid type incompatibilities across content variants
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _id, _raw, body, toc, structuredData, ...rest } = content as any
  return rest as CoreContent<T>
}

export function allCoreContent<T extends Posts | Authors>(contents: T[]): Array<CoreContent<T>> {
  return contents.map((content) => coreContent(content))
}
