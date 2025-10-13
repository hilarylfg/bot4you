import { TypeLoginSchema, TypeRegisterSchema } from '@/shared/schemas'
import { IUser } from '@/shared/types'
import { api } from '@/shared/utils'

class AuthService {
	public async register(body: TypeRegisterSchema) {
		const response = await api.post<IUser>('auth/register', body)

		return response
	}

	public async login(body: TypeLoginSchema) {
		const response = await api.post<IUser>('auth/login', body)

		return response
	}

	public async oauthByProvider(provider: 'google' | 'yandex' | 'github') {
		const response = await api.get<{ url: string }>(
			`auth/oauth/connect/${provider}`
		)

		return response
	}

	public async logout() {
		const response = await api.post('auth/logout')

		return response
	}
}

export const authService = new AuthService()
