import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	compress: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false
			}
		}
		config.externals = [...(config.externals || []), { canvas: 'canvas' }]
		return config
	},
	experimental: {
		optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
	}
}

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts')
export default withNextIntl(nextConfig)
