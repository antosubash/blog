export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)

  if (minutes < 1) {
    return 'Less than 1 min read'
  } else if (minutes === 1) {
    return '1 min read'
  } else {
    return `${minutes} min read`
  }
}

export function calculateReadingTimeFromWords(wordCount: number): string {
  const wordsPerMinute = 200
  const minutes = Math.ceil(wordCount / wordsPerMinute)

  if (minutes < 1) {
    return 'Less than 1 min read'
  } else if (minutes === 1) {
    return '1 min read'
  } else {
    return `${minutes} min read`
  }
}
