'use client'

import { useTranslations } from 'next-intl'

import {
	ChatMessageItem,
	Container,
	ScrollArea,
	StreamingAssistantMessage
} from '@/shared/components'
import { useChatAutoScroll } from '@/shared/hooks'
import { ChatMessage } from '@/shared/types'

interface Props {
	messages: ChatMessage[]
	isLoading: boolean
	streamingResponse: string
	showTypingPlaceholder: boolean
}

export function ChatHistory({
	messages,
	isLoading,
	streamingResponse,
	showTypingPlaceholder
}: Props) {
	const t = useTranslations()

	const { scrollAreaRef, messagesEndRef, handleScroll } = useChatAutoScroll({
		isLoading,
		streamingResponse,
		messages
	})

	return (
		<ScrollArea
			className='chat__history__wrapper'
			ref={scrollAreaRef}
			onScroll={handleScroll}
		>
			<Container>
				<div className='chat__history'>
					{messages.map((m: ChatMessage) => (
						<ChatMessageItem
							key={m.id}
							message={m}
							isLoading={isLoading}
						/>
					))}

					{isLoading &&
						!streamingResponse &&
						showTypingPlaceholder && (
							<div className='chat__message chat__message--assistant'>
								<div className='chat__message__info'>
									🤖 {t('app.name') + ' '}
									<span className='chat__typing'>
										{t('common.status.typing')}
									</span>
								</div>
								<div className='chat__message-content'>
									🤔
									<span className='chat__thinking'>
										{t('common.status.thinking')}
									</span>
								</div>
							</div>
						)}

					{streamingResponse && (
						<StreamingAssistantMessage
							content={streamingResponse}
						/>
					)}

					<div ref={messagesEndRef} style={{ height: '0.1px' }} />
				</div>
			</Container>
		</ScrollArea>
	)
}
