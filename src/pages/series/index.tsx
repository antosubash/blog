import React from "react";
import { NextPage, GetStaticProps } from "next";
import { getSeriesPosts } from "@lib/api";
import { BlogPost } from "@blog/types/postType";
import { AnimatePresence, motion } from "framer-motion";
import PostItem from "@components/post-item";
import Container from "@components/container";
import Layout from "@components/layout";
import Meta from "@components/meta";

interface SeriesProps {
  series: BlogPost[];
}
const Series: NextPage<SeriesProps> = ({ series }: SeriesProps) => {
  return (
    <Layout>
      <Meta
        title="Anto's blog Series"
        description="This page contains all the series."
        url="/series"
        image="/og/series.png"
      />
      <Container>
        <div className="divide-y">
          <div className="pt-6 pb-8 space-y-2 md:space-y-5">
            <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
              Series
            </h1>
          </div>
          <ul >
            <AnimatePresence>
              {series.map((post, index) => {
                const { slug, date, title, excerpt, tags } = post;
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
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
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({}) => {
  var series = getSeriesPosts([
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
  return {
    props: {
      series,
    },
  };
};

export default Series;
