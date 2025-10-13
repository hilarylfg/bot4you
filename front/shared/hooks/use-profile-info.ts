import { useQuery } from '@tanstack/react-query'

import { userService } from '@/shared/services'

export function useProfileInfo() {
	const { data: user, isLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: () => userService.findProfile()
	})

	return {
		user,
		isLoading
	}
}
