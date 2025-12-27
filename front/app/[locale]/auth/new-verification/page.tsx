import type { Metadata } from 'next'

import { NewVerificationForm } from '@/shared/components'

export const metadata: Metadata = {
	title: 'Подтверждение почты'
}

export default function NewVerificationPage() {
	return <NewVerificationForm />
}
