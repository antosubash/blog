import React, { useEffect, useState } from "react";
import Markdown from './markdown';

type Props = {
  content: string;
  videoId: string;
  title: string;
};

const PostBody = ({ content, videoId, title }: Props) => {
  var url = "https://www.youtube.com/watch?v=" + videoId;
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
      <Markdown content={content} />
    </div>
  );
};

export default PostBody;
