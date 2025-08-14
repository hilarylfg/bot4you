'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface Props {
	content: string
}

export function MarkdownMessage({ content }: Props) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				code(props) {
					const { children, className, ...rest } = props
					const match = /language-(\w+)/.exec(className || '')
					return match ? (
						<SyntaxHighlighter
							language={match[1]}
							style={dark}
							PreTag='div'
							customStyle={{
								background: 'transparent',
								minWidth: '100%',
								border: 'none',
								boxShadow: 'none'
							}}
						>
							{String(children).replace(/\n$/, '')}
						</SyntaxHighlighter>
					) : (
						<code {...rest} className={className}>
							{children}
						</code>
					)
				}
			}}
		>
			{content}
		</ReactMarkdown>
	)
}
