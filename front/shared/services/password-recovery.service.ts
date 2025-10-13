import {
	TypeNewPasswordSchema,
	TypeResetPasswordSchema
} from '@/shared/schemas'
import { IUser } from '@/shared/types'
import { api } from '@/shared/utils'

class PasswordRecoveryService {
	public async reset(body: TypeResetPasswordSchema) {
		const response = await api.post<IUser>(
			'auth/password-recovery/reset',
			body
		)

		return response
	}

	public async new(body: TypeNewPasswordSchema, token: string | null) {
		const response = await api.post<IUser>(
			`auth/password-recovery/new/${token}`,
			body
		)

		return response
	}
}

export const passwordRecoveryService = new PasswordRecoveryService()
