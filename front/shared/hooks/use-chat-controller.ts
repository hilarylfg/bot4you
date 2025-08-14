'use client'

import { useCallback, useState } from 'react'

import { useChatHistory } from '@/shared/hooks'
import { ChatMessage } from '@/shared/types'

export function useChatController() {
	const { messages, isLoaded, addMessage, clearHistory } = useChatHistory()

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [streamingResponse, setStreamingResponse] = useState('')
	const [localHistory, setLocalHistory] = useState<ChatMessage[]>([])

	const createMessage = useCallback(
		(role: ChatMessage['role'], content: string): ChatMessage => ({
			id:
				Date.now().toString() +
				(role === 'assistant' ? '_assistant' : ''),
			role,
			content,
			timestamp: new Date()
		}),
		[]
	)

	const submitUserMessage = useCallback(
		(text: string) => {
			const msg = createMessage('user', text)
			addMessage(text, 'user')
			setLocalHistory(prev => [...prev, msg])
		},
		[addMessage, createMessage]
	)

	const startResponse = useCallback((partial: string = '') => {
		setStreamingResponse(partial)
	}, [])

	const completeResponse = useCallback(
		(full: string) => {
			const msg = createMessage('assistant', full)
			addMessage(full, 'assistant')
			setStreamingResponse('')
			setLocalHistory(prev => [...prev, msg])
		},
		[addMessage, createMessage]
	)

	const clearAll = useCallback(() => {
		clearHistory()
		setError(null)
		setStreamingResponse('')
		setLocalHistory([])
	}, [clearHistory])

	return {
		messages,
		localHistory,
		streamingResponse,
		//
		isLoaded,
		isLoading,
		error,
		//
		setIsLoading,
		setError,
		//
		submitUserMessage,
		startResponse,
		completeResponse,
		clearAll
	}
}
