/* eslint-disable react/no-unescaped-entities */
import Container from "@components/container";
import Layout from "@components/layout";
import { getAllPosts, getLatestPosts } from "@lib/api";
import Post from "@blog/types/postType";
import PostItem from "@components/post-item";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Meta from "@components/meta";
import { generateOgImage } from "@lib/generateOgImage";
import { MAX_DISPLAY } from "@lib/constants";
import Link from "next/link";

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
        <Meta
          title="Anto's blog"
          description="My personal blog"
          url="http://blog.antosubash.com"
          image="/og/home.png"
        />
        <Container>
          <div className="divide-y">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                Latest
              </h1>
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
        <div className="flex justify-end font-bold">
          <Link href="/page" aria-label="all posts">
            <div className="text-primary-500 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400">
              All Posts &rarr;
            </div>
          </Link>
        </div>
      </Layout>
    </>
  );
};

export default Index;

export const getStaticProps = async ({ params }: any) => {
  const allPosts = getLatestPosts([
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
