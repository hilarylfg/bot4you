import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { Nunito } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

import { Providers } from '@/shared/components'
import { routing } from '@/shared/i18n/routing'
import '@/shared/styles/main.css'

const nunito = Nunito({
	subsets: ['cyrillic'],
	variable: '--font-nunito',
	weight: ['500', '600', '700', '900']
})

export const metadata: Metadata = {
	title: 'Bot4You'
}

export default async function LocaleLayout({
	children,
	params
}: {
	children: ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={nunito.variable}>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
