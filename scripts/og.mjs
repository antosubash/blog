import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function init() {
  const postsJsonPath = path.resolve(__dirname, '../.contentlayer/generated/Posts/_index.json')
  const allPosts = JSON.parse(readFileSync(postsJsonPath, 'utf8'))
  await generateAllOgImagesIfNeeded(allPosts)
}

async function generateAllOgImagesIfNeeded(allPosts) {
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

function wrapText(text, maxWidth, fontSize) {
  const words = text.split(' ')
  const lines = []
  let currentLine = words[0]

  // Rough estimate of character width based on font size
  const avgCharWidth = fontSize * 0.6

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = (currentLine.length + word.length + 1) * avgCharWidth

    if (width < maxWidth) {
      currentLine += ` ${word}`
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
  const frameImagePath = path.resolve('public', 'frame.png')
  const fontSize = 60
  const lineHeight = fontSize * 1.2
  const maxWidth = 750

  // Create a blank white image
  const baseImage = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  // Load the frame image
  const frameImage = await sharp(frameImagePath).toBuffer()

  // Wrap the title text
  const lines = wrapText(title, maxWidth, fontSize)

  // Create tspan elements for each line
  const tspans = lines
    .map((line, index) => `<tspan x="40" dy="${index === 0 ? '0' : lineHeight}">${line}</tspan>`)
    .join('')

  // Create SVG text
  const svgText = `
    <svg width="${width}" height="${height}">
      <style>
        .title {
          fill: #fff;
          font-size: ${fontSize}px;
          font-weight: 900;
          font-family: Arial;
        }
      </style>
      <text
        x="40"
        y="100"
        class="title"
      >${tspans}</text>
    </svg>
  `

  // Composite all layers together
  const finalImage = await sharp(baseImage)
    .composite([
      { input: frameImage, top: 0, left: 0 },
      {
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer()

  return finalImage
}

init()
