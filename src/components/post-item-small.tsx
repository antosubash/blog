import formatDate from "@lib/utils/formatDate";
import React from "react";
import Tag from "./tag";

type Props = {
  slug: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  series: string;
  part: number;
};

const PostItemSmall = (props: Props) => {
  const { slug, date, title, summary, series, part } = props;
  return (
    <li key={slug} className="py-4">
      <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
        <dl>
          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
            <time dateTime={date}>{formatDate(date)}</time>
          </dd>
          {series && (
            <div className="pt-2">
              <dd className="text-base font-medium leading-6">
                {series}{" "}
                {part ? (
                  <span className="lg:pt-2 lg:block lg:px-0 px-3 text-base font-medium leading-6">
                    Part : {part}
                  </span>
                ) : (
                  ""
                )}
              </dd>
            </div>
          )}
        </dl>
        <div className="space-y-3 xl:col-span-3">
          <div>
            <h3 className="text-2xl font-bold leading-8 tracking-tight">
              <a href={`/posts/${slug}`}>{title}</a>
            </h3>
            <div className="flex flex-wrap">
              {props.tags.map((tag) => (
                <div className="mt-3" id={tag}>
                  <Tag text={tag} />
                </div>
              ))}
            </div>
          </div>
          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
            {summary}
          </div>
        </div>
      </article>
    </li>
  );
};

export default PostItemSmall;
