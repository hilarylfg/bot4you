import { useMutation } from '@tanstack/react-query'

import { TypeRegisterSchema } from '@/shared/schemas'
import { authService } from '@/shared/services'
import { toastMessageHandler } from '@/shared/utils'

export function useRegisterMutation() {
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({ values }: { values: TypeRegisterSchema }) =>
			authService.register(values),
		onSuccess(data: any) {
			toastMessageHandler(data)
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { register, isLoadingRegister }
}
