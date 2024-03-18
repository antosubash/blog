"use client"
import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import Layout from '@components/layout'
import TopProgress from '@components/top-progress'
import Container from '@components/container'
import PostHeader from '@components/post-header'
import PostBody from '@components/post-body'
import RelatedPosts from '@components/related-posts'
import { Utterances } from '@components/utterances'
import PageTitle from '@components/page-title'
export const generateStaticParams = async () => allPosts.map((post) => ({ slug: post.slug }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === params.slug)
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)
  return { title: post.title }
}

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post.slug === params.slug)
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return (
    <Layout>
        <TopProgress />
        <Container>
          <>
              <PostHeader
                title={post.title}
                date={post.date}
                series={post.series!}
                tags={post.tags!}
                part={post.part!}
              />
              <PostBody
                videoId={post.videoId!}
                content={post.body.code}
                title={post.title}
              />
              {/* <RelatedPosts posts={relatedPosts} /> */}
              {/* <Utterances slug={post.slug} /> */}
            </>
        </Container>
    </Layout>
  )
}

export default PostLayout