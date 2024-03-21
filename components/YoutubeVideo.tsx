import React from 'react'

const YoutubeVideo = ({ videoId }) => {
  if (!videoId) {
    return null
  }

  const videoUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div>
      <iframe
        width="100%"
        height="750"
        src={videoUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default YoutubeVideo
