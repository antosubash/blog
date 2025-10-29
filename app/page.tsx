import { sortPosts, allCoreContent } from '@/lib/utils/content-utils'
import { allPosts } from '@/lib/content'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allPosts)
  const posts = allCoreContent(sortedPosts).filter((post) => !post.draft)
  return <Main posts={posts} />
}
