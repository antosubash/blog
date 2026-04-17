import type { ImgHTMLAttributes } from "react"

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
}

const Image = ({ fill, className, style, alt, ...imgProps }: ImageProps) => {
  if (fill) {
    return (
      <img
        loading="lazy"
        className={className}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "absolute",
          ...style,
        }}
        {...imgProps}
        alt={alt}
      />
    )
  }
  return (
    <img
      loading="lazy"
      className={className}
      style={style}
      {...imgProps}
      alt={alt}
    />
  )
}

export default Image
