'use client'

import { useCallback, useRef, useState } from 'react'

import type { ChatMessage } from '@/shared/types'
import { openRouterStream } from '@/shared/utils'

interface UseChatStreamingArgs {
	model: string
	apiKey?: string
	endpoint?: string
	referer?: string
}

interface StartStreamOptions {
	prompt: string
	history: ChatMessage[]
	onStart?: () => void
	onDelta?: (accumulated: string, delta: string) => void
	onComplete?: (final: string) => void
	onError?: (err: Error) => void
	signal?: AbortSignal
}

export function useChatStreaming({
	apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
	model,
	endpoint,
	referer
}: UseChatStreamingArgs) {
	const [isStreaming, setIsStreaming] = useState(false)
	const [accumulated, setAccumulated] = useState('')
	const startCallIdRef = useRef(0)

	const start = useCallback(
		async ({
			prompt,
			history,
			onStart,
			onDelta,
			onComplete,
			onError,
			signal
		}: StartStreamOptions) => {
			if (!apiKey) {
				const err = new Error('OpenRouter API key is missing')
				onError?.(err)
				return
			}

			setIsStreaming(true)
			setAccumulated('')
			const callId = ++startCallIdRef.current

			try {
				const messages = [
					...history.map(m => ({ role: m.role, content: m.content })),
					{ role: 'user', content: prompt }
				]

				const { done } = await openRouterStream({
					apiKey,
					model,
					endpoint,
					referer,
					messages,
					signal,
					onStart: () => {
						if (startCallIdRef.current !== callId) return
						onStart?.()
					},
					onDelta: (delta, full) => {
						if (startCallIdRef.current !== callId) return
						setAccumulated(full)
						onDelta?.(full, delta)
					},
					onComplete: final => {
						if (startCallIdRef.current !== callId) return
						setAccumulated(final)
						setIsStreaming(false)
						onComplete?.(final)
					},
					onError: err => {
						if (startCallIdRef.current !== callId) return
						setIsStreaming(false)
						onError?.(err)
					}
				})

				await done
			} catch (err) {
				if (startCallIdRef.current !== callId) return
				setIsStreaming(false)
				if ((err as Error)?.name !== 'AbortError') {
					onError?.(err as Error)
				}
			}
		},
		[apiKey, model, endpoint, referer]
	)

	return {
		isStreaming,
		accumulated,
		start
	}
}
