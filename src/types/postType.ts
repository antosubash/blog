import Author from "@blog/types/author";

type PostType = {
  slug: string;
  title: string;
  videoId: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  tags: string[];
};

export default PostType;
