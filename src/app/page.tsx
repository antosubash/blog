import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'
import Layout from '@components/layout'
import Container from '@components/container'
import PostItem from '@components/post-item'

function PostCard(post: Post) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link href={post.slug} className="text-blue-700 hover:text-blue-900 dark:text-blue-400">
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <div className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
    </div>
  )
}

export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))).slice(0, 5)

  return (
      <Layout>
        <Container>
          <div className="divide-y">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                Latest
              </h1>
            </div>
            <ul>
                {posts.map((post, index) => {
                  const { slug, date, title, excerpt, tags } = post;
                  return (
                    <li
                      key={index}
                      data-key={index}
                      className="cursor-pointer"
                    >
                      <PostItem
                        key={slug}
                        data-key={slug}
                        slug={slug}
                        date={date}
                        title={title}
                        summary={excerpt}
                        tags={tags!}
                        series={post.series}
                        part={post.part}
                      ></PostItem>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Container>
        <div className="flex justify-end font-bold">
          <Link href="/page" aria-label="all posts">
            <div className="text-primary-500 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 pr-6 text-xl pt-2">
              All Posts &rarr;
            </div>
          </Link>
        </div>
      </Layout>
  )
}