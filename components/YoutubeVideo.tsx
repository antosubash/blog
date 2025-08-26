'use client'

import { YouTubeEmbed } from '@next/third-parties/google'
import React from 'react'

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
