import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";

type Props = {
  content: string;
  videoId: string;
};

const PostBody = ({ content, videoId }: Props) => {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
      {videoId ? (
        <YouTube
          className="pt-10 pb-8 prose dark:prose-dark max-w-none"
          opts={{
            height: height?.toString(),
            width: width?.toString(),
          }}
          videoId={videoId}
        />
      ) : (
        ""
      )}
      <div className="pt-10 pb-8 prose dark:prose-dark max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default PostBody;
