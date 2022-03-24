import { useRouter } from "next/router";
import React from "react";
import ErrorPage from "next/error";
import { getAllTags, getPostByTag } from "@lib/api";
import PostType from "@blog/types/postType";
import Container from "@components/container";
import PostItem from "@components/post-item";
import { AnimatePresence, motion } from "framer-motion";
import { generateOgImage } from "@lib/generateOgImage";
interface Props {
  posts: PostType[];
}

const TagList = ({ posts }: Props) => {
  const router = useRouter();
  const { tag } = router.query;
  if (!tag) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Container>
      <div className="divide-y divide-gray-500 dark:divide-gray-300">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-2xl uppercase font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 md:text-2xl md:leading-14">
            {tag}
          </h1>
        </div>
        <ul className="divide-y divide-gray-500 dark:divide-gray-300">
          <AnimatePresence>
            {!posts.length && "No posts found."}
            {posts.map((post) => {
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
  );
};

export default TagList;

type Params = {
  params: {
    tag: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  var posts = getPostByTag(params.tag);
  await generateOgImage({ slug: params.tag, title: params.tag + " tag" });
  return {
    props: { posts },
  };
};

export async function getStaticPaths() {
  var tags = getAllTags();

  return {
    paths: tags.map((tag: string) => {
      return {
        params: {
          tag: tag,
        },
      };
    }),
    fallback: false,
  };
}
