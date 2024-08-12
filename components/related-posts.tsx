import { Posts } from 'contentlayer/generated'
import Link from 'next/link'

const RelatedPost = ({ posts }: { posts: Posts[] }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold text-gray-800 dark:text-gray-200">Related Posts</h3>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {posts.map((post) => {
          const href = `/posts/${post.slug}`
          return (
            <Link
              key={post.slug}
              href={href}
              className="rounded-2xl border border-gray-100 bg-slate-50 px-3 pb-4 no-underline drop-shadow-lg dark:border-gray-800 dark:bg-gray-950"
            >
              <div data-umami-event="related-post" className="text-gray-800 dark:text-gray-200">
                <div>
                  <h3 className="line-clamp-2 text-lg font-medium">{post.title}</h3>
                  <p className="line-clamp-3">{post.excerpt}</p>
                  <div className="text-primary mt-4 text-lg">
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedPost
