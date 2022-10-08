import fs from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import getAllFilesRecursively from "./utils/files";
import { MAX_DISPLAY } from "./constants";
import { BlogPost } from "@blog/types/postType";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostFiles() {
  return getAllFilesRecursively(postsDirectory);
}

export function getAllTags() {
  var allPosts = getAllPosts(["tags"]);
  let tagCount: any = {};
  allPosts.forEach((post: { tags: any[] }) => {
    post.tags.forEach((tag) => {
      const formattedTag = tag.toLowerCase();
      if (formattedTag in tagCount) {
        tagCount[formattedTag] += 1;
      } else {
        tagCount[formattedTag] = 1;
      }
    });
  });
  return tagCount;
}

export function getPostByTag(tag: string) {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "tags",
    "series",
    "part",
  ]);
  const posts = allPosts.filter((post: any) => {
    return post.tags.includes(tag.toLowerCase());
  });
  return posts;
}

export function getAllSlugs() {
  return getPostFiles().map((filePath: string) => {
    const slug = basename(filePath, ".md");
    return slug;
  });
}

export function getFileBySlug(slug: string) {
  var filePath = getPostFiles().find(
    (filePath: string) => basename(filePath, ".md") === slug
  );
  return filePath;
}

export function getPostBySlug(slug: string, fields: string[] = []): BlogPost {
  var file = getFileBySlug(slug);
  const fileContents = fs.readFileSync(file, "utf8");
  const { data, content } = matter(fileContents);
  var blogPost = {} as BlogPost;
  blogPost.slug = slug;
  blogPost.content = content;
  blogPost.date = data.date;
  blogPost.title = data.title;
  blogPost.videoId = data.videoId || "";
  blogPost.excerpt = data.excerpt;
  blogPost.tags = data.tags || [];
  blogPost.series = data.series || "";
  blogPost.part = data.part ?? -1;
  return blogPost;
}

export function getAllPosts(fields: string[] = []): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs
    .map((slug: any) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1: any, post2: any) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getLatestPosts(
  fields: string[] = [],
  limit: number = MAX_DISPLAY
): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs
    .map((slug: string) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1: BlogPost, post2: BlogPost) =>
      post1.date > post2.date ? -1 : 1
    )
    .slice(0, limit) as BlogPost[];
  return posts;
}

export function getSeriesPosts(fields: string[] = []) : BlogPost[] {
  const allPosts = getAllPosts(fields);
  const posts = allPosts.filter((post: BlogPost) => {
    return post.part == 0;
  });
  return posts;
}

export function getPostBySeries(slug: string) : BlogPost[] {
  const allPosts = getAllPosts();
  var mainPost = allPosts.find((post: BlogPost) => {
    return post.slug == slug;
  });
  const posts = allPosts.filter((post: BlogPost) => {
    return post.series == mainPost?.series;
  });
  return posts;
}
