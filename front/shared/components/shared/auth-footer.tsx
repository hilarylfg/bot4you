import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Props {
	type: 'login' | 'register'
}

export function AuthFooter({ type }: Props) {
	const t = useTranslations()

	return (
		<div className='auth-form__signup-link'>
			{t(`auth.cta.to${type === 'login' ? 'Signup' : 'Login'}`) + ' '}
			<Link href={`/auth/${type === 'login' ? 'register' : 'login'}`}>
				{t(`common.actions.${type === 'login' ? 'signup' : 'login'}`)}
			</Link>
		</div>
	)
}
