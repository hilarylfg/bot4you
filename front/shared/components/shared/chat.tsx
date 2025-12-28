'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
	ChatHeader,
	ChatHistory,
	ChatWelcome,
	Container,
	LogoLoaderClient,
	PromptBox
} from '@/shared/components'
import { useChatHistory, useChatStreaming } from '@/shared/hooks'

export function Chat() {
	const t = useTranslations()
	const {
		messages: localMessages,
		addMessage,
		clearHistory
	} = useChatHistory()
	const [error, setError] = useState<string | null>(null)
	const previousStreamingRef = useRef(false)
	const accumulatedRef = useRef('')

	const {
		isStreaming,
		accumulated,
		sendMessage,
		error: streamError
	} = useChatStreaming({
		model: 'google/gemma-3-27b-it:free'
	})

	useEffect(() => {
		if (streamError) {
			setError(streamError)
		}
	}, [streamError])

	useEffect(() => {
		const streamingFinished = previousStreamingRef.current && !isStreaming
		if (
			streamingFinished &&
			accumulated &&
			accumulated !== accumulatedRef.current
		) {
			addMessage(accumulated, 'assistant')
			accumulatedRef.current = accumulated
		}

		previousStreamingRef.current = isStreaming
	}, [isStreaming, accumulated, addMessage])

	const handleMessageSubmit = useCallback(
		(text: string) => {
			addMessage(text, 'user')
			accumulatedRef.current = ''

			sendMessage({
				role: 'user',
				parts: [{ type: 'text', text }]
			})
		},
		[sendMessage, addMessage]
	)

	const handleClearAll = useCallback(() => {
		if (confirm(t('common.messages.clearConfirm'))) {
			clearHistory()
			accumulatedRef.current = ''
		}
	}, [t, clearHistory])

	return (
		<>
			<LogoLoaderClient isLoading={false} />
			<div className='chat'>
				<ChatHeader
					hasMessages={localMessages.length > 0}
					onClear={handleClearAll}
					error={error ?? null}
				/>

				{localMessages.length === 0 && !isStreaming ? (
					<ChatWelcome />
				) : (
					<ChatHistory
						messages={localMessages}
						isLoading={isStreaming}
						streamingResponse={
							isStreaming ? accumulated : undefined
						}
						showTypingPlaceholder={true}
					/>
				)}

				<div className='chat__form-container'>
					<Container>
						<PromptBox
							isLoading={isStreaming}
							onMessageSubmit={handleMessageSubmit}
						/>
					</Container>
				</div>
			</div>
		</>
	)
}
