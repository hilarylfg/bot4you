'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { Spinner } from '@/shared/components'
import { useVerificationMutation } from '@/shared/hooks'

export function NewVerificationForm() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const { verification } = useVerificationMutation()

	useEffect(() => {
		verification(token)
	}, [token])

	return (
		<div className='auth-form__spinner--wrapper'>
			<h2>Подтверждение почты...</h2>
			<Spinner />
		</div>
	)
}
