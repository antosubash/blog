import remark from 'remark'
import html from 'remark-html'
const highlight = require('remark-highlight.js');
export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(highlight).use(html).process(markdown)
  return result.toString()
}
