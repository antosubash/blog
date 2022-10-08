import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@components/container";
import PostBody from "@components/post-body";
import PostHeader from "@components/post-header";
import Layout from "@components/layout";
import { getPostBySlug, getAllPosts } from "@lib/api";
import PageTitle from "@components/page-title";
import { Utterances } from "@components/utterances";
import { BlogPost } from "@blog/types/postType";
import { generateOgImage } from "@lib/generateOgImage";
import Meta from "@components/meta";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

type Props = {
  post: BlogPost;
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, string>
  >;
  morePosts?: BlogPost[];
  preview?: boolean;
};

const Post = ({ post, mdxSource }: Props) => {
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
              date={post.date}
              series={post.series!}
              tags={post.tags}
              part={post.part!}
            />
            <PostBody
              videoId={post.videoId}
              content={post.content}
              title={post.title}
              mdxSource={mdxSource}
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
    "content",
    "videoId",
    "tags",
    "excerpt",
    "series",
    "part",
  ]);
  const mdxSource = await serialize(post.content || "", {
    scope: {},
    mdxOptions: {
      remarkPlugins: [remarkToc, remarkGfm],
      rehypePlugins: [rehypeKatex, rehypeSlug, rehypeAutolinkHeadings],
      format: "md",
    },
    parseFrontmatter: true,
  });

  await generateOgImage({ slug: params.slug, title: post.title });

  return {
    props: {
      post: post,
      mdxSource: mdxSource,
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
