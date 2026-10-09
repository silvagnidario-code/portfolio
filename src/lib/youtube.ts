const VIDEO_ID = /^[\w-]{11}$/

/** Returns the 11-character video id of a YouTube URL, or null for anything else. */
export function getYouTubeId(raw: string | null | undefined): string | null {
  if (!raw) return null

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(www|m)\./, '')
  let id: string | null = null

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v')
    } else {
      const [, kind, value] = url.pathname.split('/')
      if (kind === 'embed' || kind === 'shorts' || kind === 'live' || kind === 'v') {
        id = value ?? null
      }
    }
  }

  return id && VIDEO_ID.test(id) ? id : null
}
