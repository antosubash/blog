import { MetadataRoute } from 'next'
import { allPosts } from '@/lib/content'
import siteMetadata from '@/data/siteMetadata'
import { allCoreContent, sortPosts } from '@/lib/utils/content-utils'
import { getTagsWithCountFromPosts } from '@/lib/tag-utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allCoreContent(sortPosts(allPosts))
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'projects', 'tags', 'posts', 'about', 'consulting'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const tagCounts = getTagsWithCountFromPosts(allPosts)

  const tagRoutes = tagCounts.map((tagWithCount) => ({
    url: `${siteUrl}/tags/${tagWithCount.tag}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...tagRoutes]
}
