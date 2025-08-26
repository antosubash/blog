'use client'

import { YouTubeEmbed } from '@next/third-parties/google'

interface YoutubeVideoProps {
  videoId: string
}

const YoutubeVideo = ({ videoId }: YoutubeVideoProps) => {
  if (!videoId) {
    return null
  }
  return <YouTubeEmbed videoid={videoId} />
}

export default YoutubeVideo
