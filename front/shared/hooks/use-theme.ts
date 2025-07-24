'use client'

import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
	const [theme, setTheme] = useState<Theme>('system')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const savedTheme = localStorage.getItem('theme') as Theme
		if (savedTheme) {
			setTheme(savedTheme)
		}
	}, [])

	useEffect(() => {
		if (!mounted) return

		const root = document.documentElement

		if (theme === 'system') {
			const systemTheme = window.matchMedia(
				'(prefers-color-scheme: dark)'
			).matches
				? 'dark'
				: 'light'
			root.setAttribute('data-theme', systemTheme)
		} else {
			root.setAttribute('data-theme', theme)
		}

		localStorage.setItem('theme', theme)
	}, [theme, mounted])

	const toggleTheme = () => {
		setTheme(current => (current === 'light' ? 'dark' : 'light'))
	}

	return { theme, setTheme, toggleTheme, mounted }
}
