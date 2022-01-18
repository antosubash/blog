import { getAllPosts, getPostBySlug } from '@lib/api';
import React from 'react'

interface Props {
    
}

const Page = (props: Props) => {
    return (
        <div>
            page
        </div>
    )
}

export default Page

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: any) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
    "videoId",
    "tags"
  ]);
  return {
    props: {
      post: post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((posts: any) => {
      return {
        params: {
          slug: posts.slug,
        },
      };
    }),
    fallback: false,
  };
}

