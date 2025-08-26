import { allPosts } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allPosts)
  const posts = allCoreContent(sortedPosts).filter((post) => !post.draft)
  return <Main posts={posts} />
}
