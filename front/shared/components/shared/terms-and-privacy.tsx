import { useTranslations } from 'next-intl'

export function TermsAndPrivacy() {
	const t = useTranslations()

	return (
		<div className='auth-form__terms-privacy'>
			{t('auth.shared.youAgree') + ' '}
			<a href=''>{t('auth.shared.termsOfService')}</a>
			{' ' + t('common.labels.and').toLowerCase() + ' '}
			<a href=''>{t('auth.shared.privacyPolicy')}</a>
		</div>
	)
}
