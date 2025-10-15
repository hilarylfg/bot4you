'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
	AuthFooter,
	AuthHeader,
	AuthSocialButtons,
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
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
			password: '',
			code: ''
		}
	})

	const { login, isLoadingLogin, isError, isOtpSuccess } =
		useLoginMutation(setIsShowFactor)

	const otpValue = form.watch('code')

	useEffect(() => {
		if (otpValue && otpValue.length === 6 && isShowTwoFactor) {
			const formValues = form.getValues()
			onSubmit(formValues)
		}
	}, [otpValue, isShowTwoFactor])

	const onSubmit = (values: TypeLoginSchema) => {
		login({ values })
	}

	const getSlotClass = () => {
		if (isLoadingLogin) return 'loading'
		if (isError) return 'error'
		if (isOtpSuccess && !isLoadingLogin && !isError) return 'success'
		return ''
	}

	return (
		<Form {...form}>
			<AuthHeader type='login' />
			<Dialog open={isShowTwoFactor}>
				<DialogContent
					className='auth-form__dialog-content'
					showCloseButton={false}
				>
					<DialogHeader>
						<DialogTitle>
							Код двухфакторной аутентификации
						</DialogTitle>
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<InputOTP
											className='auth-form__input-code'
											maxLength={6}
											disabled={isLoadingLogin}
											{...field}
										>
											<InputOTPGroup>
												{[0, 1, 2, 3, 4, 5].map(
													index => (
														<InputOTPSlot
															key={index}
															index={index}
															className={getSlotClass()}
														/>
													)
												)}
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</DialogHeader>
				</DialogContent>
			</Dialog>
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
