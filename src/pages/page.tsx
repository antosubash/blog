/* eslint-disable react/no-unescaped-entities */
import Container from "@components/container";
import Layout from "@components/layout";
import { getAllPosts } from "@lib/api";
import { BlogPost } from "@blog/types/postType";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Meta from "@components/meta";
import { generateOgImage } from "@lib/generateOgImage";
import { POSTS_PER_PAGE } from "@lib/constants";
import Pagination from "@components/pagination-item";
import PostItemSmall from "@components/post-item-small";

type Props = {
  allPosts: BlogPost[];
  initialDisplayPosts: BlogPost[];
  pagination: any;
};
const PostMain = ({ allPosts, initialDisplayPosts, pagination }: Props) => {
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
        <Meta
          title="Anto's blog"
          description="My personal blog"
          keywords="anto blog"
          date={allPosts[0].date}
          url="/page"
          image="/og/home.png"
        />
        <Container>
          <div>
            <div className="pt-6 space-y-2 md:space-y-5">
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
              <div className="pt-6 pb-4">
                <h1 className="text-xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                  All Posts
                </h1>
              </div>
            )}
            <ul>
              <AnimatePresence>
                {!displayPosts.length && "No posts found."}
                {displayPosts.map((post) => {
                  const { slug, date, title, excerpt, tags, series, part } = post;
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      key={slug}
                    >
                      <PostItemSmall
                        slug={slug}
                        date={date}
                        title={title}
                        summary={excerpt}
                        tags={tags}
                        series={series!}
                        part={part!}
                      ></PostItemSmall>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </ul>
            {pagination && pagination.totalPages > 1 && !searchValue && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            )}
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default PostMain;

export const getStaticProps = async ({ params }: any) => {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "tags",
    "series",
    "part",
  ]);

  const initialDisplayPosts = allPosts.slice(0, POSTS_PER_PAGE);

  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE),
  };

  await generateOgImage({ slug: "home", title: "Anto Subash's blog" });
  return {
    props: { allPosts, initialDisplayPosts, pagination },
  };
};
