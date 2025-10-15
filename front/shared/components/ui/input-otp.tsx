'use client'

import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'
import * as React from 'react'

function InputOTP({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string
}) {
	return (
		<OTPInput
			data-slot='input-otp'
			containerClassName={`input-otp-container ${containerClassName || ''}`}
			className={`input-otp ${className || ''}`}
			{...props}
		/>
	)
}

InputOTP.displayName = 'InputOTP'

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='input-otp-group'
			className={`input-otp-group ${className || ''}`}
			{...props}
		/>
	)
}

InputOTPGroup.displayName = 'InputOTPGroup'

function InputOTPSlot({
	index,
	className,
	...props
}: React.ComponentProps<'div'> & {
	index: number
}) {
	const inputOTPContext = React.useContext(OTPInputContext)
	const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
	return (
		<div
			data-slot='input-otp-slot'
			data-active={isActive}
			className={`input-otp-slot ${isActive ? 'active' : ''} ${className || ''}`}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='input-otp-slot__caret'>
					<div />
				</div>
			)}
		</div>
	)
}

InputOTPSlot.displayName = 'InputOTPSlot'

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
	return (
		<div data-slot='input-otp-separator' role='separator' {...props}>
			<MinusIcon />
		</div>
	)
}

InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
