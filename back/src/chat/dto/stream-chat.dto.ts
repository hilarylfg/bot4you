import { Type } from 'class-transformer'
import {
	IsArray,
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator'

export class ChatMessageDto {
	@IsIn(['user', 'assistant', 'system'])
	role!: 'user' | 'assistant' | 'system'

	@IsString()
	content!: string
}

export class StreamChatDto {
	@IsString()
	prompt!: string

	@IsOptional()
	@IsString()
	model?: string

	@IsOptional()
	@IsNumber()
	temperature?: number

	@IsOptional()
	@IsNumber()
	maxTokens?: number

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ChatMessageDto)
	history?: ChatMessageDto[]
}
