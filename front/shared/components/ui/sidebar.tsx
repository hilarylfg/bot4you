'use client'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-react'
import * as React from 'react'

import {
	Button,
	Input,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	Skeleton,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/shared/components'
import { useDevice } from '@/shared/hooks'
import { cn } from '@/shared/utils'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
	state: 'expanded' | 'collapsed'
	open: boolean
	setOpen: (open: boolean) => void
	openMobile: boolean
	setOpenMobile: (open: boolean) => void
	isMobile: boolean
	toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
	const context = React.useContext(SidebarContext)
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider.')
	}
	return context
}

function SidebarProvider({
	defaultOpen = true,
	open: openProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	...props
}: React.ComponentProps<'div'> & {
	defaultOpen?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
}) {
	const { isLaptopOrSmaller } = useDevice()
	const [openMobile, setOpenMobile] = React.useState(false)

	const [_open, _setOpen] = React.useState(defaultOpen)
	const open = openProp ?? _open
	const setOpen = React.useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === 'function' ? value(open) : value
			if (setOpenProp) {
				setOpenProp(openState)
			} else {
				_setOpen(openState)
			}
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
		},
		[setOpenProp, open]
	)

	const toggleSidebar = React.useCallback(() => {
		return isLaptopOrSmaller
			? setOpenMobile(open => !open)
			: setOpen(open => !open)
	}, [isLaptopOrSmaller, setOpen, setOpenMobile])

	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
				(event.metaKey || event.ctrlKey)
			) {
				event.preventDefault()
				toggleSidebar()
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [toggleSidebar])

	const state = open ? 'expanded' : 'collapsed'

	// expose `isMobile` in context for backward compatibility but treat laptop-or-smaller as mobile-like
	const isMobileForContext = isLaptopOrSmaller

	const contextValue = React.useMemo<SidebarContextProps>(
		() => ({
			state,
			open,
			setOpen,
			isMobile: isMobileForContext,
			openMobile,
			setOpenMobile,
			toggleSidebar
		}),
		[
			state,
			open,
			setOpen,
			isMobileForContext,
			openMobile,
			setOpenMobile,
			toggleSidebar
		]
	)

	return (
		<SidebarContext.Provider value={contextValue}>
			<TooltipProvider delayDuration={0}>
				<div
					className={cn('sidebar-wrapper', className)}
					style={
						{
							'--sidebar-width': SIDEBAR_WIDTH,
							'--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
							...style
						} as React.CSSProperties
					}
					{...props}
				>
					{children}
				</div>
			</TooltipProvider>
		</SidebarContext.Provider>
	)
}

function Sidebar({
	side = 'left',
	variant = 'sidebar',
	collapsible = 'offcanvas',
	className,
	children,
	...props
}: React.ComponentProps<'div'> & {
	side?: 'left' | 'right'
	variant?: 'sidebar' | 'floating' | 'inset'
	collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
	const { state, openMobile, setOpenMobile } = useSidebar()
	const { isLaptopOrSmaller: isLaptopOrSmallerNow } = useDevice()

	if (collapsible === 'none') {
		return (
			<div
				className={cn('sidebar sidebar--no-collapsible', className)}
				{...props}
			>
				{children}
			</div>
		)
	}

	if (collapsible === 'offcanvas' && isLaptopOrSmallerNow) {
		return (
			<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<SheetContent
					className='sidebar sidebar--mobile'
					style={
						{
							'--sidebar-width': SIDEBAR_WIDTH_MOBILE
						} as React.CSSProperties
					}
					side={side}
				>
					<SheetHeader className='sr-only'>
						<SheetTitle>Sidebar</SheetTitle>
						<SheetDescription>
							Displays the mobile sidebar.
						</SheetDescription>
					</SheetHeader>
					<div className='sidebar__inner-container'>{children}</div>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<div
			className={cn(
				'sidebar-peer',
				`sidebar-peer--state-${state}`,
				`sidebar-peer--collapsible-${state === 'collapsed' ? collapsible : ''}`,
				`sidebar-peer--variant-${variant}`,
				`sidebar-peer--side-${side}`
			)}
		>
			<div className='sidebar-gap' />
			<div className={cn('sidebar', className)} {...props}>
				<div className='sidebar__inner'>{children}</div>
			</div>
		</div>
	)
}

function SidebarTrigger({
	className,
	onClick,
	...props
}: React.ComponentProps<typeof Button>) {
	const { toggleSidebar } = useSidebar()

	return (
		<Button
			variant='ghost'
			size='icon'
			className={cn('sidebar-trigger', className)}
			onClick={event => {
				onClick?.(event)
				toggleSidebar()
			}}
			{...props}
		>
			<PanelLeftIcon />
			<span className='sr-only'>Toggle Sidebar</span>
		</Button>
	)
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
	const { toggleSidebar } = useSidebar()

	return (
		<button
			aria-label='Toggle Sidebar'
			tabIndex={-1}
			onClick={toggleSidebar}
			title='Toggle Sidebar'
			className={cn('sidebar-rail', className)}
			{...props}
		/>
	)
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
	return <main className={cn('sidebar-inset', className)} {...props} />
}

function SidebarInput({
	className,
	...props
}: React.ComponentProps<typeof Input>) {
	return <Input className={cn('sidebar-input', className)} {...props} />
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('sidebar-header', className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('sidebar-footer', className)} {...props} />
}

function SidebarSeparator({
	className,
	...props
}: React.ComponentProps<typeof Separator>) {
	return (
		<Separator className={cn('sidebar-separator', className)} {...props} />
	)
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('sidebar-content', className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('sidebar-group', className)} {...props} />
}

function SidebarGroupLabel({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'div'
	return <Comp className={cn('sidebar-group__label', className)} {...props} />
}

function SidebarGroupAction({
	className,
	asChild = false,
	...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'button'
	return (
		<Comp className={cn('sidebar-group__action', className)} {...props} />
	)
}

function SidebarGroupContent({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('sidebar-group__content', className)} {...props} />
	)
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
	return <ul className={cn('sidebar-menu', className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
	return <li className={cn('sidebar-menu__item', className)} {...props} />
}

const sidebarMenuButtonVariants = cva('sidebar-menu__button', {
	variants: {
		variant: {
			default: '',
			outline: 'sidebar-menu__button--outline'
		},
		size: {
			default: 'sidebar-menu__button--size-default',
			sm: 'sidebar-menu__button--size-sm',
			lg: 'sidebar-menu__button--size-lg'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
})

function SidebarMenuButton({
	asChild = false,
	isActive = false,
	variant,
	size,
	tooltip,
	className,
	...props
}: React.ComponentProps<'button'> & {
	asChild?: boolean
	isActive?: boolean
	tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
	const Comp = asChild ? Slot : 'button'
	const { isMobile, state } = useSidebar()

	const button = (
		<Comp
			className={cn(
				sidebarMenuButtonVariants({ variant, size }),
				isActive && 'sidebar-menu__button--active',
				className
			)}
			{...props}
		/>
	)

	if (!tooltip) {
		return button
	}

	if (typeof tooltip === 'string') {
		tooltip = {
			children: tooltip
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent
				side='right'
				align='center'
				hidden={state !== 'collapsed' || isMobile}
				{...tooltip}
			/>
		</Tooltip>
	)
}

function SidebarMenuAction({
	className,
	asChild = false,
	showOnHover = false,
	...props
}: React.ComponentProps<'button'> & {
	asChild?: boolean
	showOnHover?: boolean
}) {
	const Comp = asChild ? Slot : 'button'
	return (
		<Comp
			className={cn(
				'sidebar-menu__action',
				showOnHover && 'sidebar-menu__action--show-on-hover',
				className
			)}
			{...props}
		/>
	)
}

function SidebarMenuBadge({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return <div className={cn('sidebar-menu__badge', className)} {...props} />
}

function SidebarMenuSkeleton({
	className,
	showIcon = false,
	...props
}: React.ComponentProps<'div'> & {
	showIcon?: boolean
}) {
	const width = React.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`
	}, [])

	return (
		<div className={cn('sidebar-menu__skeleton', className)} {...props}>
			{showIcon && <Skeleton className='sidebar-menu__skeleton-icon' />}
			<Skeleton
				className='sidebar-menu__skeleton-text'
				style={
					{
						'--skeleton-width': width
					} as React.CSSProperties
				}
			/>
		</div>
	)
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
	return <ul className={cn('sidebar-menu-sub', className)} {...props} />
}

function SidebarMenuSubItem({
	className,
	...props
}: React.ComponentProps<'li'>) {
	return <li className={cn('sidebar-menu-sub__item', className)} {...props} />
}

function SidebarMenuSubButton({
	asChild = false,
	size = 'md',
	isActive = false,
	className,
	...props
}: React.ComponentProps<'a'> & {
	asChild?: boolean
	size?: 'sm' | 'md'
	isActive?: boolean
}) {
	const Comp = asChild ? Slot : 'a'
	return (
		<Comp
			className={cn(
				'sidebar-menu-sub__button',
				`sidebar-menu-sub__button--size-${size}`,
				isActive && 'sidebar-menu-sub__button--active',
				className
			)}
			{...props}
		/>
	)
}

export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarInset,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar
}
