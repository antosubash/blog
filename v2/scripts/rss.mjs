import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import GithubSlugger from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { allPosts } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/posts/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/posts/${post.slug}</link>
    ${post.excerpt && `<description>${escape(post.excerpt)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

export function getTagsWithCount() {
  const tags = allPosts.flatMap((post) => post.tags)
  let allMappedTags = tags
    .map((tag) => {
      return {
        tag: tag,
        count: allPosts.filter((post) => post.tags.includes(tag)).length,
      }
    })
    .sort((a, b) => b.count - a.count)

  // Remove duplicates

  allMappedTags = allMappedTags.filter(
    (item, index) => allMappedTags.findIndex((i) => i.tag === item.tag) === index
  )

  return allMappedTags
}

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts))
    writeFileSync(`./public/${page}`, rss)
  }
  // RSS for tags
  const tagData = getTagsWithCount()

  tagData.forEach(tagItem => {
    const filteredPosts = allBlogs.filter((post) => post.tags.includes(tagItem.tag))
    const rss = generateRss(config, filteredPosts, `tags/${tagItem.tag}/${page}`)
    if(tagItem.tag){
      const rssPath = path.join('public', 'tags', tagItem.tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  });

  // if (publishPosts.length > 0) {
  //   for (const tag of Object.keys(tagData)) {
  //     const filteredPosts = allBlogs.filter((post) =>
  //       post.tags.map((t) => GithubSlugger.slug(t)).includes(tag)
  //     )
  //     const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
  //     const rssPath = path.join('public', 'tags', tag)
  //     mkdirSync(rssPath, { recursive: true })
  //     writeFileSync(path.join(rssPath, page), rss)
  //   }
  // }
}

const rss = () => {
  generateRSS(siteMetadata, allPosts)
  console.log('RSS feed generated...')
}
export default rss
