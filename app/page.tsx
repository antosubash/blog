import { getAllPosts } from '@/lib/mdx'
import Main from './Main'

export default async function Page() {
  const allPosts = await getAllPosts()
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return <Main posts={posts} />
}
