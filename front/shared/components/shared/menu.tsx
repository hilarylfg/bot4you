'use client'

import { Bot, LogIn, LogOut, Settings, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Dialog,
	DialogContent,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	SettingsModalContent,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarProvider
} from '@/shared/components'
import { useLogoutMutation, useProfileInfo } from '@/shared/hooks'

interface MenuProps {
	children?: ReactNode
}

export function Menu({ children }: MenuProps) {
	const t = useTranslations()
	const [mounted, setMounted] = useState(false)
	const { user } = useProfileInfo()
	const { logout, isLoadingLogout } = useLogoutMutation()

	useEffect(() => {
		setMounted(true)
	}, [])

	const [isOpen, setIsOpen] = useState(false)

	return (
		<SidebarProvider defaultOpen={false}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='menu__dialog-content'>
					<DialogTitle>{t('settings.title')}</DialogTitle>
					<SettingsModalContent />
				</DialogContent>
			</Dialog>
			<Sidebar>
				<SidebarHeader>
					<div className='menu__header'>
						<h1 className='menu__title'>
							<Bot size={32} /> {t('app.name')}
						</h1>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup />
				</SidebarContent>
				<SidebarFooter>
					<div className='menu__footer'>
						{!mounted ? (
							<User size={24} />
						) : user ? (
							<DropdownMenu>
								<div className='menu__user-wrapper'>
									<DropdownMenuTrigger className='menu__user-trigger'>
										<Avatar>
											<AvatarImage
												src={user.picture}
												alt={user.displayName}
											/>
											<AvatarFallback
												fullName={user.displayName}
											/>
										</Avatar>
										<span className='menu__user'>
											{user.displayName}
										</span>
									</DropdownMenuTrigger>
								</div>
								<DropdownMenuContent className='menu__user-dropmenu'>
									<DropdownMenuItem
										onClick={() => setIsOpen(true)}
									>
										<Settings /> {t('settings.title')}
									</DropdownMenuItem>
									<DropdownMenuItem
										disabled={isLoadingLogout}
										onClick={() => logout()}
									>
										<LogOut />{' '}
										{t('auth.actions.logout')}{' '}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link className='menu__user' href='/auth/login'>
								<LogIn size={16} />{' '}
								{t('auth.actions.login')}{' '}
							</Link>
						)}
					</div>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	)
}
