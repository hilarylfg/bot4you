/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ValidationPipe } from '@nestjs/common'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import RedisStore from 'connect-redis'
import * as cookieParserImport from 'cookie-parser'
import express, { Request, Response } from 'express'
import * as sessionImport from 'express-session'
import IORedis from 'ioredis'

import { ms, StringValue } from '@/libs/common/utils/ms.util'
import { parseBoolean } from '@/libs/common/utils/parse-boolean.util'

import { AppModule } from './app.module'

const cookieParser = cookieParserImport as any
const session = sessionImport as any

let cachedApp: INestApplication | null = null

async function bootstrapServer(): Promise<INestApplication> {
	if (cachedApp) {
		return cachedApp
	}

	const expressApp = express()
	const app = await NestFactory.create(
		AppModule,
		new ExpressAdapter(expressApp)
	)

	const config = app.get(ConfigService)
	const redis = new IORedis(config.getOrThrow('REDIS_URI'))

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'lax'
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
		exposedHeaders: ['set-cookie']
	})

	await app.init()

	cachedApp = app
	return app
}

export default async (req: Request, res: Response): Promise<void> => {
	const app = await bootstrapServer()
	const httpAdapter = app.getHttpAdapter()
	const instance = httpAdapter.getInstance()
	return instance(req, res)
}
