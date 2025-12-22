import { FetchClient } from './index'

export const api = new FetchClient({
	baseUrl: '/api',
	options: {
		credentials: 'include'
	}
})
