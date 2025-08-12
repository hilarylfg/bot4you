import { useTranslations } from 'next-intl'

interface Props {
	type: 'login' | 'register'
}

export function AuthHeader({ type }: Props) {
	const t = useTranslations('auth')

	return (
		<div className='auth-form__header'>
			<h1 className='auth-form__title'>{t(`${type}.title`)}</h1>
			<p className='auth-form__description'>{t(`${type}.description`)}</p>
		</div>
	)
}
