'use client'

import { ChevronDownIcon, GlobeIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components'
import languagesConfig from '@/shared/i18n/language.json'
import { cn } from '@/shared/utils'

interface FlagIconProps {
	countryCode: string
	className?: string
}

function FlagEmoji({ countryCode, className = '' }: FlagIconProps) {
	const flagUrls: Record<string, string> = {
		us: 'https://flagcdn.com/w20/us.png', // 🇺🇸 США
		ru: 'https://flagcdn.com/w20/ru.png' // 🇷🇺 Россия
	}

	const flagUrl = flagUrls[countryCode.toLowerCase()]

	if (!flagUrl) {
		return (
			<span
				className={cn('flag-icon', className)}
				style={{ fontSize: '16px' }}
			>
				🏳️
			</span>
		)
	}

	return (
		<img
			src={flagUrl}
			alt={`${countryCode} flag`}
			className={cn('flag-icon', className)}
			width={20}
			height={15}
		/>
	)
}

interface Language {
	locale: string
	countryCode: string
	translationKey: 'en' | 'ru'
}

export function LanguageSwitch() {
	const t = useTranslations('common.languages') // используем 'language', а не 'languages'
	const router = useRouter()
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	const currentLocale = pathname.split('/')[1]
	const currentLanguage = (languagesConfig.languages as Language[]).find(
		lang => lang.locale === currentLocale
	)

	const switchLanguage = (locale: string) => {
		const currentPath = pathname.split('/').slice(2).join('/')
		router.push(`/${locale}/${currentPath}`)
		setIsOpen(false)
	}

	return (
		<div className='language-switch'>
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<button className='language-switch__trigger'>
						{currentLanguage ? (
							<FlagEmoji
								countryCode={currentLanguage.countryCode}
							/>
						) : (
							<GlobeIcon className='language-switch__globe-icon' />
						)}
						<span className='language-switch__current-text'>
							{currentLanguage
								? t(currentLanguage.translationKey)
								: 'Select Language'}{' '}
						</span>
						<ChevronDownIcon className='language-switch__chevron' />
					</button>
				</PopoverTrigger>
				<PopoverContent
					className='language-switch__content'
					align='end'
				>
					<div className='language-switch__header'>
						<h3 className='language-switch__title'>
							{t('switch')}
						</h3>
					</div>
					<div className='language-switch__list'>
						{(languagesConfig.languages as Language[]).map(
							({ locale, countryCode, translationKey }) => (
								<button
									key={locale}
									onClick={() => switchLanguage(locale)}
									className={`language-switch__item ${
										currentLocale === locale
											? 'language-switch__item--active'
											: ''
									}`}
									title={t(translationKey)}
								>
									<FlagEmoji countryCode={countryCode} />
									<span className='language-switch__item-text'>
										{t(translationKey)}
									</span>
									{currentLocale === locale && (
										<div className='language-switch__check'>
											✓
										</div>
									)}
								</button>
							)
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
