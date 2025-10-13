'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'sonner'

import { ThemeSwitch } from '@/shared/components'

export function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false
					}
				}
			})
	)

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<ThemeSwitch />
					{children}
					<Toaster position='top-center' />
				</ThemeProvider>
			</QueryClientProvider>
		</>
	)
}
