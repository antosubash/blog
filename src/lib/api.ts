import fs from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import getAllFilesRecursively from "./utils/files";
import getDirectories from "./utils/directories";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostFiles() {
  return getAllFilesRecursively(postsDirectory);
}

export function getAllTags() {
  return getDirectories(postsDirectory);
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

export function getPostBySlug(slug: string, fields: string[] = []) {
  var file = getFileBySlug(slug);
  const fileContents = fs.readFileSync(file, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = slug!;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });
  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getAllSlugs();
  const posts = slugs
    .map((slug: any) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1: any, post2: any) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
