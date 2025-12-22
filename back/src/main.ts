import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import RedisStore from 'connect-redis'
import type { Express, Request, Response } from 'express'
import IORedis from 'ioredis'

import { AppModule } from './app.module'
import { ms, StringValue } from './libs/common/utils/ms.util'
import { parseBoolean } from './libs/common/utils/parse-boolean.util'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as (
	secret?: string | string[]
) => any
// eslint-disable-next-line @typescript-eslint/no-require-imports
const session = require('express-session') as (options: any) => any

let cachedApp: INestApplication | null = null

async function bootstrap(): Promise<INestApplication> {
	if (cachedApp) {
		return cachedApp
	}

	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const redis = new IORedis(config.getOrThrow('REDIS_URI'))

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	const expressApp = app.getHttpAdapter().getInstance() as Express
	expressApp.set('trust proxy', 1)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	const rawSameSite = config.get<string>('SESSION_SAME_SITE') ?? 'lax'
	const sameSite = (
		['lax', 'none', 'strict'].includes(rawSameSite.toLowerCase())
			? rawSameSite.toLowerCase()
			: 'lax'
	) as 'lax' | 'none' | 'strict'
	const sessionDomain = config.get<string>('SESSION_DOMAIN') || undefined
	const sessionSecure =
		sameSite === 'none'
			? true
			: parseBoolean(config.getOrThrow<string>('SESSION_SECURE'))

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: sessionDomain,
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: sessionSecure,
				sameSite
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGINS'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
	})

	await app.init()

	cachedApp = app
	return app
}

if (process.env.NODE_ENV !== 'production') {
	void bootstrap()
		.then(app => {
			const config = app.get(ConfigService)
			const portRaw = config.get('APPLICATION_PORT')
			const port =
				typeof portRaw === 'string'
					? parseInt(portRaw, 10)
					: Number(portRaw)
			app.listen(port)
		})
		.catch(err => {
			console.error('Failed to start dev server:', err)
		})
}

export default async (req: Request, res: Response) => {
	const app = await bootstrap()
	const expressApp = app.getHttpAdapter().getInstance() as unknown as Express
	return expressApp(req, res)
}
