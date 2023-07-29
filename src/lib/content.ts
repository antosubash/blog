import { Post, allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { TagItem } from "models/TagItem";

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

export function getSeriesList() {
  const series = new Set<Post>();
  allPosts.forEach((post) => {
    if (post.series != null && post.isDraft !== true && post.part === 0) {
      series.add(post);
    }
  });
  return Array.from(series);
}

export function getTags(): TagItem[] {
  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post?.tags?.forEach((tag) => {
      tags.add(tag);
    });
  });
  const tagItems = Array.from(tags).map((tag) => {
    return {
      name: tag,
      count: getPostsByTag(tag).length,
    };
  });
  return tagItems.sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string) {
  return allPosts.filter((post) => post.tags?.includes(tag));
}

export function getRelatedPosts(post: Post) {
  return allPosts.filter((p) => {
    return (
      p.slug !== post.slug &&
      p.tags?.some((t) => post.tags?.includes(t))
    );
  });
}