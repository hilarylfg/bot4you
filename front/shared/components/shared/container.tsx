import { PropsWithChildren } from 'react'

import { cn } from '@/shared/utils'

interface Props {
	className?: string
}

export function Container({ className, children }: PropsWithChildren<Props>) {
	return <div className={cn('container', className)}>{children}</div>
}
