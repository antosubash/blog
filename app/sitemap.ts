import { allPosts } from 'contentlayer/generated'
import type { MetadataRoute } from 'next'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import { getTagsWithCount } from '@/lib/tag-utils'

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

  const tagCounts = getTagsWithCount()

  const tagRoutes = tagCounts.map((tagWithCount) => ({
    url: `${siteUrl}/tags/${tagWithCount.tag}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes, ...tagRoutes]
}
