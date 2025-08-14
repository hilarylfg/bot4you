'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import * as React from 'react'

import { cn } from '@/shared/utils'

const ScrollArea = React.forwardRef<
	React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
		onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
	}
>(({ className, children, onScroll, ...props }, ref) => (
	<ScrollAreaPrimitive.Root
		ref={ref}
		data-slot='scroll-area'
		className={cn('scrollArea', className)}
		{...props}
	>
		<ScrollAreaPrimitive.Viewport
			data-slot='scroll-area-viewport'
			className='scrollAreaViewport'
			onScroll={onScroll}
		>
			{children}
		</ScrollAreaPrimitive.Viewport>
		<ScrollBar />
		<ScrollAreaPrimitive.Corner />
	</ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
	React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	React.ComponentPropsWithoutRef<
		typeof ScrollAreaPrimitive.ScrollAreaScrollbar
	>
>(({ className, orientation = 'vertical', ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
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
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
