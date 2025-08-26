import { writeFileSync } from 'fs'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { allPosts } from '../.contentlayer/generated/index.mjs'

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
