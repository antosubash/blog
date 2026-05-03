import { createReadStream } from "node:fs"
import { google } from "googleapis"
import type { LoadedPost } from "./loadPost"

export type YouTubePrivacy = "private" | "unlisted" | "public"

export async function uploadToYouTube(
  videoPath: string,
  post: LoadedPost,
  privacy: YouTubePrivacy = "unlisted"
): Promise<string> {
  const clientId = process.env.YOUTUBE_CLIENT_ID
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN must be set"
    )
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials({ refresh_token: refreshToken })

  const youtube = google.youtube({ version: "v3", auth: oauth2Client })

  const description = [post.excerpt, "", `Read the full post: ${post.postUrl}`]
    .filter(Boolean)
    .join("\n")

  const response = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: post.title.slice(0, 100),
        description: description.slice(0, 5000),
        tags: post.tags,
        categoryId: "28", // Science & Technology
      },
      status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
    },
    media: { body: createReadStream(videoPath) },
  })

  const videoId = response.data.id
  if (!videoId) throw new Error("YouTube did not return a video ID")
  return videoId
}
