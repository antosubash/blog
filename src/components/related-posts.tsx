import { BlogPost } from "@blog/types/postType";

const RelatedPost = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        Related Posts
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-4">
        {posts.map((post) => {
          const href = `/posts/${post.slug}`;
          return (
            <div
              key={post.slug}
              onClick={() => {
                // TODO: Find out Why Link is sending wrong href
                window.location.href = href;
              }}
              className="px-4 mx-2 rounded-2xl cursor-pointer border drop-shadow-lg border-gray-100 bg-slate-50 dark:border-gray-800 dark:bg-gray-950 z-40"
            >
              <div className="text-xl font-bold text-gray-800 dark:text-gray-200 umami--click--related-post ">
                <div
                  key={post.slug}
                  className="flex flex-col items-center w-full p-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  <p className="text-xl text-center font-bold text-gray-800 dark:text-gray-200">
                    {post.title}
                  </p>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedPost;
