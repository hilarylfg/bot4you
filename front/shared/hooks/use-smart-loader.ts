import { useEffect, useRef, useState } from 'react'

export function useSmartLoader(isLoading: boolean, minMs = 2000) {
	const [visible, setVisible] = useState(false)
	const shownAtRef = useRef<number | null>(null)
	const timerRef = useRef<number | null>(null)

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		}
	}, [])

	useEffect(() => {
		if (isLoading) {
			if (!visible) {
				setVisible(true)
				shownAtRef.current = Date.now()
			}
			if (timerRef.current) {
				clearTimeout(timerRef.current)
				timerRef.current = null
			}
		} else {
			if (visible) {
				const started = shownAtRef.current ?? Date.now()
				const elapsed = Date.now() - started
				const remaining = Math.max(0, minMs - elapsed)

				if (timerRef.current) {
					clearTimeout(timerRef.current)
				}
				timerRef.current = window.setTimeout(() => {
					setVisible(false)
					shownAtRef.current = null
					timerRef.current = null
				}, remaining)
			}
		}
	}, [isLoading, minMs, visible])

	return visible
}
