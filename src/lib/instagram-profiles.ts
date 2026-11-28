/**
 * Static snapshots of Instagram profiles shown inside the phone mock-up.
 *
 * Instagram's own profile embed shows only six posts, which leaves most of
 * the phone screen empty. For profiles listed here the phone shows a
 * snapshot instead: the profile header and a long, scrollable grid of the
 * latest posts (one image uploaded to the media library), with the whole
 * screen linking to the real profile.
 *
 * To refresh a snapshot, upload a new grid image and update the entry.
 */
export type InstagramProfile = {
  handle: string
  name: string
  posts: number
  followers: number
  bio: string[]
  avatar: string
  grid: { src: string; width: number; height: number }
}

const MEDIA = 'https://pub-377ce45b3a504ede913763ad0a364fe1.r2.dev/media'

const profiles: Record<string, InstagramProfile> = {
  ptw_ferrara: {
    handle: 'ptw_ferrara',
    name: 'ProveThemWrong-Fe',
    posts: 31,
    followers: 1349,
    bio: ['Studio di Produzione Musicale', 'Ferrara', 'Rec, Mix&Master, Beat, Video'],
    avatar: `${MEDIA}/ptw-instagram-avatar.jpg`,
    grid: { src: `${MEDIA}/ptw-instagram-grid.jpg`, width: 1086, height: 3378 },
  },
}

export function instagramProfile(url: string): InstagramProfile | undefined {
  try {
    const handle = new URL(url).pathname.split('/').filter(Boolean)[0]
    return handle ? profiles[handle.toLowerCase()] : undefined
  } catch {
    return undefined
  }
}
