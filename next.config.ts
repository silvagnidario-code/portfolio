import path from 'path'
import { fileURLToPath } from 'url'

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Required by the Dockerfile: bundles a minimal server in .next/standalone.
  output: 'standalone',
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
