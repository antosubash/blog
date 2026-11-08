import { renderOgImage } from "@/lib/og"
import { getAllPosts, isPublished } from "@/lib/posts"
import type { APIRoute, GetStaticPaths } from "astro"

export const getStaticPaths = (async () => {
  const posts = (await getAllPosts()).filter(isPublished)
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props.post)
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  })
}
