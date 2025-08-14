'use client'

import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
	Dispatch,
	FormEvent,
	KeyboardEvent,
	SetStateAction,
	useCallback,
	useState
} from 'react'

import { Button, PromptTextarea } from '@/shared/components'
import { useChatStreaming } from '@/shared/hooks'
import { ChatMessage } from '@/shared/types'

interface PromptBoxProps {
	setIsLoading: Dispatch<SetStateAction<boolean>>
	setError: Dispatch<SetStateAction<string | null>>
	isLoading: boolean
	onMessageSubmit?: (message: string) => void
	onResponseStart?: (partial: string) => void
	onResponseComplete?: (final: string) => void
	chatHistory?: ChatMessage[]
	enableAbort?: boolean
}

export function PromptBox({
	setIsLoading,
	setError,
	isLoading,
	onMessageSubmit,
	onResponseStart,
	onResponseComplete,
	chatHistory = []
}: PromptBoxProps) {
	const t = useTranslations()
	const [input, setInput] = useState('')

	const { isStreaming, start } = useChatStreaming({
		model: 'qwen/qwen3-30b-a3b:free',
		referer:
			typeof window !== 'undefined' ? window.location.origin : undefined
	})

	const busy = isLoading || isStreaming
	const canSend = !busy && input.trim().length > 0

	const beginStream = useCallback(
		(prompt: string) => {
			start({
				prompt,
				history: chatHistory,
				onStart: () => {
					onResponseStart?.('')
				},
				onDelta: accumulated => {
					onResponseStart?.(accumulated)
				},
				onComplete: final => {
					onResponseComplete?.(final)
					setIsLoading(false)
				},
				onError: err => {
					setError(err.message)
					setIsLoading(false)
				}
			})
		},
		[
			start,
			chatHistory,
			onResponseStart,
			onResponseComplete,
			setIsLoading,
			setError
		]
	)

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (!canSend) return

		const prompt = input.trim()
		setInput('')
		onMessageSubmit?.(prompt)

		setIsLoading(true)
		setError(null)
		beginStream(prompt)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (canSend) handleSubmit(e as unknown as FormEvent)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='prompt-box__form'>
			<PromptTextarea
				value={input}
				onChange={e => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				isLoading={busy}
			/>

			<hr className='prompt-box__hr' />

			<div className='prompt-box__buttons'>
				<Button
					type='submit'
					disabled={!canSend}
					className='prompt-box__button'
				>
					{busy ? (
						t('common.status.processing')
					) : (
						<>
							<Send size={16} />
							{t('common.actions.send')}
						</>
					)}
				</Button>
			</div>
		</form>
	)
}
