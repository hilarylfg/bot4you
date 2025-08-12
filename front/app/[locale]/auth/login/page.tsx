import type { Metadata } from 'next'

import { LoginForm } from '@/shared/components'

export const metadata: Metadata = {
	title: 'Войти в аккаунт'
}

export default function LoginPage() {
	return <LoginForm />
}
