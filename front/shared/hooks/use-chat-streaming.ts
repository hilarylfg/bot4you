'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type TextPart } from 'ai'

interface UseChatStreamingArgs {
	model?: string
	endpoint?: string
}

export function useChatStreaming({ model, endpoint }: UseChatStreamingArgs) {
	const resolvedEndpoint =
		endpoint ||
		(process.env.NEXT_PUBLIC_SERVER_URL
			? `${process.env.NEXT_PUBLIC_SERVER_URL}/chat/stream`
			: '/api/chat/stream')

	const { messages, sendMessage, status, error, setMessages } = useChat({
		transport: new DefaultChatTransport({
			api: resolvedEndpoint,
			prepareSendMessagesRequest: ({ messages }) => {
				const lastMessage = messages[messages.length - 1]
				const lastText = lastMessage.parts
					.filter((p): p is TextPart => p.type === 'text')
					.map(p => p.text)
					.join('')

				const history = messages.slice(0, -1).map(m => ({
					role: m.role,
					content: m.parts
						.filter((p): p is TextPart => p.type === 'text')
						.map(p => p.text)
						.join('')
				}))

				return {
					body: {
						prompt: lastText,
						model,
						history
					}
				}
			}
		})
	})

	const isStreaming = status === 'streaming'
	const isLoading = isStreaming

	const lastAssistantMessage = [...messages]
		.reverse()
		.find(m => m.role === 'assistant')

	const accumulated = lastAssistantMessage
		? lastAssistantMessage.parts
				.filter((p): p is TextPart => p.type === 'text')
				.map(p => p.text)
				.join('')
		: ''

	return {
		messages,
		isStreaming,
		isLoading,
		accumulated,
		error: error?.message,
		sendMessage,
		setMessages
	}
}
