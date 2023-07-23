import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

export function getPosts() {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
  if (process.env.NODE_ENV === "development") {
    return posts;
  } else {
    return posts.filter((p) => p.isDraft !== true);
  }
}

export function getPost(slug: string) {
  const post = allPosts.find((post) => post.slug === slug);
  if (post != null) {
    return post;
  } else {
    throw Error("Unable to Retrieve Post");
  }
}

export function getSeries(title: string, current: string) {
  return {
    title: title,
    posts: allPosts
      .filter((p) => p.series === title)
      .sort(
        (a, b) =>
          Number(a.part) - Number(b.part)
      )
      .map((p) => {
        return {
          title: p.title,
          slug: p.slug,
          status: p.isDraft ? "draft" : "published",
          isCurrent: p.slug === current,
        };
      }),
  };
}