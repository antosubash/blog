import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@components/container";
import PostBody from "@components/post-body";
import PostHeader from "@components/post-header";
import Layout from "@components/layout";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@lib/api";
import PageTitle from "@components/page-title";
import { Utterances } from "@components/utterances";
import { BlogPost } from "@blog/types/postType";
import { generateOgImage } from "@lib/generateOgImage";
import Meta from "@components/meta";
import TopProgress from "@components/top-progress";
import { compileMdx } from "@lib/compile-mdx";
import RelatedPosts from "@components/related-posts";

type Props = {
  post: BlogPost;
  relatedPosts: BlogPost[];
  preview?: boolean;
};

const Post = ({ post, relatedPosts }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
      <TopProgress />
      <Container>
        {router.isFallback ? (
          <PageTitle>Loading…</PageTitle>
        ) : (
          <>
            <Meta
              title={post.title}
              description={post.excerpt}
              url={`/posts/${post.slug}`}
              image={`/og/${post.slug}.png`}
              keywords={post.tags}
              date={post.date}
            />
            <PostHeader
              title={post.title}
              date={post.date}
              series={post.series!}
              tags={post.tags}
              part={post.part!}
            />
            <PostBody
              videoId={post.videoId}
              content={post.content}
              title={post.title}
            />
            <RelatedPosts posts={relatedPosts} />
            <Utterances slug={post.slug} />
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = await getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "videoId",
    "tags",
    "excerpt",
    "series",
    "part",
  ]);

  const mdxSource = await compileMdx(post.content || "");

  post.content = mdxSource;

  await generateOgImage({ slug: params.slug, title: post.title });

  const relatedPosts = await getRelatedPosts(params.slug, [
    "title",
    "date",
    "slug",
    "tags",
    "excerpt",
    "series",
  ]);

  return {
    props: {
      post: post,
      relatedPosts: relatedPosts,
    },
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts(["slug"]);
  return {
    paths: posts.map((posts: any) => {
      return {
        params: {
          slug: posts.slug,
        },
      };
    }),
    fallback: false,
  };
}