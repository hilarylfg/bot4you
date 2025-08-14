'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ChatMessage } from '@/shared/types'

interface UseAutoScrollOptions {
	isLoading: boolean
	streamingResponse: string
	messages: ChatMessage[]
}

export function useChatAutoScroll({
	isLoading,
	streamingResponse,
	messages
}: UseAutoScrollOptions) {
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
	const [isUserScrolling, setIsUserScrolling] = useState(false)
	const lastMessageCountRef = useRef(messages.length)
	const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const scrollToBottom = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({
					behavior,
					block: 'end'
				})
			}
		},
		[]
	)

	const isAtBottom = useCallback(() => {
		if (!scrollAreaRef.current) return true

		const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
		return scrollHeight - scrollTop - clientHeight < 100
	}, [])

	const handleScroll = useCallback(() => {
		if (!scrollAreaRef.current) return

		const atBottom = isAtBottom()
		setShouldAutoScroll(atBottom)

		if (isLoading || streamingResponse) {
			setIsUserScrolling(!atBottom)
		}
	}, [isAtBottom, isLoading, streamingResponse])

	useEffect(() => {
		if (shouldAutoScroll && messages.length > lastMessageCountRef.current) {
			scrollToBottom()
			lastMessageCountRef.current = messages.length
		}
	}, [messages.length, shouldAutoScroll, scrollToBottom])

	useEffect(() => {
		if (isLoading && !streamingResponse) {
			setShouldAutoScroll(true)
			setIsUserScrolling(false)
			scrollToBottom()
		}
	}, [isLoading, streamingResponse, scrollToBottom])

	useEffect(() => {
		if (streamingResponse && shouldAutoScroll && !isUserScrolling) {
			scrollToBottom()
		}
	}, [streamingResponse, shouldAutoScroll, isUserScrolling, scrollToBottom])

	useEffect(() => {
		const wasStreaming = streamingResponse.length > 0
		const justFinished = !isLoading && !streamingResponse && wasStreaming

		if (justFinished && shouldAutoScroll) {
			completionTimeoutRef.current = setTimeout(() => {
				scrollToBottom()
			}, 100)
		}

		return () => {
			if (completionTimeoutRef.current) {
				clearTimeout(completionTimeoutRef.current)
			}
		}
	}, [isLoading, streamingResponse, shouldAutoScroll, scrollToBottom])

	useEffect(() => {
		if (!isLoading && !streamingResponse) {
			setIsUserScrolling(false)
		}
	}, [isLoading, streamingResponse])

	return {
		scrollAreaRef,
		messagesEndRef,
		handleScroll
	}
}
