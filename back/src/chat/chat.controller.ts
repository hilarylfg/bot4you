import { Body, Controller, Post, Res } from '@nestjs/common'
import type { Response } from 'express'
import { Readable } from 'stream'

import { ChatService } from './chat.service'
import { StreamChatDto } from './dto/stream-chat.dto'

export const maxDuration = 30

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post('stream')
	stream(@Body() dto: StreamChatDto, @Res() res: Response) {
		const result = this.chatService.streamChat(dto)
		const response = result.toUIMessageStreamResponse()

		response.headers.forEach((value, key) => {
			res.setHeader(key, value)
		})

		if (response.body) {
			const nodeStream = Readable.fromWeb(
				response.body as ReadableStream<Uint8Array>
			)
			nodeStream.pipe(res)
		} else {
			res.end()
		}
	}
}
