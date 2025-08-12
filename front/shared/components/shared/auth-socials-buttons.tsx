import { useTranslations } from 'next-intl'
import { FaGithub, FaGoogle, FaYandex } from 'react-icons/fa'

import { Button } from '@/shared/components'

interface Props {
	type: 'login' | 'register'
}

export function AuthSocialButtons({ type }: Props) {
	const t = useTranslations('auth')
	const actionText = type === 'login' ? 'Login' : 'Sign up'

	return (
		<>
			<div className='auth-form__divider'>
				<span className='auth-form__divider-text'>
					{t('shared.orContinue')}
				</span>
			</div>
			<div className='auth-form__social-buttons'>
				<Button variant='outline' type='button'>
					<FaGithub />
					<span className='sr-only'>{actionText} with GitHub</span>
				</Button>
				<Button variant='outline' type='button'>
					<FaGoogle />
					<span className='sr-only'>{actionText} with Google</span>
				</Button>
				<Button variant='outline' type='button'>
					<FaYandex />
					<span className='sr-only'>{actionText} with Yandex</span>
				</Button>
			</div>
		</>
	)
}
