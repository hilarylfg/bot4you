import { Loader2Icon } from 'lucide-react'
import { ComponentProps } from 'react'

import { cn } from '@/shared/utils'

export function Spinner({ className, ...props }: ComponentProps<'svg'>) {
	return (
		<Loader2Icon
			size={32}
			role='status'
			aria-label='Loading'
			className={cn('spinner-ui', className)}
			{...props}
		/>
	)
}
