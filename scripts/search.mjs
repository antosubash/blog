import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
// Local copies to avoid importing TS files from Node script
const sortPosts = (posts) =>
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
const allCoreContent = (contents) =>
  contents.map(({ _id, _raw, body, toc, structuredData, ...rest }) => rest)

const root = process.cwd()
const allPosts = JSON.parse(readFileSync(join(root, '.content', 'Posts', '_index.json'), 'utf8'))

const generateIndex = (allPosts) => {
  var searchFile = `./public/search.json`
  console.log(searchFile)
  writeFileSync(searchFile, JSON.stringify(allCoreContent(sortPosts(allPosts))))
  console.log('Local search index generated...')
}

const searchIndex = () => {
  generateIndex(allPosts)
  console.log('Search index generated')
}

export default searchIndex
