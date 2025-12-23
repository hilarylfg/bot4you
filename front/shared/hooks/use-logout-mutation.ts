import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { authService } from '@/shared/services'
import { toastMessageHandler } from '@/shared/utils'

export function useLogoutMutation() {
	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess() {
			toast.success('Вы успешно вышли из системы')
			window.location.reload()
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { logout, isLoadingLogout }
}
