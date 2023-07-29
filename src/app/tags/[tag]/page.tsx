import React from "react";
import { getPostsByTag } from "@lib/content";
import PostItemSmall from "@components/post-item-small";

const TagList = ({ params }: { params: { tag: string } }) => {
  const tag = params.tag;
  const posts = getPostsByTag(tag);
  return (
    <div className="divide-y divide-gray-500 dark:divide-gray-300">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-2xl uppercase font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 md:text-2xl md:leading-14">
          {tag}
        </h1>
      </div>
      <ul className="divide-y divide-gray-500 dark:divide-gray-300">
        {!posts.length && "No posts found."}
        {posts.map((post) => {
          const { slug, date, title, excerpt, tags, series, part } = post;
          return (
            <PostItemSmall
              slug={slug}
              date={date}
              title={title}
              summary={excerpt}
              tags={tags!}
              series={series}
              part={part}
            ></PostItemSmall>
          );
        })}
      </ul>
    </div>
  );
};

export default TagList;