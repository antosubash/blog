import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";
import Post from "../types/post";
import PostItem from "../components/post-item";

type Props = {
  allPosts: Post[];
};

const Index = ({ allPosts }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>Anto's blog</title>
        </Head>
        <Container>
          <div className="divide-y">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <ul className="divide-y">
                {!allPosts.length && "No posts found."}
                {allPosts.map((post) => {
                  const { slug, date, title, excerpt } = post;
                  return (
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      summary={excerpt}
                    ></PostItem>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
};
