'use client'

import { useTranslations } from 'next-intl'

import {
	AuthFooter,
	AuthHeader,
	AuthSocialButtons,
	Button,
	Input,
	Label
} from '@/shared/components'

export function RegisterForm() {
	const t = useTranslations()

	return (
		<>
			<AuthHeader type='register' />

			<div className='auth-form__field'>
				<Label htmlFor='email'>{t('auth.fields.email')}</Label>
				<Input
					id='email'
					type='email'
					placeholder='m@example.com'
					required
				/>
			</div>

			<div className='auth-form__field'>
				<Label htmlFor='password'>{t('auth.fields.password')}</Label>
				<Input id='password' type='password' required />
			</div>

			<div className='auth-form__field'>
				<Label htmlFor='confirmPassword'>
					{t('auth.fields.repeatPassword')}
				</Label>
				<Input id='confirmPassword' type='password' required />
			</div>

			<Button type='submit' className='button--full-width'>
				{t('common.actions.signup')}
			</Button>

			<AuthSocialButtons type='register' />
			<AuthFooter type='register' />
		</>
	)
}
