import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'

import { TypeLoginSchema } from '@/shared/schemas'
import { authService } from '@/shared/services'
import { toastMessageHandler } from '@/shared/utils'

export function useLoginMutation(
	setIsShowFactor: Dispatch<SetStateAction<boolean>>
) {
	const router = useRouter()

	const [isOtpSuccess, setIsOtpSuccess] = useState(false)

	const {
		mutate: login,
		isPending: isLoadingLogin,
		isError
	} = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({ values }: { values: TypeLoginSchema }) => {
			if (values.code) {
				setIsOtpSuccess(false)
			}
			return authService.login(values)
		},
		onSuccess(data: any, variables) {
			if (data.message) {
				toastMessageHandler(data)
				setIsShowFactor(true)
			} else {
				if (variables.values.code) {
					setIsOtpSuccess(true)
				}
				toast.success('Успешная авторизация')
				router.push('/')
			}
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { login, isLoadingLogin, isError, isOtpSuccess }
}
