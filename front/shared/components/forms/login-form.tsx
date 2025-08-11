'use client'

import { Bot } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ComponentProps } from 'react'
import { FaGithub, FaGoogle, FaYandex } from 'react-icons/fa'

import {
	Button,
	Card,
	CardContent,
	Input,
	Label,
	Squares
} from '@/shared/components'
import { cn } from '@/shared/utils'

export function LoginForm({ className, ...props }: ComponentProps<'div'>) {
	const t = useTranslations('authForm')

	return (
		<div className={cn('login-form', className)} {...props}>
			<Card className='login-form__card'>
				<CardContent className='login-form__content'>
					<form className='login-form__form'>
						<div className='login-form__form-inner'>
							<div className='login-form__header'>
								<h1 className='login-form__title'>
									{t('login.welcome')}
								</h1>
								<p className='login-form__description'>
									{t('login.desc')}
								</p>
							</div>
							<div className='login-form__field'>
								<Label htmlFor='email'>{t('email')}</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
								/>
							</div>
							<div className='login-form__field'>
								<div className='login-form__password-header'>
									<Label htmlFor='password'>
										{t('password')}
									</Label>
									<a
										href='#'
										className='login-form__forgot-link'
									>
										{t('login.forgotPass')}
									</a>
								</div>
								<Input id='password' type='password' required />
							</div>
							<Button
								type='submit'
								className='button--full-width'
							>
								{t('login.submit')}
							</Button>
							<div className='login-form__divider'>
								<span className='login-form__divider-text'>
									{t('orContinue')}
								</span>
							</div>
							<div className='login-form__social-buttons'>
								<Button variant='outline' type='button'>
									<FaGithub />
									<span className='sr-only'>
										Login with GitHub
									</span>
								</Button>
								<Button variant='outline' type='button'>
									<FaGoogle />
									<span className='sr-only'>
										Login with Google
									</span>
								</Button>
								<Button variant='outline' type='button'>
									<FaYandex />
									<span className='sr-only'>
										Login with Yandex
									</span>
								</Button>
							</div>
							<div className='login-form__signup-link'>
								{t('login.dontHaveAccount') + ' '}
								<a href='#'>{t('login.signup')}</a>
							</div>
						</div>
					</form>
					<div className='login-form__fun-section'>
						<Bot
							className='login-form__fun-section__logo'
							size={280}
						/>
						<Squares
							speed={0.5}
							squareSize={40}
							direction='diagonal'
							className='login-form__fun-section__squares'
						/>
					</div>
				</CardContent>
			</Card>
			<div className='login-form__footer'>
				{t('youAgree')}
				{/*By clicking continue, you agree to our{' '}*/}
				{/*<a href='#'>Terms of Service</a> and{' '}*/}
				{/*<a href='#'>Privacy Policy</a>.*/}
			</div>
		</div>
	)
}
