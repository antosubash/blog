// Content build is done before Next.js build in package.json
import rss from './rss.mjs'
import searchIndex from './search.mjs'

async function postbuild() {
  await rss()
  await searchIndex()
}

postbuild()
