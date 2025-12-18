'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FaGithub, FaGoogle, FaYandex } from 'react-icons/fa'

import { Button } from '@/shared/components'
import { useInDev } from '@/shared/hooks'
import { authService } from '@/shared/services'

interface Props {
	type: 'login' | 'register'
}

export function AuthSocialButtons({ type }: Props) {
	const t = useTranslations('auth')
	const actionText = type === 'login' ? 'Login' : 'Sign up'

	const router = useRouter()

	const { mutateAsync } = useMutation({
		mutationKey: ['oauth by provider'],
		mutationFn: async (provider: 'google' | 'yandex' | 'github') =>
			await authService.oauthByProvider(provider)
	})

	const onClick = async (provider: 'google' | 'yandex' | 'github') => {
		const response = await mutateAsync(provider)

		if (response) {
			router.push(response.url)
		}
	}

	return (
		<>
			<div className='auth-form__divider'>
				<span className='auth-form__divider-text'>
					{t('shared.orContinue')}
				</span>
			</div>
			<div className='auth-form__social-buttons'>
				<Button variant='outline' type='button' onClick={useInDev}>
					<FaGithub />
					<span className='sr-only'>{actionText} with GitHub</span>
				</Button>
				<Button
					variant='outline'
					type='button'
					onClick={() => onClick('google')}
				>
					<FaGoogle />
					<span className='sr-only'>{actionText} with Google</span>
				</Button>
				<Button
					variant='outline'
					type='button'
					onClick={() => onClick('yandex')}
				>
					<FaYandex />
					<span className='sr-only'>{actionText} with Yandex</span>
				</Button>
			</div>
		</>
	)
}
