import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

type ButtonVariant =
	| 'default'
	| 'destructive'
	| 'secondary'
	| 'ghost'
	| 'link'
	| 'outline'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	size?: ButtonSize
	asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className = '',
			variant = 'default',
			size = 'default',
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button'

		const buttonClasses = [
			className,
			'button',
			`button--${variant}`,
			`button--${size}`
		]
			.filter(Boolean)
			.join(' ')

		return <Comp className={buttonClasses} ref={ref} {...props} />
	}
)

Button.displayName = 'Button'
