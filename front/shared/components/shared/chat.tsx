'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import {
	ChatHeader,
	ChatHistory,
	ChatWelcome,
	Container,
	LogoLoaderClient,
	PromptBox
} from '@/shared/components'
import { useChatController } from '@/shared/hooks'

export function Chat() {
	const t = useTranslations()
	const {
		messages,
		localHistory,
		streamingResponse,
		isLoaded,
		isLoading,
		error,
		setIsLoading,
		setError,
		submitUserMessage,
		startResponse,
		completeResponse,
		clearAll
	} = useChatController()

	const onConfirmClear = useCallback(() => {
		if (confirm(t('common.messages.clearConfirm'))) {
			clearAll()
		}
	}, [t, clearAll])

	return (
		<>
			<LogoLoaderClient isLoading={!isLoaded} />
			<div className='chat'>
				<ChatHeader
					hasMessages={messages.length > 0}
					onClear={onConfirmClear}
					error={error}
				/>

				{messages.length === 0 ? (
					<ChatWelcome />
				) : (
					<ChatHistory
						messages={messages}
						isLoading={isLoading}
						streamingResponse={streamingResponse}
						showTypingPlaceholder={true}
					/>
				)}

				<div className='chat__form-container'>
					<Container>
						<PromptBox
							setIsLoading={setIsLoading}
							setError={setError}
							isLoading={isLoading}
							onMessageSubmit={submitUserMessage}
							onResponseStart={startResponse}
							onResponseComplete={completeResponse}
							chatHistory={localHistory}
						/>
					</Container>
				</div>
			</div>
		</>
	)
}
