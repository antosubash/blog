import fs from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import getAllFilesRecursively from "./utils/files";
import { MAX_DISPLAY } from "./constants";
import { BlogPost } from "@blog/types/postType";
import { compileMdx } from "./compile-mdx";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostFiles() {
  return getAllFilesRecursively(postsDirectory);
}

export async function getAllTags() {
  var allPosts = await getAllPosts(["tags"]);
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

export async function getPostByTag(tag: string) {
  const allPosts = await getAllPosts([
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
    const slug = basename(filePath, ".mdx");
    return slug;
  });
}

export function getFileBySlug(slug: string) {
  var filePath = getPostFiles().find(
    (filePath: string) => basename(filePath, ".mdx") === slug
  );
  return filePath;
}

export async function getPostBySlug(slug: string, fields: string[] = []): Promise<BlogPost> {
  var file = getFileBySlug(slug);
  const fileContents = fs.readFileSync(file, "utf8");
  const { data, content } = matter(fileContents);
  const compiledMdx = await compileMdx(content);
  var blogPost = {
    isDraft: data.isDraft || false,
  } as BlogPost;
  if (fields.length > 0) {
    fields.forEach((field) => {
      switch (field) {
        case "slug":
          blogPost[field] = slug;
          break;
        case "content":
          blogPost[field] = compiledMdx;
          break;
        case "date":
          blogPost.date = data.date;
          break;
        case "tags":
          blogPost.tags = data.tags || [];
          break;
        case "series":
          blogPost.series = data.series || "";
          break;
        case "part":
          blogPost.part = data.part ?? -1;
          break;
        case "title":
          blogPost.title = data.title;
          break;
        case "videoId":
          blogPost.videoId = data.videoId || "";
          break;
        case "excerpt":
          blogPost.excerpt = data.excerpt;
          break;
        default:
          break;
      }
    });
  }
  return blogPost;
}

export async function getAllPosts(fields: string[] = []): Promise<BlogPost[]> {
  const slugs = getAllSlugs();
  const posts = await Promise.all(slugs
    .map(async (slug: string) => await getPostBySlug(slug, fields)))
  const storedPosts = posts
    .sort((post1: BlogPost, post2: BlogPost) =>
      post1.date > post2.date ? -1 : 1
    ) as BlogPost[];
  return storedPosts.filter((post: BlogPost) => !post.isDraft);
}

export async function getLatestPosts(
  fields: string[] = [],
  limit: number = MAX_DISPLAY
): Promise<BlogPost[]> {
  const slugs = getAllSlugs();
  const posts = await Promise.all(slugs
    .map(async (slug: string) => await getPostBySlug(slug, fields)))
  const storedPosts = posts
    .sort((post1: BlogPost, post2: BlogPost) =>
      post1.date > post2.date ? -1 : 1
    )
    .filter((post: BlogPost) => !post.isDraft)
    .slice(0, limit) as BlogPost[];
  return storedPosts;
}

export async function getSeriesPosts(fields: string[] = []): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(fields);
  const posts = allPosts.filter((post: BlogPost) => {
    return post.part == 0;
  });
  return posts.filter((post: BlogPost) => !post.isDraft);
}

export async function getPostBySeries(
  slug: string,
  fields: string[] = []
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(fields);
  var mainPost = allPosts.find((post: BlogPost) => {
    return post.slug == slug;
  });
  const posts = allPosts.filter((post: BlogPost) => {
    return post.series == mainPost?.series;
  });
  return posts.filter((post: BlogPost) => !post.isDraft);
}
