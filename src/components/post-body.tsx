import React from "react";
import Kofi from "./kofi";
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from "next/image"
import { Pre } from "./pre";
import { Code } from "./code";

type Props = {
  content: string;
  videoId: string;
  title: string;
};

// Define your custom MDX components.

const components = {
  Image,
  Pre,
  Code,
}

const PostBody = ({ content, videoId, title }: Props) => {
  const MDXContent = useMDXComponent(content)
  return (
    <div className="xl:pb-0 xl:col-span-3 xl:row-span-2">
      {videoId ? (
        <iframe
          width="100%"
          height="700"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        ""
      )}
      {/* <Markdown content={content} /> */}
      <div className="prose dark:prose-dark max-w-none">
         <MDXContent components={components} />
      </div>
      <div className="pt-8">
        <Kofi />
      </div>
    </div>
  );
};

export default PostBody;
