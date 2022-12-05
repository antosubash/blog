import Container from "@components/container";
import Layout from "@components/layout";
import { getLatestPosts } from "@lib/api";
import PostItem from "@components/post-item";
import { AnimatePresence, motion } from "framer-motion";
import Meta from "@components/meta";
import Link from "next/link";
const Index = () => {
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
  return (
    <>
      <Container>
        <div className="divide-y">
          <div className="pt-6 pb-8 space-y-2 md:space-y-5">
            <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
              Latest
            </h1>
          </div>
          <ul>
            {allPosts.map((post, index) => {
              const { slug, date, title, excerpt, tags } = post;
              return (
                <PostItem
                  key={slug}
                  data-key={slug}
                  slug={slug}
                  date={date}
                  title={title}
                  summary={excerpt}
                  tags={tags}
                  series={post.series}
                  part={post.part}
                ></PostItem>
              );
            })}
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
    </>
  );
};

export default Index;
