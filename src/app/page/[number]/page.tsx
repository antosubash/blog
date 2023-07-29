import { POSTS_PER_PAGE } from "@lib/constants";
import Pagination from "@components/pagination-item";
import PostItemSmall from "@components/post-item-small";
import { getPosts } from "@lib/content";

const PostPage = ({ params }: { params: { number: number } }) => {
  const allPosts = getPosts();
  const pageNumber = params.number || 2;
  const initialDisplayPosts = allPosts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );

  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE),
  };

  return (
    <>
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <div className="relative">
            <input
              aria-label="Search articles"
              type="text"
              placeholder="Search articles"
              className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Latest
          </h1>
        </div>
        <ul className="divide-y">
          {!initialDisplayPosts.length && "No posts found."}
          {initialDisplayPosts.map((post) => {
            const { slug, date, title, excerpt, tags, series, part } = post;
            return (
              <PostItemSmall
                slug={slug}
                date={date}
                title={title}
                summary={excerpt}
                tags={tags!}
                series={series}
                part={part}
              ></PostItemSmall>
            );
          })}
        </ul>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      </div>
    </>
  );
};

export default PostPage;
