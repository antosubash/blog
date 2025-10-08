import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { getTagsWithCount } from '@/lib/tag-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  const allPosts = await getAllPosts()
  const blogRoutes = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'projects', 'tags', 'posts', 'about', 'consulting'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const tagCounts = await getTagsWithCount()

  const tagRoutes = tagCounts.map((tagWithCount) => ({
    url: `${siteUrl}/tags/${tagWithCount.tag}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...tagRoutes]
}
