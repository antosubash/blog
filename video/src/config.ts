export const SITE_URL = "https://blog.antosubash.com"
export const AUTHOR_NAME = "Anto Subash"
export const SITE_LABEL = "blog.antosubash.com"

export const TTS_CONCURRENCY = 4

export const PRIVACY_VALUES = ["public", "unlisted", "private"] as const
export type Privacy = (typeof PRIVACY_VALUES)[number]

export const STEP_VALUES = [
  "storyboard",
  "voice",
  "render",
  "upload",
  "all",
] as const
export type Step = (typeof STEP_VALUES)[number]
