import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import en from '@/shared/locales/en.json'
import ru from '@/shared/locales/ru.json'

import { routing } from './routing'

const messages = {
	en,
	ru
}

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale

	return {
		locale,
		messages: messages[locale as keyof typeof messages]
	}
})
