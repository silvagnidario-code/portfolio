import path from 'path'
import { fileURLToPath } from 'url'

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  /**
   * A minimal server bundled into `.next/standalone`, which is what the
   * Dockerfile copies. Vercel builds its own output and warns about this one,
   * so it is left off there — the same repository deploys to both.
   */
  output: process.env.VERCEL ? undefined : 'standalone',
  /**
   * Metadata goes in the <head> for every client, not only for the bots Next
   * assumes cannot render JavaScript.
   *
   * This site exists to be found, and its pages are dynamic, so `generateMetadata`
   * would otherwise be streamed into the body — where an indexer that does not
   * run a browser never sees the description, the canonical or the hreflang.
   * The cost is that the shell waits for a query the page needs anyway, and it
   * was measured: LCP did not move.
   */
  htmlLimitedBots: /.*/,
  outputFileTracingRoot: dirname,
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    remotePatterns: process.env.S3_PUBLIC_URL
      ? [
          {
            protocol: new URL(process.env.S3_PUBLIC_URL).protocol.replace(':', '') as
              'http' | 'https',
            hostname: new URL(process.env.S3_PUBLIC_URL).hostname,
            port: new URL(process.env.S3_PUBLIC_URL).port,
          },
        ]
      : [],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
