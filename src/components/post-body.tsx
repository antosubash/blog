import React from "react";
import Kofi from "./kofi";
import Markdown from "./markdown";

type Props = {
  content: string;
  videoId: string;
  title: string;
};

const PostBody = ({ content, videoId, title }: Props) => {
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
      <Markdown content={content} />
      <div className="pt-8">
        <Kofi />
      </div>
    </div>
  );
};

export default PostBody;
