'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import * as React from 'react'

import '@/shared/styles/ui/_switch.scss'
import { cn } from '@/shared/utils'

export function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	const [checked, setChecked] = React.useState(
		props.checked ?? props.defaultChecked ?? false
	)

	React.useEffect(() => {
		if (props.checked !== undefined) {
			setChecked(props.checked)
		}
	}, [props.checked])

	const handleCheckedChange = (value: boolean) => {
		setChecked(value)
		props.onCheckedChange?.(value)
	}

	return (
		<SwitchPrimitive.Root
			data-slot='switch'
			className={cn(
				'switch-root',
				checked ? 'switch-checked' : 'switch-unchecked',
				props.disabled && 'switch-disabled',
				className
			)}
			checked={checked}
			onCheckedChange={handleCheckedChange}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot='switch-thumb'
				className='switch-thumb'
			/>
		</SwitchPrimitive.Root>
	)
}
