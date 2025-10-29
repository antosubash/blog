const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escape(html: string): string {
  return html.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char] || char)
}
