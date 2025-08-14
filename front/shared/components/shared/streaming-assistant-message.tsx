'use client'

import { useTranslations } from 'next-intl'

import { MarkdownMessage } from '@/shared/components'

interface Props {
	content: string
}

export function StreamingAssistantMessage({ content }: Props) {
	const t = useTranslations()
	return (
		<div className='chat__message chat__message--assistant'>
			<div className='chat__message__info'>
				🤖 {t('app.name') + ' '}
				<span className='chat__typing'>
					{t('common.status.typing')}
				</span>
			</div>
			<div className='chat__message-content'>
				<MarkdownMessage content={content} />
			</div>
		</div>
	)
}
