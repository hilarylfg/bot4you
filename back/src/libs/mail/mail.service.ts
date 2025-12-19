import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { ConfirmationTemplate } from './templates/confirmation.template'
import { ResetPasswordTemplate } from './templates/reset-password.template'
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendConfirmationEmail(
		email: string,
		token: string
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS')
		const html = await render(ConfirmationTemplate({ domain, token }))

		await this.sendMail(email, 'Подтверждение почты', html)
	}

	public async sendPasswordResetEmail(
		email: string,
		token: string
	): Promise<void> {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS')
		const html = await render(ResetPasswordTemplate({ domain, token }))

		await this.sendMail(email, 'Сброс пароля', html)
	}

	public async sendTwoFactorTokenEmail(
		email: string,
		token: string
	): Promise<void> {
		const html = await render(TwoFactorAuthTemplate({ token }))

		await this.sendMail(email, 'Подтверждение вашей личности', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
