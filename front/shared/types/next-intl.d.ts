import messages from '@/shared/locales/en.json'

import { formats } from '@/i18n/request'
import { routing } from '@/i18n/routing'

declare module 'next-intl' {
	interface AppConfig {
		Locale: (typeof routing.locales)[number]
		Messages: typeof messages
		Formats: typeof formats
	}
}
