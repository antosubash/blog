import Tag from "@/components/Tag";
import { Posts, allPosts } from "contentlayer/generated";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import React from "react";

const Series = () => {
  var seriesList = allPosts.filter((post) => {
    return post.series != null && post.isDraft !== true && post.part === 0;
  }
  );
  return (
    <div className="divide-y">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          Series
        </h1>
      </div>
      <ul>
        {seriesList.map((post) => {
          const { slug, date, title, excerpt, tags, series, part } = post;
          return (
            <Link href={`/posts/${slug}`} key={slug}>
              <div className="py-4 my-4 px-4 rounded-2xl border drop-shadow-lg border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 hover:scale-110 transition-all">
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                  <div>
                    <div className="text-base font-medium leading-6 ">
                      <time dateTime={date}>
                        {format(parseISO(date), "LLLL d, yyyy")}
                      </time>
                    </div>
                    {series && (
                      <div className="pt-4">
                        <div className="flex flex-col text-xl font-bold leading-6">
                          {series}{" "}
                          {part ? (
                            <div className="pt-4 lg:block lg:px-0 text-xl font-bold leading-6">
                              Part : {part}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                          {title}
                        </h2>
                      </div>
                      <div>{excerpt}</div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <div
                        className="text-primary-800 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Read "${title}"`}
                      >
                        Read more &rarr;
                      </div>
                    </div>
                    <div className="flex flex-row flex-wrap">
                      {tags.map((tag, index) => (
                        <div className="mt-3" key={tag}>
                          <Tag text={tag} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Series;
