'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Spinner,
	Switch
} from '@/shared/components'
import { useProfileInfo, useUpdateProfileMutation } from '@/shared/hooks'
import { SettingsSchema, TypeSettingsSchema } from '@/shared/schemas'

export function ProfileForm() {
	const t = useTranslations('settings.profile')
	const { user, isLoading } = useProfileInfo()

	const form = useForm<TypeSettingsSchema>({
		resolver: zodResolver(SettingsSchema),
		values: {
			name: user?.displayName || '',
			email: user?.email || '',
			isTwoFactorEnabled: user?.isTwoFactorEnabled || false
		}
	})

	const { update, isLoadingUpdate } = useUpdateProfileMutation()

	const onSubmit = (values: TypeSettingsSchema) => {
		update(values)
	}

	if (!user) return null

	return (
		<div className='profile-form'>
			{isLoading ? (
				<div className='profile-form__spinner'>
					<Spinner />
				</div>
			) : (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='profile-form__form'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='profile-form__label'>
										{t('fields.name')}
									</FormLabel>
									<FormControl>
										<Input
											disabled={isLoadingUpdate}
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
								<FormItem>
									<FormLabel className='profile-form__label'>
										{t('fields.email')}
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												isLoadingUpdate ||
												user.method !== 'CREDENTIALS'
											}
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
							name='isTwoFactorEnabled'
							render={({ field }) => (
								<FormItem className='profile-form__item--row'>
									<div className='profile-form__meta'>
										<FormLabel className='profile-form__label'>
											{t('fields.twoFactor')}
										</FormLabel>
										<FormDescription className='profile-form__description'>
											{t('fields.twoFactorDescription')}
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type='submit' disabled={isLoadingUpdate}>
							{t('actions.save')}
						</Button>
					</form>
				</Form>
			)}
		</div>
	)
}
