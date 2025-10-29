import { readFileSync } from 'fs'
import { join } from 'path'
import type { Posts, Authors } from '@/types/content'

const CONTENT_DIR = join(process.cwd(), '.content')

let cachedPosts: Posts[] | null = null
let cachedAuthors: Authors[] | null = null

function loadPosts(): Posts[] {
  if (cachedPosts) {
    return cachedPosts
  }

  try {
    const filePath = join(CONTENT_DIR, 'Posts', '_index.json')
    const fileContents = readFileSync(filePath, 'utf8')
    cachedPosts = JSON.parse(fileContents) as Posts[]
    return cachedPosts
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

function loadAuthors(): Authors[] {
  if (cachedAuthors) {
    return cachedAuthors
  }

  try {
    const filePath = join(CONTENT_DIR, 'Authors', '_index.json')
    const fileContents = readFileSync(filePath, 'utf8')
    cachedAuthors = JSON.parse(fileContents) as Authors[]
    return cachedAuthors
  } catch (error) {
    console.error('Error loading authors:', error)
    return []
  }
}

export const allPosts: Posts[] = loadPosts()
export const allAuthors: Authors[] = loadAuthors()
