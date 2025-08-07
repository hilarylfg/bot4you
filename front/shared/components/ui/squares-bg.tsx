'use client'

import React, { useEffect, useRef } from 'react'

import { cn } from '@/shared/utils'

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
	x: number
	y: number
}

interface SquaresProps {
	direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
	speed?: number
	borderColor?: CanvasStrokeStyle
	squareSize?: number
	className?: string
	hoverFillColor?: CanvasStrokeStyle
}

export const Squares: React.FC<SquaresProps> = ({
	direction = 'right',
	speed = 1,
	borderColor,
	squareSize = 40,
	className,
	hoverFillColor
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const requestRef = useRef<number | null>(null)
	const numSquaresX = useRef<number>(0)
	const numSquaresY = useRef<number>(0)
	const gridOffset = useRef<GridOffset>({ x: 0, y: 0 })
	const hoveredSquareRef = useRef<GridOffset | null>(null)

	const getCSSVariable = (variableName: string, fallback: string): string => {
		if (typeof document !== 'undefined') {
			const rootStyles = getComputedStyle(document.documentElement)
			const value = rootStyles.getPropertyValue(variableName).trim()
			return value || fallback
		}
		return fallback
	}

	const hexToRgba = (hex: string, alpha: number): string => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		if (result) {
			const r = parseInt(result[1], 16)
			const g = parseInt(result[2], 16)
			const b = parseInt(result[3], 16)
			return `rgba(${r}, ${g}, ${b}, ${alpha})`
		}
		return `rgba(0, 0, 0, ${alpha})`
	}

	const isDarkTheme = (): boolean => {
		if (typeof document === 'undefined') return false

		const dataTheme = document.documentElement.getAttribute('data-theme')
		if (dataTheme === 'dark') return true
		if (dataTheme === 'light') return false

		return window.matchMedia('(prefers-color-scheme: dark)').matches
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth
			canvas.height = canvas.offsetHeight
			numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1
			numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1
		}

		window.addEventListener('resize', resizeCanvas)
		resizeCanvas()

		const drawGrid = () => {
			if (!ctx) return
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			const startX =
				Math.floor(gridOffset.current.x / squareSize) * squareSize
			const startY =
				Math.floor(gridOffset.current.y / squareSize) * squareSize

			const bgPrimary = getCSSVariable('--bg-primary', '#ffffff')
			const fillColor = hoverFillColor || bgPrimary
			const strokeColor = borderColor || bgPrimary

			for (
				let x = startX;
				x < canvas.width + squareSize;
				x += squareSize
			) {
				for (
					let y = startY;
					y < canvas.height + squareSize;
					y += squareSize
				) {
					const squareX = x - (gridOffset.current.x % squareSize)
					const squareY = y - (gridOffset.current.y % squareSize)

					if (
						hoveredSquareRef.current &&
						Math.floor((x - startX) / squareSize) ===
							hoveredSquareRef.current.x &&
						Math.floor((y - startY) / squareSize) ===
							hoveredSquareRef.current.y
					) {
						ctx.fillStyle = fillColor
						ctx.fillRect(squareX, squareY, squareSize, squareSize)
					}

					ctx.strokeStyle = strokeColor
					ctx.lineWidth = 0.5
					ctx.strokeRect(squareX, squareY, squareSize, squareSize)
				}
			}

			const gradient = ctx.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
			)

			gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')

			if (isDarkTheme()) {
				const bgPrimaryRgba = hexToRgba(bgPrimary, 0.6)
				gradient.addColorStop(1, bgPrimaryRgba)
			} else {
				gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)')
			}

			ctx.fillStyle = gradient
			ctx.fillRect(0, 0, canvas.width, canvas.height)
		}

		const updateAnimation = () => {
			const effectiveSpeed = Math.max(speed, 0.1)
			switch (direction) {
				case 'right':
					gridOffset.current.x =
						(gridOffset.current.x - effectiveSpeed + squareSize) %
						squareSize
					break
				case 'left':
					gridOffset.current.x =
						(gridOffset.current.x + effectiveSpeed + squareSize) %
						squareSize
					break
				case 'up':
					gridOffset.current.y =
						(gridOffset.current.y + effectiveSpeed + squareSize) %
						squareSize
					break
				case 'down':
					gridOffset.current.y =
						(gridOffset.current.y - effectiveSpeed + squareSize) %
						squareSize
					break
				case 'diagonal':
					gridOffset.current.x =
						(gridOffset.current.x - effectiveSpeed + squareSize) %
						squareSize
					gridOffset.current.y =
						(gridOffset.current.y - effectiveSpeed + squareSize) %
						squareSize
					break
				default:
					break
			}

			drawGrid()
			requestRef.current = requestAnimationFrame(updateAnimation)
		}

		const handleMouseMove = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			const mouseX = event.clientX - rect.left
			const mouseY = event.clientY - rect.top

			const startX =
				Math.floor(gridOffset.current.x / squareSize) * squareSize
			const startY =
				Math.floor(gridOffset.current.y / squareSize) * squareSize

			const hoveredSquareX = Math.floor(
				(mouseX + gridOffset.current.x - startX) / squareSize
			)
			const hoveredSquareY = Math.floor(
				(mouseY + gridOffset.current.y - startY) / squareSize
			)

			if (
				!hoveredSquareRef.current ||
				hoveredSquareRef.current.x !== hoveredSquareX ||
				hoveredSquareRef.current.y !== hoveredSquareY
			) {
				hoveredSquareRef.current = {
					x: hoveredSquareX,
					y: hoveredSquareY
				}
			}
		}

		const handleMouseLeave = () => {
			hoveredSquareRef.current = null
		}

		const themeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)'
		)
		const handleThemeChange = () => {
			drawGrid()
		}

		canvas.addEventListener('mousemove', handleMouseMove)
		canvas.addEventListener('mouseleave', handleMouseLeave)
		themeMediaQuery.addEventListener('change', handleThemeChange)
		requestRef.current = requestAnimationFrame(updateAnimation)

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			if (requestRef.current) cancelAnimationFrame(requestRef.current)
			canvas.removeEventListener('mousemove', handleMouseMove)
			canvas.removeEventListener('mouseleave', handleMouseLeave)
			themeMediaQuery.removeEventListener('change', handleThemeChange)
		}
	}, [direction, speed, borderColor, hoverFillColor, squareSize])

	return (
		<canvas
			ref={canvasRef}
			className={cn('squares-canvas', className)}
		></canvas>
	)
}
