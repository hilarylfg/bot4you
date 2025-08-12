'use client'

import { Bot, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button, Container, LanguageSwitch } from '@/shared/components'

interface ChatHeaderProps {
	hasMessages: boolean
	onClear: () => void
	error?: string | null
}

export function ChatHeader({ hasMessages, onClear, error }: ChatHeaderProps) {
	const t = useTranslations()
	return (
		<Container>
			<div className='chat__header'>
				<h1 className='chat__title'>
					<Bot size={40} /> {t('app.name')}
				</h1>
				<LanguageSwitch />
				{hasMessages && (
					<Button onClick={onClear} variant='outline'>
						<Trash size={16} />{' '}
						<span className='hidden-tablet'>
							{t('common.actions.clear')}
						</span>
					</Button>
				)}
			</div>

			{error && <div className='chat__error'>{error}</div>}
		</Container>
	)
}
