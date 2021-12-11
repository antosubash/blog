/* eslint-disable react/no-unescaped-entities */
import Container from "@components/container";
import Layout from "@components/layout";
import { getAllPosts } from "@lib/api";
import Head from "next/head";
import Post from "@blog/types/postType";
import PostItem from "@components/post-item";
import { AnimatePresence, motion } from "framer-motion";
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
          <div className="divide-y divide-gray-500 dark:divide-gray-300">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 md:text-2xl md:leading-14">
                Latest
              </h1>
            </div>
            <ul className="divide-y divide-gray-500 dark:divide-gray-300">
              <AnimatePresence>
                {!allPosts.length && "No posts found."}
                {allPosts.map((post) => {
                  const { slug, date, title, excerpt, tags } = post;
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      key={slug}
                    >
                      <PostItem
                        slug={slug}
                        date={date}
                        title={title}
                        summary={excerpt}
                        tags={tags}
                      ></PostItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </ul>
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
    "tags"
  ]);

  return {
    props: { allPosts },
  };
};
