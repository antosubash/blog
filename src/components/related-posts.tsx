import { BlogPost } from "@blog/types/postType";
import Link from "next/link";

const RelatedPost = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        Related Posts
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-4">
        {posts.map((post) => (
          <Link
            href={`/posts/${post.slug}`}
            className="text-xl font-bold text-gray-800 dark:text-gray-200 umami--click--related-post"
          >
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPost;
