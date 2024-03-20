import { createCanvas, loadImage } from 'canvas'
import { allPosts } from '../.contentlayer/generated/index.mjs'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

export async function generateAllOgImagesIfNeeded() {
  const posts = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
  }))

  console.log('Generating OG images for', posts.length, 'posts')

  for (const post of posts) {
    // check if og image exists
    if (!existsSync(path.resolve('public', 'og', `${post.slug}.png`))) {
      await generateOgImage(post)
    }
  }

  console.log('Generated OG images for', posts.length, 'posts')

  const tags = allPosts.flatMap((post) => post.tags)
  const uniqueTags = [...new Set(tags)]

  // remove null tags
  const uniqueTagsFiltered = uniqueTags.filter((tag) => tag !== null)

  console.log('Generating OG images for', uniqueTags.length, 'tags')

  for (const tag of uniqueTagsFiltered) {
    // check if og image exists
    if (!existsSync(path.resolve('public', 'og', `${tag}.png`))) {
      await generateOgImage({ slug: `${tag}`, title: tag })
    }
  }

  console.log('Generated OG images for', uniqueTags.length, 'tags')
}

const generateOgImage = async ({ slug, title }) => {
  const dir = path.resolve('public', 'og')
  const filepath = path.resolve(dir, `${slug}.png`)

  if (!existsSync(dir)) {
    mkdirSync(dir)
  }

  if (!existsSync(filepath)) {
    const imgBuffer = await createImage({ title })

    writeFileSync(filepath, imgBuffer)
  }
}

function getLines(ctx, text, maxWidth) {
  var words = text.split(' ')
  var lines = []
  var currentLine = words[0]

  for (var i = 1; i < words.length; i++) {
    var word = words[i]
    var width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

const createImage = async ({ title }) => {
  const width = 853
  const height = 480

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  context.fillStyle = '#fff'
  context.fillRect(0, 0, width, height)

  const image = await loadImage(path.resolve('public', 'frame.png'))

  context.drawImage(image, 0, 0)

  context.font = '900 60px Arial'
  context.fillStyle = '#fff'

  getLines(context, title, 800).forEach((line, i) => {
    context.fillText(line, 40, 100 + i * 60)
  })

  return canvas.toBuffer('image/png')
}

export default generateAllOgImagesIfNeeded
