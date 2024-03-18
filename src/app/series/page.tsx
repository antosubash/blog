import React from "react";
import PostItem from "@components/post-item";
import { getSeriesList } from "@lib/content";

const Series = () => {
  const seriesList = getSeriesList();
  return (
    <div className="divide-y">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          Series
        </h1>
      </div>
      <ul>
        {seriesList.map((post) => {
          const { slug, date, title, excerpt, tags, url } = post;
          return (
            <PostItem
              key={slug}
              slug={url}
              date={date}
              title={title}
              summary={excerpt}
              tags={tags!}
              series={post.series}
              part={post.part}
            ></PostItem>
          );
        })}
      </ul>
    </div>
  );
};

export default Series;
