import { FetchClient } from './index'

export const api = new FetchClient({
	baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || '/api',
	options: {
		credentials: 'include'
	}
})
