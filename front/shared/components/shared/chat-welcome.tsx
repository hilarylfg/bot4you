'use client'

import { useTranslations } from 'next-intl'

import { Container } from '@/shared/components'

export function ChatWelcome() {
	const t = useTranslations()
	return (
		<div className='chat__welcome'>
			<Container className='chat__welcome__content'>
				<h2>{t('screens.welcome.title')}</h2>
				<p>{t('screens.welcome.description')}</p>
			</Container>
		</div>
	)
}
