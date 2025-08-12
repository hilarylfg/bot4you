'use client'

import { Bot } from 'lucide-react'

import { useSmartLoader } from '@/shared/hooks'

interface LogoLoaderProps {
	isLoading: boolean
	minMs?: number
}

export function LogoLoader({ isLoading, minMs = 1500 }: LogoLoaderProps) {
	const visible = useSmartLoader(isLoading, minMs)

	return (
		<div
			className={`logo-loader__wrapper ${!visible ? 'logo-loader__wrapper--hidden' : ''}`}
		>
			<div className='logo-loader'>
				<Bot className='logo-loader__logo' />
			</div>
		</div>
	)
}
