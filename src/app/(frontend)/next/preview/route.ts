import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { env } from '@/lib/env'

/**
 * Entry point for draft and live preview.
 *
 * The admin panel never links straight to a page: it comes through here, which
 * checks the shared secret *and* the editor's own session before turning Next
 * draft mode on. Draft mode is a cookie that makes every page render unpublished
 * content, so handing it out on a guessable URL would publish the whole
 * pipeline by accident.
 */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== env.PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 })
  }

  // Only relative paths: an open redirect here would be handed out signed.
  if (!path || !path.startsWith('/')) {
    return new Response('Invalid preview path', { status: 400 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
