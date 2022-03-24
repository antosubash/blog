import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@components/container";
import PostBody from "@components/post-body";
import PostHeader from "@components/post-header";
import Layout from "@components/layout";
import { getPostBySlug, getAllPosts } from "@lib/api";
import PageTitle from "@components/page-title";
import Head from "next/head";
import { Utterances } from "@components/utterances";
import PostType from "@blog/types/postType";
import { ArticleJsonLd, NextSeo } from "next-seo";
import { generateOgImage } from "@lib/generateOgImage";

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
            <Head>
              <title>{post.title} | Anto Subash</title>
            </Head>
            <NextSeo
              title={post.title}
              description={post.excerpt}
              canonical={`https://blog.antosubash.com${router.asPath}`}
              openGraph={{
                title: post.title,
                description: post.excerpt,
                url: `https://blog.antosubash.com${router.asPath}`,
                type: "article",
                site_name: "Anto Subash",
                images: [
                  {
                    url: `https://blog.antosubash.com/og/${post.slug}.png`,
                    width: 800,
                    height: 600,
                    alt: post.title,
                    type: "image/png",
                  },
                ],
                article: {
                  publishedTime: post.date,
                },
              }}
              twitter={{
                handle: "@antosubash",
                site: "@antosubash",
                cardType: "summary_large_image",
              }}
            />
            <ArticleJsonLd
              title={post.title ? post.title : ""}
              description={post.excerpt ? post.excerpt : ""}
              url={`https://blog.antosubash.com${router.asPath}`}
              images={[]}
              datePublished={post.date}
              authorName={post.author.name}
            />
            <PostHeader
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
            />
            <PostBody videoId={post.videoId} content={post.content} />
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
