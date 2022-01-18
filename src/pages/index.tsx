/* eslint-disable react/no-unescaped-entities */
import Container from "@components/container";
import Layout from "@components/layout";
import { getAllPosts } from "@lib/api";
import Head from "next/head";
import Post from "@blog/types/postType";
import PostItem from "@components/post-item";
import Link from "@components/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { POSTS_PER_PAGE } from "@lib/constants";

type Props = {
  allPosts: Post[];
  initialDisplayPosts: Post[];
};
const Index = ({ initialDisplayPosts, allPosts }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const filteredBlogPosts = allPosts.filter((frontMatter) => {
    const searchContent =
      frontMatter.title +
      frontMatter.excerpt +
      frontMatter.content +
      frontMatter.tags.join(" ");
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue
      ? initialDisplayPosts
      : filteredBlogPosts;

  return (
    <>
      <Layout>
        <Head>
          <title>Anto's blog</title>
        </Head>
        <Container>
          <div className="divide-y">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <div className="relative">
                <input
                  aria-label="Search articles"
                  type="text"
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search articles"
                  className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
                />
                <svg
                  className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <ul className="divide-y">
              <AnimatePresence>
                {!displayPosts.length && "No posts found."}
                {displayPosts.map((post) => {
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
        <div className="flex justify-end text-base font-medium leading-6 p-8">
          <Link
            href="/page/1"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
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
    "tags",
  ]);
  const initialDisplayPosts = allPosts.slice(0, POSTS_PER_PAGE);
  
  return {
    props: { initialDisplayPosts, allPosts },
  };
};
