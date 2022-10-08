import React from "react";
import Kofi from "./kofi";
import Markdown from "./markdown";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import MdxMarkdown from "./mdx";
type Props = {
  content: string;
  videoId: string;
  title: string;
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, string>
  >;
};

const PostBody = ({ content, videoId, title, mdxSource }: Props) => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
      {videoId ? (
        <iframe
          width="100%"
          height="700"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        ""
      )}
      {/* <Markdown content={content} /> */}
      <div className="pt-8">
        <MdxMarkdown mdxSource={mdxSource} />
      </div>
      <div className="pt-8">
        <Kofi />
      </div>
    </div>
  );
};

export default PostBody;
