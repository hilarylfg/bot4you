export function extractContentDeltas(raw: string): string[] {
	return raw
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.startsWith('data: '))
		.map(line => line.slice(6)) // длина "data: " = 6
		.filter(json => json && json !== '[DONE]')
		.flatMap(json => {
			try {
				const { choices } = JSON.parse(json)
				return choices?.[0]?.delta?.content
					? [choices[0].delta.content]
					: []
			} catch {
				return []
			}
		})
}
