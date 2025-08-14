export interface OpenRouterStreamParams {
	apiKey: string
	model: string
	messages: Array<{ role: string; content: string }>
	onDelta: (delta: string, accumulated: string) => void
	onError?: (err: Error) => void
	onStart?: () => void
	onComplete?: (final: string) => void
	endpoint?: string
	referer?: string
	signal?: AbortSignal
}

export async function openRouterStream({
	apiKey,
	model,
	messages,
	onDelta,
	onError,
	onStart,
	onComplete,
	endpoint = 'https://openrouter.ai/api/v1/chat/completions',
	referer,
	signal
}: OpenRouterStreamParams) {
	let accumulated = ''
	const { extractContentDeltas } = await import('@/shared/utils')

	const run = async () => {
		try {
			onStart?.()

			const res = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
					...(referer ? { 'HTTP-Referer': referer } : {})
				},
				body: JSON.stringify({ model, messages, stream: true }),
				signal
			})

			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			if (!res.body) throw new Error('No response body')

			const reader = res.body.getReader()
			const decoder = new TextDecoder()

			for (;;) {
				const { done, value } = await reader.read()
				if (done) break
				const chunk = decoder.decode(value, { stream: true })
				const deltas = extractContentDeltas(chunk)
				for (const d of deltas) {
					accumulated += d
					onDelta(d, accumulated)
				}
			}

			onComplete?.(accumulated)
		} catch (e) {
			if ((e as any)?.name !== 'AbortError') {
				onError?.(e as Error)
			}
		}
	}

	return { done: run() }
}
