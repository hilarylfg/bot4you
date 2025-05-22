import { FetchClient } from '../utils'

export const api = new FetchClient({
	baseUrl: '/api/proxy/api/v1',
	options: {
		credentials: 'include'
	}
})