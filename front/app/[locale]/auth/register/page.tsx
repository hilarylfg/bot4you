import type { Metadata } from 'next'

import { RegisterForm } from '@/shared/components'

export const metadata: Metadata = {
	title: 'Создать аккаунт'
}

export default function RegisterPage() {
	return <RegisterForm />
}
