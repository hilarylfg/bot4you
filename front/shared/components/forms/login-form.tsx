'use client'

import { Bot } from 'lucide-react'
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
	return (
		<div className={cn('login-form', className)} {...props}>
			<Card className='login-form__card'>
				<CardContent className='login-form__content'>
					<form className='login-form__form'>
						<div className='login-form__form-inner'>
							<div className='login-form__header'>
								<h1 className='login-form__title'>
									Welcome back
								</h1>
								<p className='login-form__description'>
									Login to your account
								</p>
							</div>
							<div className='login-form__field'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									placeholder='m@example.com'
									required
								/>
							</div>
							<div className='login-form__field'>
								<div className='login-form__password-header'>
									<Label htmlFor='password'>Password</Label>
									<a
										href='#'
										className='login-form__forgot-link'
									>
										Forgot your password?
									</a>
								</div>
								<Input id='password' type='password' required />
							</div>
							<Button
								type='submit'
								className='button--full-width'
							>
								Login
							</Button>
							<div className='login-form__divider'>
								<span className='login-form__divider-text'>
									Or continue with
								</span>
							</div>
							<div className='login-form__social-buttons'>
								<Button
									variant='outline'
									type='button'
									className='button--full-width'
								>
									<FaGithub />
									<span className='sr-only'>
										Login with GitHub
									</span>
								</Button>
								<Button
									variant='outline'
									type='button'
									className='button--full-width'
								>
									<FaGoogle />
									<span className='sr-only'>
										Login with Google
									</span>
								</Button>
								<Button
									variant='outline'
									type='button'
									className='button--full-width'
								>
									<FaYandex />
									<span className='sr-only'>
										Login with Yandex
									</span>
								</Button>
							</div>
							<div className='login-form__signup-link'>
								Don&apos;t have an account?{' '}
								<a href='#'>Sign up</a>
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
				By clicking continue, you agree to our{' '}
				<a href='#'>Terms of Service</a> and{' '}
				<a href='#'>Privacy Policy</a>.
			</div>
		</div>
	)
}
