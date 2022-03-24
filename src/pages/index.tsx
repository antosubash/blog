/* eslint-disable react/no-unescaped-entities */
import Container from "@components/container";
import Layout from "@components/layout";
import { getAllPosts } from "@lib/api";
import Post from "@blog/types/postType";
import PostItem from "@components/post-item";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { DefaultSeo } from "next-seo";
import Meta from "@components/meta";
import { generateOgImage } from "@lib/generateOgImage";

type Props = {
  allPosts: Post[];
};
const Index = ({ allPosts }: Props) => {
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
    allPosts.length > 0 && !searchValue ? allPosts : filteredBlogPosts;

  return (
    <>
      <Layout>
        <Meta title="Anto's blog" description="My personal blog" url="/og/home.png" />
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
            {!searchValue && (
              <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                <h1 className="text-xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                  Latest
                </h1>
              </div>
            )}
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
  await generateOgImage({ slug: "home", title: "Anto Subash's blog" });
  return {
    props: { allPosts },
  };
};
