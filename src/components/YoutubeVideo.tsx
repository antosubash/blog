interface YoutubeVideoProps {
  videoId: string
}

const YoutubeVideo = ({ videoId }: YoutubeVideoProps) => {
  if (!videoId) {
    return null
  }
  return (
    <div className="relative h-0 w-full pb-[56.25%]">
      <iframe
        className="absolute left-0 top-0 h-full w-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default YoutubeVideo
