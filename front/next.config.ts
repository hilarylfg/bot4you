import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	compress: true,
	experimental: {
		turbopackFileSystemCacheForBuild: false,
		turbopackFileSystemCacheForDev: false,
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
	}
}

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts')
export default withNextIntl(nextConfig)
