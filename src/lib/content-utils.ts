import { format } from "date-fns"

export function formatDate(date: string | Date, _locale: string = "en-US"): string {
  return format(new Date(date), "MMMM d, yyyy")
}
