'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
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
import { useRegisterMutation } from '@/shared/hooks'
import { RegisterSchema, TypeRegisterSchema } from '@/shared/schemas'

export function RegisterForm() {
	const t = useTranslations()

	const form = useForm<TypeRegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const { register, isLoadingRegister } = useRegisterMutation()

	const onSubmit = (values: TypeRegisterSchema) => {
		register({ values })
	}

	return (
		<Form {...form}>
			<AuthHeader type='register' />

			<FormField
				control={form.control}
				name='name'
				render={({ field }) => (
					<FormItem className='auth-form__field'>
						<FormLabel>{t('auth.fields.name')}</FormLabel>
						<FormControl>
							<Input
								placeholder='Nikolay'
								disabled={isLoadingRegister}
								type='text'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name='email'
				render={({ field }) => (
					<FormItem className='auth-form__field'>
						<FormLabel>{t('auth.fields.email')}</FormLabel>
						<FormControl>
							<Input
								placeholder='example@bot4you.com'
								disabled={isLoadingRegister}
								type='email'
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className='auth-form__row'>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem className='auth-form__field'>
							<FormLabel>{t('auth.fields.password')}</FormLabel>
							<FormControl>
								<Input
									placeholder='********'
									disabled={isLoadingRegister}
									type='password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='passwordRepeat'
					render={({ field }) => (
						<FormItem className='auth-form__field'>
							<FormLabel>
								{t('auth.fields.passwordRepeat')}
							</FormLabel>
							<FormControl>
								<Input
									placeholder='********'
									disabled={isLoadingRegister}
									type='password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<Button
				type='submit'
				className='button--full-width'
				disabled={isLoadingRegister}
				onClick={form.handleSubmit(onSubmit)}
			>
				{t('common.actions.signup')}
			</Button>

			<AuthSocialButtons type='register' />
			<AuthFooter type='register' />
		</Form>
	)
}
