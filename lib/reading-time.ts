// Get a consistent reading time display with emoji
export function getReadingTimeDisplay(readingTime: {
  text: string
  minutes: number
  time: number
  words: number
}): {
  text: string
  icon: string
  color: string
} {
  const minutes = Math.ceil(readingTime.minutes)

  if (minutes < 1) {
    return {
      text: 'Less than 1 min read',
      icon: '⚡',
      color: 'text-green-600 dark:text-green-400',
    }
  } else if (minutes <= 3) {
    return {
      text: `${minutes} min read`,
      icon: '📖',
      color: 'text-blue-600 dark:text-blue-400',
    }
  } else if (minutes <= 7) {
    return {
      text: `${minutes} min read`,
      icon: '📚',
      color: 'text-purple-600 dark:text-blue-400',
    }
  } else if (minutes <= 15) {
    return {
      text: `${minutes} min read`,
      icon: '📖',
      color: 'text-orange-600 dark:text-orange-400',
    }
  } else {
    return {
      text: `${minutes} min read`,
      icon: '📚',
      color: 'text-red-600 dark:text-red-400',
    }
  }
}
