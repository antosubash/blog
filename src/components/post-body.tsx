import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Markdown from './markdown';

type Props = {
  content: string;
  videoId: string;
};

const PostBody = ({ content, videoId }: Props) => {
  var url = "https://www.youtube.com/watch?v=" + videoId;
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
      {videoId ? (
        <ReactPlayer url={url} width="100%" height="700px" controls={true} />
      ) : (
        ""
      )}
      <Markdown content={content} />
    </div>
  );
};

export default PostBody;
