/* eslint-disable react/no-unescaped-entities */
import Container from "@components/container";
import Layout from "@components/layout";
import { getLatestPosts } from "@lib/api";
import { BlogPost } from "@blog/types/postType";
import PostItem from "@components/post-item";
import { AnimatePresence, motion } from "framer-motion";
import Meta from "@components/meta";
import { generateOgImage } from "@lib/generateOgImage";
import Link from "next/link";
type Props = {
  allPosts: BlogPost[];
};
const Index = ({ allPosts }: Props) => {
  return (
    <>
      <Layout>
        <Meta
          title="Anto's blog"
          description="My personal blog"
          keywords="anto blog"
          date={allPosts[0].date}
          image="/og/home.png"
        />
        <Container>
          <div className="divide-y">
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
              <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                Latest
              </h1>
            </div>
            <ul>
              <AnimatePresence>
                {allPosts.map((post, index) => {
                  const { slug, date, title, excerpt, tags } = post;
                  return (
                    <motion.li
                      key={slug}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="cursor-pointer"
                    >
                      <PostItem
                        key={slug}
                        slug={slug}
                        date={date}
                        title={title}
                        summary={excerpt}
                        tags={tags}
                        series={post.series}
                        part={post.part}
                      ></PostItem>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </Container>
        <div className="flex justify-end font-bold">
          <Link href="/page" aria-label="all posts">
            <div className="text-primary-500 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 pr-6 text-xl pt-2">
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
    "series",
    "part",
  ]);
  await generateOgImage({ slug: "home", title: "Anto Subash's blog" });
  return {
    props: { allPosts },
  };
};
