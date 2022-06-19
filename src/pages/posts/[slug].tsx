import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@components/container";
import PostBody from "@components/post-body";
import PostHeader from "@components/post-header";
import Layout from "@components/layout";
import { getPostBySlug, getAllPosts } from "@lib/api";
import PageTitle from "@components/page-title";
import { Utterances } from "@components/utterances";
import PostType from "@blog/types/postType";
import { generateOgImage } from "@lib/generateOgImage";
import Meta from "@components/meta";

type Props = {
  post: PostType;
  morePosts?: PostType[];
  preview?: boolean;
};

const Post = ({ post }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
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
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
            />
            <PostBody
              videoId={post.videoId}
              content={post.content}
              title={post.title}
            />
            <Utterances />
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
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
    "videoId",
    "tags",
    "excerpt",
    "series",
    "part",
  ]);

  await generateOgImage({ slug: params.slug, title: post.title });

  return {
    props: {
      post: post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

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
