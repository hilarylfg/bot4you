'use client'

import { Home, Monitor, Moon, Sun, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import Image from 'next/image'

import {
	Button,
	ProfileForm,
	Separator,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/shared/components'
import { usePathname, useRouter } from '@/shared/i18n/navigation'

export function SettingsModalContent() {
	const locale = useLocale()
	const t = useTranslations()
	const { theme, setTheme } = useTheme()
	const router = useRouter()
	const pathname = usePathname()

	const handleLanguageChange = (locale: string) => {
		router.replace(pathname, { locale })
	}

	return (
		<Tabs defaultValue='general' className='settings-modal'>
			<TabsList className='settings-modal__tabs-list'>
				<TabsTrigger value='general' className='settings-modal__tab'>
					<Home size={16} />
					{t('settings.tabs.general')}
				</TabsTrigger>
				<TabsTrigger value='profile' className='settings-modal__tab'>
					<User size={16} />
					{t('settings.tabs.profile')}
				</TabsTrigger>
			</TabsList>

			<TabsContent value='general' className='settings-modal__content'>
				<div className='settings-modal__section'>
					<h3 className='settings-modal__section-title'>
						{t('settings.general.theme.title')}
					</h3>
					<p className='settings-modal__section-description'>
						{t('settings.general.theme.description')}
					</p>
					<div className='settings-modal__theme-buttons'>
						<Button
							variant={theme === 'light' ? 'default' : 'outline'}
							size='sm'
							onClick={() => setTheme('light')}
							className='settings-modal__theme-button'
						>
							<Sun size={16} />
							{t('settings.general.theme.light')}
						</Button>
						<Button
							variant={theme === 'dark' ? 'default' : 'outline'}
							size='sm'
							onClick={() => setTheme('dark')}
							className='settings-modal__theme-button'
						>
							<Moon size={16} />
							{t('settings.general.theme.dark')}
						</Button>
						<Button
							variant={theme === 'system' ? 'default' : 'outline'}
							size='sm'
							onClick={() => setTheme('system')}
							className='settings-modal__theme-button'
						>
							<Monitor size={16} />
							{t('settings.general.theme.system')}
						</Button>
					</div>
				</div>

				<Separator className='settings-modal__separator' />

				<div className='settings-modal__section'>
					<h3 className='settings-modal__section-title'>
						{t('settings.general.language.title')}
					</h3>
					<p className='settings-modal__section-description'>
						{t('settings.general.language.description')}
					</p>
					<div className='settings-modal__language-buttons'>
						<Button
							variant={locale === 'ru' ? 'default' : 'outline'}
							size='sm'
							onClick={() => handleLanguageChange('ru')}
							className='settings-modal__language-button'
						>
							<Image
								src='/icons/ru.png'
								alt='Русский'
								width={20}
								height={20}
							/>
							Русский
						</Button>
						<Button
							variant={locale === 'en' ? 'default' : 'outline'}
							size='sm'
							onClick={() => handleLanguageChange('en')}
							className='settings-modal__language-button'
						>
							<Image
								src='/icons/us.png'
								alt='English'
								width={20}
								height={20}
							/>
							English
						</Button>
					</div>
				</div>
			</TabsContent>

			<TabsContent value='profile' className='settings-modal__content'>
				<ProfileForm />
			</TabsContent>
		</Tabs>
	)
}
