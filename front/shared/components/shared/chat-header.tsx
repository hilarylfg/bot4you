'use client'

import { Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
	Button,
	Container,
	LanguageSwitch,
	SidebarTrigger
} from '@/shared/components'

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
				<div className='chat__header-left'>
					<SidebarTrigger className='chat__sidebar-trigger' />
				</div>
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
