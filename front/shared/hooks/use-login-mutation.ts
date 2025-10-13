import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

import { TypeLoginSchema } from '@/shared/schemas'
import { authService } from '@/shared/services'
import { toastMessageHandler } from '@/shared/utils'

export function useLoginMutation(
	setIsShowFactor: Dispatch<SetStateAction<boolean>>
) {
	const router = useRouter()

	const { mutate: login, isPending: isLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({ values }: { values: TypeLoginSchema }) =>
			authService.login(values),
		onSuccess(data: any) {
			if (data.message) {
				toastMessageHandler(data)
				setIsShowFactor(true)
			} else {
				toast.success('Успешная авторизация')
				router.push('/')
			}
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { login, isLoadingLogin }
}
