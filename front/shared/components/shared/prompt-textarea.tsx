'use client'

import { useTranslations } from 'next-intl'
import { TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/utils'

interface PromptTextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	isLoading?: boolean
}

export function PromptTextarea({
	isLoading,
	placeholder,
	rows = 4,
	className,
	...rest
}: PromptTextareaProps) {
	const t = useTranslations()
	return (
		<textarea
			rows={rows}
			disabled={isLoading}
			placeholder={placeholder ?? t('placeholders.question')}
			className={cn(className, 'prompt-box__textarea')}
			{...rest}
		/>
	)
}
