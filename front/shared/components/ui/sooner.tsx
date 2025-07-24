'use client'

import { useTheme } from 'next-themes'
import { CSSProperties } from 'react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

export const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme()

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className='toaster group'
			style={
				{
					'--normal-bg': 'var(--bg-primary)',
					'--normal-text': 'var(--text-primary)',
					'--normal-border': 'var(--border-light)'
				} as CSSProperties
			}
			{...props}
		/>
	)
}
