import React from "react";
import formatDate from "../lib/utils/formatDate";
import Tag from "./tag";

interface PostItemProps {
  slug: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  series: string;
  part: number;
}

const PostItem = (props: PostItemProps) => {
  const { slug, date, title, summary, series, tags, part } = props;
  return (
    <article className="py-12">
      <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
        <div key={slug}>
          <div className="text-base font-medium leading-6 ">
            <time dateTime={date}>{formatDate(date)}</time>
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
                <a href={`/posts/${slug}`}>{title}</a>
              </h2>
            </div>
            <div>{summary}</div>
          </div>
          <div className="text-base font-medium leading-6">
            <a
              href={`/posts/${slug}`}
              className="text-primary-800 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Read "${title}"`}
            >
              Read more &rarr;
            </a>
          </div>
          <div className="flex flex-row flex-wrap">
            {props.tags.map((tag) => (
              <div className="mt-3" id={tag}>
                <Tag text={tag} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
