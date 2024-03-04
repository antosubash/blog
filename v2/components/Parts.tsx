import { allPosts } from 'contentlayer/generated'

const Parts = (slug: any) => {
  const post = allPosts.find((p) => p.slug === slug.data)
  const allPostInSeries = allPosts
    .filter((p) => p.series === post?.series)
    .sort((a, b) => (a.part as number) - (b.part as number))
  return (
    <div>
      <div>Post in this Series</div>
      <ol>
        {allPostInSeries.map((blogPost) => {
          return <li key={blogPost.slug}>{slug.data == blogPost.slug ? `${blogPost.title} (This post)` : <a href={`/posts/${blogPost.slug}`}>{blogPost.title}</a>}</li>
        })}
      </ol>
    </div>
  )
}

export default Parts
