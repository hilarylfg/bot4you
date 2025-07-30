'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const ThemeSwitch = () => {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	const isDark = resolvedTheme === 'dark'

	return (
		<div className='theme-switch__wrapper hidden-tablet'>
			<label className='theme-switch'>
				<input
					type='checkbox'
					checked={isDark}
					onChange={() => setTheme(isDark ? 'light' : 'dark')}
					aria-label='Переключить тему'
				/>
				<span className='slider round'>
					<Sun className='sun-icon' />
					<Moon className='moon-icon' />
				</span>
			</label>
		</div>
	)
}