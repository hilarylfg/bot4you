'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ChatMessage } from '@/shared/types'

interface UseAutoScrollOptions {
	streamingResponse?: string
	messages: ChatMessage[]
}

export function useChatAutoScroll({
	streamingResponse = '',
	messages
}: UseAutoScrollOptions) {
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
	const lastMessageCountRef = useRef(messages.length)
	const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const previousStreamingRef = useRef(false)

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
	}, [isAtBottom])

	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottom('auto')
			lastMessageCountRef.current = messages.length
		}
	}, [])

	useEffect(() => {
		if (shouldAutoScroll && messages.length > lastMessageCountRef.current) {
			scrollToBottom()
			lastMessageCountRef.current = messages.length
		}
	}, [messages.length, shouldAutoScroll, scrollToBottom])

	useEffect(() => {
		if (streamingResponse && shouldAutoScroll) {
			scrollToBottom()
		}
	}, [streamingResponse, shouldAutoScroll, scrollToBottom])

	useEffect(() => {
		const wasStreaming = previousStreamingRef.current
		const justFinished = wasStreaming && !streamingResponse

		if (justFinished && shouldAutoScroll) {
			completionTimeoutRef.current = setTimeout(() => {
				scrollToBottom()
			}, 120)
		}

		previousStreamingRef.current = Boolean(streamingResponse)

		return () => {
			if (completionTimeoutRef.current) {
				clearTimeout(completionTimeoutRef.current)
			}
		}
	}, [streamingResponse, shouldAutoScroll, scrollToBottom])

	return {
		scrollAreaRef,
		messagesEndRef,
		handleScroll
	}
}
