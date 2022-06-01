import React from "react";
import formatDate from "../lib/utils/formatDate";
import Tag from "./tag";

interface PostItemProps {
  key: any
  slug: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
}

const PostItem = (props: PostItemProps) => {
  const { slug, date, title, summary } = props;
  return (
    <div className="py-12">
      <article>
        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
          <div className="space-y-5 xl:col-span-3">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                  <a href={`/posts/${slug}`}>{title}</a>
                </h2>
              </div>
              <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                {summary}
              </div>
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
              {props.tags.map((tag) => <div className="mt-3" id={tag}><Tag text={tag}/></div>)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostItem;
