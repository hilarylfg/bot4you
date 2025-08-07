'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import * as React from 'react'

import { cn } from '@/shared/utils'

function Label({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot='label'
			className={cn('label', className)}
			{...props}
		/>
	)
}

export { Label }
