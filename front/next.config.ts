import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	compress: true,
	transpilePackages: ['next-intl']
}

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts')
export default withNextIntl(nextConfig)
