'use client'

import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FormEvent, KeyboardEvent, useState } from 'react'

import { Button, PromptTextarea } from '@/shared/components'

interface PromptBoxProps {
	isLoading: boolean
	onMessageSubmit: (message: string) => void
}

export function PromptBox({ isLoading, onMessageSubmit }: PromptBoxProps) {
	const t = useTranslations()
	const [input, setInput] = useState('')

	const busy = isLoading
	const canSend = !busy && input.trim().length > 0

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (!canSend) return

		const prompt = input.trim()
		setInput('')
		onMessageSubmit(prompt)
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
