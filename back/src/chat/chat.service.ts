import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'

import { StreamChatDto } from './dto/stream-chat.dto'

const DEFAULT_MODEL = 'openai/gpt-4o-mini'

@Injectable()
export class ChatService {
	private readonly openrouter: ReturnType<typeof createOpenRouter>

	constructor(private readonly config: ConfigService) {
		this.openrouter = createOpenRouter({
			apiKey: this.config.getOrThrow<string>('OPENROUTER_API_KEY'),
			baseURL:
				this.config.getOrThrow<string>('OPENROUTER_BASE_URL') ??
				undefined,
			headers: this.buildHeaders()
		})
	}

	streamChat(dto: StreamChatDto): ReturnType<typeof streamText> {
		const modelId = dto.model ?? DEFAULT_MODEL
		const messages = [
			...(dto.history ?? []),
			{ role: 'user' as const, content: dto.prompt }
		]

		return streamText({
			model: this.openrouter(modelId),
			messages,
			temperature: dto.temperature ?? 0.7,
			maxOutputTokens: dto.maxTokens
		})
	}

	private buildHeaders() {
		const referer = this.config.get<string>('OPENROUTER_REFERER')
		const title = this.config.get<string>('OPENROUTER_TITLE')
		return {
			...(referer ? { 'HTTP-Referer': referer } : {}),
			...(title ? { 'X-Title': title } : {})
		}
	}
}
