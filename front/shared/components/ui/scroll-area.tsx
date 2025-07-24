'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import * as React from 'react'

import { cn } from '@/shared/utils'

export function ScrollArea({
	className,
	children,
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
	return (
		<ScrollAreaPrimitive.Root
			data-slot='scroll-area'
			className={cn('scrollArea', className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				data-slot='scroll-area-viewport'
				className='scrollAreaViewport'
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	)
}

export function ScrollBar({
	className,
	orientation = 'vertical',
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot='scroll-area-scrollbar'
			orientation={orientation}
			className={cn(
				'scrollBar',
				orientation === 'vertical' && 'scrollBarVertical',
				orientation === 'horizontal' && 'scrollBarHorizontal',
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot='scroll-area-thumb'
				className='scrollBarThumb'
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	)
}
