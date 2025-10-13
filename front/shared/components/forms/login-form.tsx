'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
	AuthFooter,
	AuthHeader,
	AuthSocialButtons,
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/shared/components'
import { useLoginMutation } from '@/shared/hooks'
import { LoginSchema, TypeLoginSchema } from '@/shared/schemas'

export function LoginForm() {
	const t = useTranslations()
	const [isShowTwoFactor, setIsShowFactor] = useState(false)

	const form = useForm<TypeLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const { login, isLoadingLogin } = useLoginMutation(setIsShowFactor)

	const onSubmit = (values: TypeLoginSchema) => {
		login({ values })
	}

	return (
		<Form {...form}>
			<AuthHeader type='login' />
			{isShowTwoFactor && (
				<FormField
					control={form.control}
					name='code'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Код</FormLabel>
							<FormControl>
								<Input
									placeholder='123456'
									disabled={isLoadingLogin}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}
			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem className='auth-form__field'>
						<FormLabel>{t('auth.fields.email')}</FormLabel>
						<FormControl>
							<Input
								placeholder='example@bot4you.com'
								disabled={isLoadingLogin}
								type='email'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='password'
				render={({ field }) => (
					<FormItem className='auth-form__field'>
						<div className='auth-form__password-header'>
							<FormLabel>{t('auth.fields.password')}</FormLabel>
							<Link
								href='/auth/forgot-password'
								className='auth-form__forgot-link'
							>
								{t('auth.login.forgotPassword')}
							</Link>
						</div>
						<FormControl>
							<Input
								placeholder='********'
								disabled={isLoadingLogin}
								type='password'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Button
				type='submit'
				disabled={isLoadingLogin}
				onClick={form.handleSubmit(onSubmit)}
			>
				{t('common.actions.login')}
			</Button>

			<AuthSocialButtons type='login' />
			<AuthFooter type='login' />
		</Form>
	)
}
