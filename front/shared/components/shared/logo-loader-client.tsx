'use client'

import { useEffect } from 'react'

interface Props {
	isLoading: boolean
	minMs?: number
}

export function LogoLoaderClient({ isLoading, minMs = 1500 }: Props) {
	useEffect(() => {
		if (!isLoading) {
			const el = document.getElementById('logo-loader')
			if (!el) return

			const timer = setTimeout(() => {
				el.style.opacity = '0'
				el.style.pointerEvents = 'none'

				const remove = () => {
					if (el && el.parentNode) el.parentNode.removeChild(el)
				}

				el.addEventListener('transitionend', remove, { once: true })
			}, minMs)

			return () => clearTimeout(timer)
		}
	}, [isLoading, minMs])

	return null
}
