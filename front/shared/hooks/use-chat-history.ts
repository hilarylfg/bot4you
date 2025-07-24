'use client'

import { useCallback, useEffect, useState } from 'react'

import { ChatMessage } from '@/shared/types/chat'

const CHAT_HISTORY_KEY = 'bot4you-chat-history'

export const useChatHistory = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		try {
			const saved = localStorage.getItem(CHAT_HISTORY_KEY)
			if (saved) {
				const parsed = JSON.parse(saved)
				const messagesWithDates = parsed.map(
					(
						msg: Omit<ChatMessage, 'timestamp'> & {
							timestamp: string
						}
					) => ({
						...msg,
						timestamp: new Date(msg.timestamp)
					})
				)
				setMessages(messagesWithDates)
			}
		} catch (error) {
			console.error('Ошибка загрузки истории:', error)
		} finally {
			setIsLoaded(true)
		}
	}, [])

	const saveMessages = useCallback((newMessages: ChatMessage[]) => {
		try {
			localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages))
		} catch (error) {
			console.error('Ошибка сохранения:', error)
		}
	}, [])

	const addMessage = useCallback(
		(content: string, role: 'user' | 'assistant') => {
			const newMessage: ChatMessage = {
				id:
					Date.now().toString() +
					Math.random().toString(36).slice(2, 7),
				content,
				role,
				timestamp: new Date()
			}

			setMessages(prev => {
				const updated = [...prev, newMessage]
				saveMessages(updated)
				return updated
			})
		},
		[saveMessages]
	)

	const clearHistory = useCallback(() => {
		setMessages([])
		localStorage.removeItem(CHAT_HISTORY_KEY)
	}, [])

	return {
		messages,
		isLoaded,
		addMessage,
		clearHistory
	}
}
