'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
	isLoading: boolean
	minMs?: number
}

export function LogoLoaderClient({ isLoading, minMs = 1500 }: Props) {
	const [visible, setVisible] = useState(true)
	const loaderRef = useRef<HTMLElement | null>(null)

	useEffect(() => {
		loaderRef.current = document.getElementById('logo-loader')
	}, [])

	useEffect(() => {
		if (!isLoading) {
			const timer = setTimeout(() => {
				setVisible(false)
			}, minMs)

			return () => clearTimeout(timer)
		}
	}, [isLoading, minMs])

	useEffect(() => {
		if (!visible && loaderRef.current) {
			loaderRef.current.style.opacity = '0'
			loaderRef.current.style.pointerEvents = 'none'
		}
	}, [visible])

	return null
}
