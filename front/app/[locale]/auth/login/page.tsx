import type { Metadata } from 'next'

import { LoginForm } from '@/shared/components'

export const metadata: Metadata = {
	title: 'Войти в аккаунт'
}

export default function LoginPage() {
	return (
		<div className='auth-page'>
			<div className='auth-page__container'>
				<LoginForm />
			</div>
		</div>
	)
}
