import React from 'react'
import { YouTubeEmbed } from '@next/third-parties/google'
const YoutubeVideo = ({ videoId }) => {
  if (!videoId) {
    return null
  }
  return <YouTubeEmbed videoid={videoId} />
}
export default YoutubeVideo
