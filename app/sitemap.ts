import { MetadataRoute } from 'next'
import { allPosts } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = allCoreContent(sortPosts(allPosts))
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
    }))

  const routes = ['', 'projects', 'tags', 'posts'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
