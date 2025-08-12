import { Bot } from 'lucide-react'

export function LogoLoaderShell() {
	return (
		<>
			<div
				id='logo-loader'
				className='logo-loader__wrapper'
				aria-hidden='true'
			>
				<Bot className='logo-loader__logo' />
			</div>
		</>
	)
}
