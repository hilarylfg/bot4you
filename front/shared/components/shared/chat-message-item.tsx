'use client'

import { Copy, RefreshCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo } from 'react'
import { toast } from 'sonner'

import { MarkdownMessage } from './markdown-message'
import { Button } from '../ui/button'
import { useInDev } from '@/shared/hooks'
import { ChatMessage } from '@/shared/types'
import { copyToClipboard, formatTime } from '@/shared/utils'

interface Props {
	message: ChatMessage
	isLoading: boolean
}

function ChatMessageItemComponent({ message, isLoading }: Props) {
	const t = useTranslations()

	const handleCopy = async () => {
		const ok = await copyToClipboard(message.content)
		toast(
			ok
				? t('common.messages.copySuccess')
				: t('common.messages.errorMessage', { default: 'Copy failed' }),
			{ duration: 3000 }
		)
	}

	return (
		<div className={`chat__message chat__message--${message.role}`}>
			<div className='chat__message__info'>
				{message.role === 'user'
					? `👤 ${t('common.labels.you')}`
					: `🤖 ${t('app.name')}`}
				<i className='chat__message__info__vr' />
				<span className='chat__message-time'>
					{formatTime(message.timestamp)}
				</span>
			</div>
			<div className='chat__message-content'>
				{message.role === 'assistant' ? (
					<MarkdownMessage content={message.content} />
				) : (
					message.content
				)}
			</div>
			<div className='chat__message__menu'>
				<Button
					className='chat__message__menu__button'
					variant='ghost'
					onClick={handleCopy}
				>
					<Copy />
				</Button>
				{message.role === 'assistant' && (
					<Button
						className='chat__message__menu__button'
						variant='ghost'
						onClick={useInDev}
						disabled={isLoading}
					>
						<RefreshCcw />
					</Button>
				)}
			</div>
		</div>
	)
}

export const ChatMessageItem = memo(ChatMessageItemComponent)
ChatMessageItem.displayName = 'ChatMessageItem'
